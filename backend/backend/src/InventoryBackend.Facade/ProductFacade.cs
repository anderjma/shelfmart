using InventoryBackend.DomainService.Interfaces;
using InventoryBackend.Dto;
using InventoryBackend.Facade.Interfaces;

namespace InventoryBackend.Facade;

public class ProductFacade : IProductFacade
{
    private readonly IProductService _productService;

    public ProductFacade(IProductService productService)
    {
        _productService = productService;
    }

    public async Task<IEnumerable<ProductDto>> GetAllProductsAsync()
    {
        return await _productService.GetAllProductsAsync();
    }

    public async Task<ProductDto> CreateProductAsync(CreateProductDto dto)
    {
        return await _productService.CreateProductAsync(dto);
    }
}
