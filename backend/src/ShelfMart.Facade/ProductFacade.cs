// This file groups and simplifies inventory-related interactions so they can be consumed by the controllers.
using ShelfMart.DomainService.Interfaces;
using ShelfMart.Dto;
using ShelfMart.Facade.Interfaces;

namespace ShelfMart.Facade;

// This class delegates product catalog operations and ensures events are sent to the audit service when necessary.
public class ProductFacade : IProductFacade
{
    private readonly IProductService _productService;

    public ProductFacade(IProductService productService)
    {
        _productService = productService;
    }

    // This method acts as an intermediary for retrieving all products from the domain service.
    public async Task<IEnumerable<ProductDto>> GetAllProductsAsync()
    {
        return await _productService.GetAllProductsAsync();
    }

    // This method acts as an intermediary for the paginated and filtered retrieval of products.
    public async Task<PaginatedResultDto<ProductDto>> GetPaginatedProductsAsync(int page, int pageSize, string? search, string? category)
    {
        return await _productService.GetPaginatedProductsAsync(page, pageSize, search, category);
    }

    // This method acts as an intermediary for the individual query of a product to the domain layer.
    public async Task<ProductDto> GetProductByIdAsync(Guid id)
    {
        return await _productService.GetProductByIdAsync(id);
    }

    // This method invokes the product creation service with the model provided by the client.
    public async Task<ProductDto> CreateProductAsync(CreateProductDto dto)
    {
        return await _productService.CreateProductAsync(dto);
    }

    // This method communicates changes to a product's properties to the underlying service.
    public async Task<ProductDto> UpdateProductAsync(Guid id, UpdateProductDto dto)
    {
        return await _productService.UpdateProductAsync(id, dto);
    }

    // This method requests the permanent deletion of an inventory item through the domain interface.
    public async Task DeleteProductAsync(Guid id)
    {
        await _productService.DeleteProductAsync(id);
    }
}
