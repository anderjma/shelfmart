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
            Category = p.Category,
            Stock = p.Stock,
            Price = p.Price,
            ImageUrl = p.ImageUrl,
            DiscountPercentage = p.DiscountPercentage,
            CreatedAt = p.CreatedAt
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
            Category = product.Category,
            Stock = product.Stock,
            Price = product.Price,
            ImageUrl = product.ImageUrl,
            DiscountPercentage = product.DiscountPercentage,
            CreatedAt = product.CreatedAt
        };
    }

    public async Task<ProductDto> CreateProductAsync(CreateProductDto dto)
    {
        var product = new Product
        {
            ProductResourceId = Guid.NewGuid(),
            Name = dto.Name,
            Category = string.IsNullOrWhiteSpace(dto.Category) ? "General" : dto.Category,
            Stock = dto.Stock,
            Price = dto.Price,
            ImageUrl = dto.ImageUrl,
            DiscountPercentage = dto.DiscountPercentage,
            CreatedAt = DateTime.UtcNow // Grabamos la fecha exacta del servidor
        };

        var createdProduct = await _productRepository.AddAsync(product);

        return new ProductDto
        {
            ProductResourceId = createdProduct.ProductResourceId,
            Name = createdProduct.Name,
            Category = createdProduct.Category,
            Stock = createdProduct.Stock,
            Price = createdProduct.Price,
            ImageUrl = createdProduct.ImageUrl,
            DiscountPercentage = createdProduct.DiscountPercentage,
            CreatedAt = createdProduct.CreatedAt
        };
    }

    public async Task<ProductDto> UpdateProductAsync(Guid id, UpdateProductDto dto)
    {
        var product = await _productRepository.GetByIdAsync(id);
        if (product == null) throw new ResourceNotFoundException("Producto no encontrado.");

        product.Name = dto.Name;
        product.Stock = dto.Stock;
        product.Price = dto.Price;
        product.DiscountPercentage = dto.DiscountPercentage;
        
        if (!string.IsNullOrWhiteSpace(dto.Category))
        {
            product.Category = dto.Category;
        }
        
        if (!string.IsNullOrEmpty(dto.ImageUrl)) 
        {
            product.ImageUrl = dto.ImageUrl;
        }

        await _productRepository.UpdateAsync(product);

        return new ProductDto
        {
            ProductResourceId = product.ProductResourceId,
            Name = product.Name,
            Category = product.Category,
            Stock = product.Stock,
            Price = product.Price,
            ImageUrl = product.ImageUrl,
            DiscountPercentage = product.DiscountPercentage,
            CreatedAt = product.CreatedAt
        };
    }

    public async Task DeleteProductAsync(Guid id)
    {
        var product = await _productRepository.GetByIdAsync(id);
        if (product == null) throw new ResourceNotFoundException("Producto no encontrado.");

        await _productRepository.DeleteAsync(product);
    }
}
