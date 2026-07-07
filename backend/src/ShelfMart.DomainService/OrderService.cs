// This file centralizes the business rules for processing and managing shopping carts and orders.
using ShelfMart.Domain.Entities;
using ShelfMart.DomainService.Interfaces;
using ShelfMart.Dto;
using ShelfMart.Exceptions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ShelfMart.DomainService;

// This class orchestrates the complete order flow, from adding to the cart through final checkout.
public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepository;
    private readonly IProductRepository _productRepository;

    public OrderService(IOrderRepository orderRepository, IProductRepository productRepository)
    {
        _orderRepository = orderRepository;
        _productRepository = productRepository;
    }

    // This method locates the current user's active cart or returns an empty one if none exists.
    public async Task<CartDto> GetCartAsync(Guid userId)
    {
        var cart = await _orderRepository.GetActiveCartByUserIdAsync(userId);
        if (cart == null) return new CartDto();

        return MapToCartDto(cart);
    }

    // This method collects all completed orders for presentation in administrative reports.
    public async Task<IEnumerable<AdminOrderDto>> GetAllCompletedOrdersAsync()
    {
        var orders = await _orderRepository.GetAllCompletedOrdersAsync();
        return orders.Select(o => new AdminOrderDto
        {
            OrderId = o.OrderId,
            CustomerUsername = o.User?.Username ?? "Unknown Customer",
            TotalAmount = o.TotalAmount,
            Status = o.Status,
            Items = o.OrderItems.Select(i => new CartItemDto
            {
                ProductId = i.ProductResourceId,
                ProductName = i.Product?.Name ?? "Unknown",
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice
            }).ToList()
        });
    }

    // This method retrieves the previous purchase history made by a specific customer.
    public async Task<IEnumerable<AdminOrderDto>> GetCustomerOrdersAsync(Guid userId)
    {
        var orders = await _orderRepository.GetOrdersByUserIdAsync(userId);
        return orders.Select(o => new AdminOrderDto
        {
            OrderId = o.OrderId,
            CustomerUsername = o.User?.Username ?? "Customer",
            TotalAmount = o.TotalAmount,
            Status = o.Status,
            Items = o.OrderItems.Select(i => new CartItemDto
            {
                ProductId = i.ProductResourceId,
                ProductName = i.Product?.Name ?? "Unknown",
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice
            }).ToList()
        });
    }

    // This method processes adding a product to the cart, creating the order if necessary and consolidating quantities.
    public async Task<CartDto> AddItemToCartAsync(Guid userId, AddToCartDto dto)
    {
        var product = await _productRepository.GetByIdAsync(dto.ProductId);
        if (product == null) throw new NotFoundResponseException("Product not found.");

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

    // This method updates the quantity of a specific product in the cart.
    public async Task<CartDto> UpdateItemQuantityAsync(Guid userId, Guid productId, int quantity)
    {
        var cart = await _orderRepository.GetActiveCartByUserIdAsync(userId);
        if (cart == null) throw new NotFoundResponseException("The cart does not exist.");

        var item = cart.OrderItems.FirstOrDefault(i => i.ProductResourceId == productId);
        if (item == null) throw new NotFoundResponseException("The product is not in the cart.");

        if (quantity <= 0)
        {
            cart.OrderItems.Remove(item);
        }
        else
        {
            var product = await _productRepository.GetByIdAsync(productId);
            if (product == null) throw new NotFoundResponseException("Product not found.");
            if (product.Stock < quantity) throw new BadRequestResponseException($"Insufficient stock. Available stock: {product.Stock}");

            item.Quantity = quantity;
        }

        cart.TotalAmount = cart.OrderItems.Sum(i => i.Quantity * i.UnitPrice);
        await _orderRepository.UpdateOrderAsync(cart);

        return MapToCartDto(cart);
    }

    // This method removes a product from the cart.
    public async Task<CartDto> RemoveItemFromCartAsync(Guid userId, Guid productId)
    {
        var cart = await _orderRepository.GetActiveCartByUserIdAsync(userId);
        if (cart == null) throw new NotFoundResponseException("The cart does not exist.");

        var item = cart.OrderItems.FirstOrDefault(i => i.ProductResourceId == productId);
        if (item != null)
        {
            cart.OrderItems.Remove(item);
            cart.TotalAmount = cart.OrderItems.Sum(i => i.Quantity * i.UnitPrice);
            await _orderRepository.UpdateOrderAsync(cart);
        }

        return MapToCartDto(cart);
    }

    // This method validates available inventory, deducts stock, and finalizes the order transaction.
    public async Task<CartDto> CheckoutAsync(Guid userId)
    {
        var cart = await _orderRepository.GetActiveCartByUserIdAsync(userId);
        if (cart == null || !cart.OrderItems.Any()) throw new BadRequestResponseException("The cart is empty.");

        foreach (var item in cart.OrderItems)
        {
            var product = await _productRepository.GetByIdAsync(item.ProductResourceId);
            if (product == null) throw new NotFoundResponseException($"Product does not exist.");
            if (product.Stock < item.Quantity) throw new BadRequestResponseException($"Insufficient stock.");

            product.Stock -= item.Quantity;
        }

        cart.Status = "Completed";
        cart.CreatedAt = DateTime.UtcNow;
        await _orderRepository.UpdateOrderAsync(cart);

        return MapToCartDto(cart);
    }

    // This method converts the database entity into a safe, standardized format for transmission to the client.
    private CartDto MapToCartDto(Order order)
    {
        return new CartDto
        {
            OrderId = order.OrderId,
            TotalAmount = order.TotalAmount,
            Items = order.OrderItems.Select(i => new CartItemDto
            {
                ProductId = i.ProductResourceId,
                ProductName = i.Product?.Name ?? "Unknown",
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice
            }).ToList()
        };
    }
}
