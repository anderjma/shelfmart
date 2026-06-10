// Este archivo especifica los parámetros obligatorios para registrar un nuevo artículo en inventario.
namespace BusinessSystem.Dto;

// Esta clase valida los datos del formulario de creación antes de integrarlos al servicio de dominio.
public class CreateProductDto
{
    public required string Name { get; set; }
    public int Stock { get; set; }
    public decimal Price { get; set; }
    public string? ImageUrl { get; set; }
    public required string Category { get; set; }
    public decimal DiscountPercentage { get; set; }
}
