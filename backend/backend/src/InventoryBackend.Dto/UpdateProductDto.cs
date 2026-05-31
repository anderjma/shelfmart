namespace InventoryBackend.Dto;

public class UpdateProductDto
{
    public required string Name { get; set; }
    public int Stock { get; set; }
    public decimal Price { get; set; }
}
