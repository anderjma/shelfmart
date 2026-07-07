// This file contains the data model for commercial transactions performed in the system.
using System;
using System.Collections.Generic;
using ShelfMart.Domain.Enums;

namespace ShelfMart.Domain.Entities;

// This class represents a purchase order, storing both the total billed amount and the association to individual items.
public class Order
{
    public Guid OrderId { get; set; } = Guid.NewGuid();
    public Guid UserResourceId { get; set; }
    public User User { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public OrderStatus Status { get; set; } = OrderStatus.Cart;
    public decimal TotalAmount { get; set; }
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    // Creates a new active cart for the given user. This is the only supported way to start an order.
    public static Order CreateCart(Guid userId) => new() { UserResourceId = userId, Status = OrderStatus.Cart };

    // Transitions an active cart into a pending order at checkout time.
    public void MarkAsPending()
    {
        if (Status != OrderStatus.Cart)
        {
            throw new InvalidOperationException("Only an active cart can be checked out.");
        }

        Status = OrderStatus.Pending;
        CreatedAt = DateTime.UtcNow;
    }

    // Cancels the order, unless it has already reached a terminal state.
    public void Cancel()
    {
        if (Status is OrderStatus.Delivered or OrderStatus.Cancelled)
        {
            throw new InvalidOperationException($"Cannot cancel an order in {Status} status.");
        }

        Status = OrderStatus.Cancelled;
    }
}
