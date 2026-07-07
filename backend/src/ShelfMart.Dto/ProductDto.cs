// This file exposes the customer-facing visible properties of products in the catalog.
using System;
namespace ShelfMart.Dto;

// This class serves as a safe container for sending item details without exposing its internal relationships.
public class ProductDto
{
    public Guid ProductResourceId { get; set; }
    public required string Name { get; set; }
    public int Stock { get; set; }
    public decimal Price { get; set; }
    public string? ImageUrl { get; set; }
    public required string Category { get; set; }
    public decimal DiscountPercentage { get; set; }
    public DateTime CreatedAt { get; set; }
}
