using System;
using System.Collections.Generic;

namespace InventoryBackend.Domain.Entities;

public class Order
{
    public Guid OrderId { get; set; } = Guid.NewGuid();
    public Guid UserResourceId { get; set; }
    public User User { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string Status { get; set; } = "Cart"; // Estados: Cart, Completed, Cancelled
    public decimal TotalAmount { get; set; }
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}
