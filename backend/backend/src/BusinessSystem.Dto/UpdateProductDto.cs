// Este archivo centraliza los campos permitidos durante la modificación de un producto en el sistema.
namespace BusinessSystem.Dto;

// Esta clase modela los datos esperados en una solicitud de actualización de inventario por parte de los administradores.
public class UpdateProductDto
{
    public required string Name { get; set; }
    public int Stock { get; set; }
    public decimal Price { get; set; }
    public string? ImageUrl { get; set; }
    public required string Category { get; set; }
    public decimal DiscountPercentage { get; set; }
}
