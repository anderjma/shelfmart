using InventoryBackend.Domain.Entities;
using InventoryBackend.DomainService.Interfaces;
using InventoryBackend.Dto;
using InventoryBackend.Exceptions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InventoryBackend.DomainService;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepository;
    private readonly IProductRepository _productRepository;

    public OrderService(IOrderRepository orderRepository, IProductRepository productRepository)
    {
        _orderRepository = orderRepository;
        _productRepository = productRepository;
    }

    public async Task<CartDto> GetCartAsync(Guid userId)
    {
        var cart = await _orderRepository.GetActiveCartByUserIdAsync(userId);
        if (cart == null) return new CartDto();

        return MapToCartDto(cart);
    }

    public async Task<IEnumerable<AdminOrderDto>> GetAllCompletedOrdersAsync()
    {
        var orders = await _orderRepository.GetAllCompletedOrdersAsync();
        return orders.Select(o => new AdminOrderDto
        {
            OrderId = o.OrderId,
            CustomerUsername = o.User?.Username ?? "Cliente Desconocido",
            TotalAmount = o.TotalAmount,
            Status = o.Status,
            Items = o.OrderItems.Select(i => new CartItemDto
            {
                ProductId = i.ProductResourceId,
                ProductName = i.Product?.Name ?? "Desconocido",
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice
            }).ToList()
        });
    }

    public async Task<IEnumerable<AdminOrderDto>> GetCustomerOrdersAsync(Guid userId)
    {
        var orders = await _orderRepository.GetOrdersByUserIdAsync(userId);
        return orders.Select(o => new AdminOrderDto
        {
            OrderId = o.OrderId,
            CustomerUsername = o.User?.Username ?? "Cliente",
            TotalAmount = o.TotalAmount,
            Status = o.Status,
            Items = o.OrderItems.Select(i => new CartItemDto
            {
                ProductId = i.ProductResourceId,
                ProductName = i.Product?.Name ?? "Desconocido",
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice
            }).ToList()
        });
    }

    public async Task<CartDto> AddItemToCartAsync(Guid userId, AddToCartDto dto)
    {
        var product = await _productRepository.GetByIdAsync(dto.ProductId);
        if (product == null) throw new NotFoundResponseException("Producto no encontrado.");

        var cart = await _orderRepository.GetActiveCartByUserIdAsync(userId);
        bool isNewCart = false;
        
        if (cart == null)
        {
            cart = new Order { UserResourceId = userId };
            isNewCart = true;
        }

        var existingItem = cart.OrderItems.FirstOrDefault(i => i.ProductResourceId == product.ProductResourceId);
        if (existingItem != null)
        {
            existingItem.Quantity += dto.Quantity;
        }
        else
        {
            cart.OrderItems.Add(new OrderItem
            {
                ProductResourceId = product.ProductResourceId,
                Product = product,
                Quantity = dto.Quantity,
                UnitPrice = product.Price
            });
        }

        cart.TotalAmount = cart.OrderItems.Sum(i => i.Quantity * i.UnitPrice);

        if (isNewCart) await _orderRepository.CreateOrderAsync(cart);
        else await _orderRepository.UpdateOrderAsync(cart);

        return MapToCartDto(cart);
    }

    public async Task<CartDto> CheckoutAsync(Guid userId)
    {
        var cart = await _orderRepository.GetActiveCartByUserIdAsync(userId);
        if (cart == null || !cart.OrderItems.Any()) throw new BadRequestResponseException("El carrito está vacío.");

        foreach (var item in cart.OrderItems)
        {
            var product = await _productRepository.GetByIdAsync(item.ProductResourceId);
            if (product == null) throw new NotFoundResponseException($"Producto no existe.");
            if (product.Stock < item.Quantity) throw new BadRequestResponseException($"Stock insuficiente.");

            product.Stock -= item.Quantity;
        }

        cart.Status = "Completed";
        cart.CreatedAt = DateTime.UtcNow;
        await _orderRepository.UpdateOrderAsync(cart);

        return MapToCartDto(cart);
    }

    private CartDto MapToCartDto(Order order)
    {
        return new CartDto
        {
            OrderId = order.OrderId,
            TotalAmount = order.TotalAmount,
            Items = order.OrderItems.Select(i => new CartItemDto
            {
                ProductId = i.ProductResourceId,
                ProductName = i.Product?.Name ?? "Desconocido",
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice
            }).ToList()
        };
    }
}
