namespace BusinessSystem.Dto;

public class UpdateProductDto
{
    public string Name { get; set; }
    public int Stock { get; set; }
    public decimal Price { get; set; }
    public string? ImageUrl { get; set; }
    public string Category { get; set; }
    public decimal DiscountPercentage { get; set; }
}
