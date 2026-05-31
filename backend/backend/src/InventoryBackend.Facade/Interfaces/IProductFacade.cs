using InventoryBackend.Dto;

namespace InventoryBackend.Facade.Interfaces;

public interface IProductFacade
{
    Task<IEnumerable<ProductDto>> GetAllProductsAsync();
    Task<ProductDto> CreateProductAsync(CreateProductDto dto);
}
