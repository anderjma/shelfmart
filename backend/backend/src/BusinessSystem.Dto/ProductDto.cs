// Este archivo expone las propiedades visibles de los productos en el catálogo de cara al cliente.
using System;
namespace BusinessSystem.Dto;

// Esta clase sirve como contenedor seguro para enviar los detalles de un artículo sin exponer sus relaciones internas.
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
