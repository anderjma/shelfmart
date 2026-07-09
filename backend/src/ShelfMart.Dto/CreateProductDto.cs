// This file specifies the mandatory parameters for registering a new item in inventory.
using System.ComponentModel.DataAnnotations;

namespace ShelfMart.Dto;

// This class validates the creation form data before integrating it into the domain service.
public class CreateProductDto
{
    public required string Name { get; set; }

    [Range(0, int.MaxValue, ErrorMessage = "Stock cannot be negative.")]
    public int Stock { get; set; }

    [Range(0, double.MaxValue, ErrorMessage = "Price cannot be negative.")]
    public decimal Price { get; set; }

    public string? ImageUrl { get; set; }
    public required string Category { get; set; }

    [Range(0, 100, ErrorMessage = "Discount percentage must be between 0 and 100.")]
    public decimal DiscountPercentage { get; set; }
}
