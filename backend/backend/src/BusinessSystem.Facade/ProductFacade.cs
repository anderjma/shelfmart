using BusinessSystem.DomainService.Interfaces;
using BusinessSystem.Dto;
using BusinessSystem.Facade.Interfaces;

namespace BusinessSystem.Facade;

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

    public async Task<ProductDto> GetProductByIdAsync(Guid id)
    {
        return await _productService.GetProductByIdAsync(id);
    }

    public async Task<ProductDto> CreateProductAsync(CreateProductDto dto)
    {
        return await _productService.CreateProductAsync(dto);
    }

    public async Task<ProductDto> UpdateProductAsync(Guid id, UpdateProductDto dto)
    {
        return await _productService.UpdateProductAsync(id, dto);
    }

    public async Task DeleteProductAsync(Guid id)
    {
        await _productService.DeleteProductAsync(id);
    }
}
