using System;

namespace ShelfMart.Domain.Entities;

// This class represents a reference catalog entry used to classify products.
public class Category
{
    public Guid CategoryId { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
}
