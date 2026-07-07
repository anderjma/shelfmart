// This file defines the bridge structure between an invoice and the specific products purchased.
using System;

namespace ShelfMart.Domain.Entities;

// This class represents the exact quantity and cost at the time of sale of an individual item within a shopping cart.
public class OrderItem
{
    public Guid OrderItemId { get; set; } = Guid.NewGuid();
    public Guid OrderId { get; set; }
    public Order Order { get; set; } = null!;
    public Guid ProductResourceId { get; set; }
    public Product Product { get; set; } = null!;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
}
