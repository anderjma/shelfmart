// This file defines the facade design pattern applied to inventory manipulation.
using ShelfMart.Dto;

namespace ShelfMart.Facade.Interfaces;

// This interface coordinates multiple subsystems behind the scenes when a catalog modification occurs.
public interface IProductFacade
{
    Task<IEnumerable<ProductDto>> GetAllProductsAsync();
    Task<PaginatedResultDto<ProductDto>> GetPaginatedProductsAsync(int page, int pageSize, string? search, string? category);
    Task<ProductDto> GetProductByIdAsync(Guid id);
    Task<ProductDto> CreateProductAsync(CreateProductDto dto);
    Task<ProductDto> UpdateProductAsync(Guid id, UpdateProductDto dto);
    Task DeleteProductAsync(Guid id);
}
