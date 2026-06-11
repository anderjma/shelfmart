// Este archivo define el patrón de diseño fachada aplicado a la manipulación de inventario.
using BusinessSystem.Dto;

namespace BusinessSystem.Facade.Interfaces;

// Esta interfaz coordina a múltiples subsistemas detrás de escena cuando ocurre una modificación del catálogo.
public interface IProductFacade
{
    Task<IEnumerable<ProductDto>> GetAllProductsAsync();
    Task<PaginatedResultDto<ProductDto>> GetPaginatedProductsAsync(int page, int pageSize, string? search, string? category);
    Task<ProductDto> GetProductByIdAsync(Guid id);
    Task<ProductDto> CreateProductAsync(CreateProductDto dto);
    Task<ProductDto> UpdateProductAsync(Guid id, UpdateProductDto dto);
    Task DeleteProductAsync(Guid id);
}
