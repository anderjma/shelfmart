// This file specifies the mandatory parameters for registering a new item in inventory.
namespace ShelfMart.Dto;

// This class validates the creation form data before integrating it into the domain service.
public class CreateProductDto
{
    public required string Name { get; set; }
    public int Stock { get; set; }
    public decimal Price { get; set; }
    public string? ImageUrl { get; set; }
    public required string Category { get; set; }
    public decimal DiscountPercentage { get; set; }
}
