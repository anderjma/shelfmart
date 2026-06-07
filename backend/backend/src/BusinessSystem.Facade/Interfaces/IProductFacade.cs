using BusinessSystem.Dto;

namespace BusinessSystem.Facade.Interfaces;

public interface IProductFacade
{
    Task<IEnumerable<ProductDto>> GetAllProductsAsync();
    Task<ProductDto> GetProductByIdAsync(Guid id);
    Task<ProductDto> CreateProductAsync(CreateProductDto dto);
    Task<ProductDto> UpdateProductAsync(Guid id, UpdateProductDto dto);
    Task DeleteProductAsync(Guid id);
}
