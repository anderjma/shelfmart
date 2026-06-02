using System;
using System.Collections.Generic;

namespace InventoryBackend.Domain.Entities;

public class Order
{
    public Guid OrderId { get; set; } = Guid.NewGuid();
    public Guid UserResourceId { get; set; }
    public User User { get; set; } = null!;
    public DateTime OrderDate { get; set; } = DateTime.UtcNow;
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = "Pending"; // Pending, Paid, Shipped, Cancelled
    
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}
