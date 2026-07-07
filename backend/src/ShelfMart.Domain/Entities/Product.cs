// This file hosts the structural schema of the items available in the sales catalog.
using System;
using System.Collections.Generic;

namespace ShelfMart.Domain.Entities;

// This class defines the specifications, quantities, and financial details associated with a physical or digital product in the inventory.
public class Product
{
    public Guid ProductResourceId { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Stock { get; set; }
    public decimal Price { get; set; }
    public string? ImageUrl { get; set; }
    public string Category { get; set; } = "General";

    // New real properties for marketing!
    public decimal DiscountPercentage { get; set; } = 0;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Soft-delete flag: inactive products are excluded from default catalog queries but remain in the database.
    public bool IsActive { get; set; } = true;

    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}
