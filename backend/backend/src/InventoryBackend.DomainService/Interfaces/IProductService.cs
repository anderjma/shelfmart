using InventoryBackend.Dto;

namespace InventoryBackend.DomainService.Interfaces;

public interface IProductService
{
    Task<IEnumerable<ProductDto>> GetAllProductsAsync();
    Task<ProductDto> CreateProductAsync(CreateProductDto dto);
}
