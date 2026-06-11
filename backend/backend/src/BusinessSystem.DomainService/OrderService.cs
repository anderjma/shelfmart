// Este archivo centraliza las reglas de negocio para el procesamiento y manejo de carritos de compras y pedidos.
using BusinessSystem.Domain.Entities;
using BusinessSystem.DomainService.Interfaces;
using BusinessSystem.Dto;
using BusinessSystem.Exceptions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BusinessSystem.DomainService;

// Esta clase orquesta el flujo completo de los pedidos, desde la adición al carrito hasta el checkout final.
public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepository;
    private readonly IProductRepository _productRepository;

    public OrderService(IOrderRepository orderRepository, IProductRepository productRepository)
    {
        _orderRepository = orderRepository;
        _productRepository = productRepository;
    }

    // Este método localiza el carrito activo del usuario actual o devuelve uno vacío en caso de no existir.
    public async Task<CartDto> GetCartAsync(Guid userId)
    {
        var cart = await _orderRepository.GetActiveCartByUserIdAsync(userId);
        if (cart == null) return new CartDto();

        return MapToCartDto(cart);
    }

    // Este método recopila todos los pedidos finalizados para presentarlos en los reportes administrativos.
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

    // Este método obtiene el historial de compras previas realizadas por un cliente en específico.
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

    // Este método procesa la adición de un producto al carrito, creando la orden si es necesario y consolidando cantidades.
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

    // Este método actualiza la cantidad de un producto específico en el carrito.
    public async Task<CartDto> UpdateItemQuantityAsync(Guid userId, Guid productId, int quantity)
    {
        var cart = await _orderRepository.GetActiveCartByUserIdAsync(userId);
        if (cart == null) throw new NotFoundResponseException("El carrito no existe.");

        var item = cart.OrderItems.FirstOrDefault(i => i.ProductResourceId == productId);
        if (item == null) throw new NotFoundResponseException("El producto no está en el carrito.");

        if (quantity <= 0)
        {
            cart.OrderItems.Remove(item);
        }
        else
        {
            var product = await _productRepository.GetByIdAsync(productId);
            if (product == null) throw new NotFoundResponseException("Producto no encontrado.");
            if (product.Stock < quantity) throw new BadRequestResponseException($"Stock insuficiente. Stock disponible: {product.Stock}");

            item.Quantity = quantity;
        }

        cart.TotalAmount = cart.OrderItems.Sum(i => i.Quantity * i.UnitPrice);
        await _orderRepository.UpdateOrderAsync(cart);

        return MapToCartDto(cart);
    }

    // Este método elimina un producto del carrito.
    public async Task<CartDto> RemoveItemFromCartAsync(Guid userId, Guid productId)
    {
        var cart = await _orderRepository.GetActiveCartByUserIdAsync(userId);
        if (cart == null) throw new NotFoundResponseException("El carrito no existe.");

        var item = cart.OrderItems.FirstOrDefault(i => i.ProductResourceId == productId);
        if (item != null)
        {
            cart.OrderItems.Remove(item);
            cart.TotalAmount = cart.OrderItems.Sum(i => i.Quantity * i.UnitPrice);
            await _orderRepository.UpdateOrderAsync(cart);
        }

        return MapToCartDto(cart);
    }

    // Este método valida el inventario disponible, efectúa el rebajo del stock y finaliza la transacción de la orden.
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

    // Este método convierte la entidad de base de datos a un formato seguro y estandarizado para la transmisión al cliente.
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
