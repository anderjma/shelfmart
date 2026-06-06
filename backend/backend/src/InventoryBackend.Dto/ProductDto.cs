using System;

namespace InventoryBackend.Dto;

public class ProductDto
{
    public Guid ProductResourceId { get; set; }
    public required string Name { get; set; }
    public int Stock { get; set; }
    public decimal Price { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string Category { get; set; } = "General";
}
