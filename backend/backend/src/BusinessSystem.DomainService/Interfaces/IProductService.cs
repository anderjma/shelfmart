// Este archivo establece las especificaciones base para la administración de elementos dentro del catálogo.
using BusinessSystem.Dto;

namespace BusinessSystem.DomainService.Interfaces;

public interface IProductService
{
    Task<IEnumerable<ProductDto>> GetAllProductsAsync();
    Task<PaginatedResultDto<ProductDto>> GetPaginatedProductsAsync(int page, int pageSize, string? search, string? category);
    Task<ProductDto> GetProductByIdAsync(Guid id);
    Task<ProductDto> CreateProductAsync(CreateProductDto dto);
    Task<ProductDto> UpdateProductAsync(Guid id, UpdateProductDto dto);
    Task DeleteProductAsync(Guid id);
}
