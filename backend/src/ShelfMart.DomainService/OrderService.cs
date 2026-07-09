// This file centralizes the business rules for processing and managing shopping carts and orders.
using ShelfMart.Domain.Entities;
using ShelfMart.Domain.Enums;
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
        return orders.Select(MapToAdminOrderDto);
    }

    // This method retrieves the previous purchase history made by a specific customer.
    public async Task<IEnumerable<AdminOrderDto>> GetCustomerOrdersAsync(Guid userId)
    {
        var orders = await _orderRepository.GetOrdersByUserIdAsync(userId);
        return orders.Select(MapToAdminOrderDto);
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
            cart = Order.CreateCart(userId);
            isNewCart = true;
        }

        if (dto.Quantity <= 0) throw new BadRequestResponseException("Quantity must be greater than zero.");

        var existingItem = cart.OrderItems.FirstOrDefault(i => i.ProductResourceId == product.ProductResourceId);
        var requestedQuantity = (existingItem?.Quantity ?? 0) + dto.Quantity;
        if (product.Stock < requestedQuantity) throw new InsufficientStockException($"Insufficient stock. Available stock: {product.Stock}");

        var unitPrice = product.Price * (1 - product.DiscountPercentage / 100m);

        if (existingItem != null)
        {
            existingItem.Quantity = requestedQuantity;
            existingItem.UnitPrice = unitPrice;
        }
        else
        {
            cart.OrderItems.Add(new OrderItem
            {
                ProductResourceId = product.ProductResourceId,
                Product = product,
                Quantity = dto.Quantity,
                UnitPrice = unitPrice
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
            if (product.Stock < quantity) throw new InsufficientStockException($"Insufficient stock. Available stock: {product.Stock}");

            item.Quantity = quantity;
            item.UnitPrice = product.Price * (1 - product.DiscountPercentage / 100m);
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
    // Wrapped in an explicit transaction so two concurrent checkouts cannot both pass stock validation for the same product.
    public async Task<CartDto> CheckoutAsync(Guid userId)
    {
        return await _orderRepository.ExecuteInTransactionAsync(async () =>
        {
            var cart = await _orderRepository.GetActiveCartByUserIdAsync(userId);
            if (cart == null || !cart.OrderItems.Any()) throw new BadRequestResponseException("The cart is empty.");

            foreach (var item in cart.OrderItems)
            {
                var product = await _productRepository.GetByIdAsync(item.ProductResourceId);
                if (product == null) throw new NotFoundResponseException($"Product does not exist.");
                if (product.Stock < item.Quantity) throw new InsufficientStockException("Insufficient stock.");

                product.Stock -= item.Quantity;
            }

            cart.MarkAsPending();
            await _orderRepository.UpdateOrderAsync(cart);

            return MapToCartDto(cart);
        });
    }

    // This method transitions an order to a new status. Cancellation goes through the entity's own
    // invariant check and restores the stock that was deducted at checkout; other transitions are
    // plain assignments since no workflow engine is enforced yet.
    public async Task<AdminOrderDto> UpdateOrderStatusAsync(Guid orderId, OrderStatus newStatus)
    {
        var order = await _orderRepository.GetByIdAsync(orderId);
        if (order == null) throw new NotFoundResponseException("Order not found.");

        if (newStatus == OrderStatus.Cart)
        {
            throw new BadRequestResponseException("An order cannot be moved back to the Cart status.");
        }

        var wasAlreadyCancelled = order.Status == OrderStatus.Cancelled;

        try
        {
            if (newStatus == OrderStatus.Cancelled)
            {
                order.Cancel();
            }
            else
            {
                order.Status = newStatus;
            }
        }
        catch (InvalidOperationException ex)
        {
            throw new BadRequestResponseException(ex.Message);
        }

        if (newStatus == OrderStatus.Cancelled && !wasAlreadyCancelled)
        {
            await RestoreStockAsync(order);
        }

        await _orderRepository.UpdateOrderAsync(order);

        return MapToAdminOrderDto(order);
    }

    // This method lets a customer cancel their own order, but only while it is still Pending —
    // once an admin has moved it further along fulfillment (Confirmed/Shipped/Delivered), the
    // customer can no longer unilaterally cancel it. Restores stock just like the admin path.
    public async Task<AdminOrderDto> CancelOwnOrderAsync(Guid userId, Guid orderId)
    {
        var order = await _orderRepository.GetByIdAsync(orderId);
        if (order == null) throw new NotFoundResponseException("Order not found.");
        if (order.UserResourceId != userId) throw new NotFoundResponseException("Order not found.");

        if (order.Status != OrderStatus.Pending)
        {
            throw new BadRequestResponseException("Only orders that are still Pending can be cancelled by the customer.");
        }

        order.Cancel();
        await RestoreStockAsync(order);
        await _orderRepository.UpdateOrderAsync(order);

        return MapToAdminOrderDto(order);
    }

    // This method returns the stock deducted at checkout back to each product in a cancelled order.
    private async Task RestoreStockAsync(Order order)
    {
        foreach (var item in order.OrderItems)
        {
            var product = await _productRepository.GetByIdAsync(item.ProductResourceId);
            if (product != null) product.Stock += item.Quantity;
        }
    }

    // This method converts the database entity into a safe, standardized format for transmission to the client.
    private static CartDto MapToCartDto(Order order)
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

    // This method converts an order entity into the administrative representation used for reporting.
    private static AdminOrderDto MapToAdminOrderDto(Order order)
    {
        return new AdminOrderDto
        {
            OrderId = order.OrderId,
            CustomerUsername = order.User?.Username ?? "Unknown Customer",
            TotalAmount = order.TotalAmount,
            Status = order.Status.ToString(),
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
