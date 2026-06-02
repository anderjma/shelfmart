using System;

namespace InventoryBackend.Domain.Entities;

public class Product
{
    public Guid ProductResourceId { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public int Stock { get; set; }
    public decimal Price { get; set; }
}
