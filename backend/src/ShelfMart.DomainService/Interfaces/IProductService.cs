// This file establishes the base specifications for managing items within the catalog.
using ShelfMart.Dto;

namespace ShelfMart.DomainService.Interfaces;

public interface IProductService
{
    Task<IEnumerable<ProductDto>> GetAllProductsAsync();
    Task<PaginatedResultDto<ProductDto>> GetPaginatedProductsAsync(int page, int pageSize, string? search, string? category);
    Task<ProductDto> GetProductByIdAsync(Guid id);
    Task<ProductDto> CreateProductAsync(CreateProductDto dto);
    Task<ProductDto> UpdateProductAsync(Guid id, UpdateProductDto dto);
    Task DeleteProductAsync(Guid id);
}
