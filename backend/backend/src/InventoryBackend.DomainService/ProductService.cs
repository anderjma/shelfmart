using InventoryBackend.Domain.Entities;
using InventoryBackend.DomainService.Interfaces;
using InventoryBackend.Dto;

namespace InventoryBackend.DomainService;

public class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;

    public ProductService(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    public async Task<IEnumerable<ProductDto>> GetAllProductsAsync()
    {
        var products = await _productRepository.GetAllAsync();
        return products.Select(p => new ProductDto
        {
            ProductResourceId = p.ProductResourceId,
            Name = p.Name,
            Stock = p.Stock,
            Price = p.Price
        });
    }

    public async Task<ProductDto> CreateProductAsync(CreateProductDto dto)
    {
        var product = new Product
        {
            ProductResourceId = Guid.NewGuid(),
            Name = dto.Name,
            Stock = dto.Stock,
            Price = dto.Price
        };

        var createdProduct = await _productRepository.AddAsync(product);

        return new ProductDto
        {
            ProductResourceId = createdProduct.ProductResourceId,
            Name = createdProduct.Name,
            Stock = createdProduct.Stock,
            Price = createdProduct.Price
        };
    }
}
