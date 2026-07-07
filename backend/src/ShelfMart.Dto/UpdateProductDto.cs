// This file centralizes the fields allowed when modifying a product in the system.
namespace ShelfMart.Dto;

// This class models the data expected in an inventory update request made by administrators.
public class UpdateProductDto
{
    public required string Name { get; set; }
    public int Stock { get; set; }
    public decimal Price { get; set; }
    public string? ImageUrl { get; set; }
    public required string Category { get; set; }
    public decimal DiscountPercentage { get; set; }
}
