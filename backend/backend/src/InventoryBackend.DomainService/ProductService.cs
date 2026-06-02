using InventoryBackend.Domain.Entities;
using InventoryBackend.DomainService.Interfaces;
using InventoryBackend.Dto;
using InventoryBackend.Exceptions;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

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
            Price = p.Price,
            ImageUrl = p.ImageUrl
        });
    }

    public async Task<ProductDto> GetProductByIdAsync(Guid id)
    {
        var product = await _productRepository.GetByIdAsync(id);
        if (product == null) throw new ResourceNotFoundException("Producto no encontrado.");

        return new ProductDto
        {
            ProductResourceId = product.ProductResourceId,
            Name = product.Name,
            Stock = product.Stock,
            Price = product.Price,
            ImageUrl = product.ImageUrl
        };
    }

    public async Task<ProductDto> CreateProductAsync(CreateProductDto dto)
    {
        var product = new Product
        {
            ProductResourceId = Guid.NewGuid(),
            Name = dto.Name,
            Stock = dto.Stock,
            Price = dto.Price,
            ImageUrl = dto.ImageUrl
        };

        var createdProduct = await _productRepository.AddAsync(product);

        return new ProductDto
        {
            ProductResourceId = createdProduct.ProductResourceId,
            Name = createdProduct.Name,
            Stock = createdProduct.Stock,
            Price = createdProduct.Price,
            ImageUrl = createdProduct.ImageUrl
        };
    }

    public async Task<ProductDto> UpdateProductAsync(Guid id, UpdateProductDto dto)
    {
        var product = await _productRepository.GetByIdAsync(id);
        if (product == null) throw new ResourceNotFoundException("Producto no encontrado.");

        product.Name = dto.Name;
        product.Stock = dto.Stock;
        product.Price = dto.Price;
        
        if (!string.IsNullOrEmpty(dto.ImageUrl)) 
        {
            product.ImageUrl = dto.ImageUrl;
        }

        await _productRepository.UpdateAsync(product);

        return new ProductDto
        {
            ProductResourceId = product.ProductResourceId,
            Name = product.Name,
            Stock = product.Stock,
            Price = product.Price,
            ImageUrl = product.ImageUrl
        };
    }

    public async Task DeleteProductAsync(Guid id)
    {
        var product = await _productRepository.GetByIdAsync(id);
        if (product == null) throw new ResourceNotFoundException("Producto no encontrado.");

        await _productRepository.DeleteAsync(product);
    }
}
