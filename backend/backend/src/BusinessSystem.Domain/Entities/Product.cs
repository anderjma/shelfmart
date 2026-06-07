using System;
using System.Collections.Generic;

namespace BusinessSystem.Domain.Entities;

public class Product
{
    public Guid ProductResourceId { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Stock { get; set; }
    public decimal Price { get; set; }
    public string? ImageUrl { get; set; }
    public string Category { get; set; } = "General";
    
    // ¡Nuevas propiedades reales para marketing!
    public decimal DiscountPercentage { get; set; } = 0;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}
