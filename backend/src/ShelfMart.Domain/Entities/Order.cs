// This file contains the data model for commercial transactions performed in the system.
using System;
using System.Collections.Generic;

namespace ShelfMart.Domain.Entities;

// This class represents a purchase order, storing both the total billed amount and the association to individual items.
public class Order
{
    public Guid OrderId { get; set; } = Guid.NewGuid();
    public Guid UserResourceId { get; set; }
    public User User { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string Status { get; set; } = "Cart"; // States: Cart, Completed, Cancelled
    public decimal TotalAmount { get; set; }
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}
