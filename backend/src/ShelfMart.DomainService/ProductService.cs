// This file provides the domain services needed to manage the product inventory.
using ShelfMart.Domain.Entities;
using ShelfMart.DomainService.Interfaces;
using ShelfMart.Dto;
using ShelfMart.Exceptions;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.Extensions.Caching.Memory;

namespace ShelfMart.DomainService;

// This class contains the business logic for managing, creating, and modifying products.
public class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;
    private readonly IMemoryCache _cache;
    private const string AllProductsCacheKey = "AllProductsCache";

    public ProductService(IProductRepository productRepository, IMemoryCache cache)
    {
        _productRepository = productRepository;
        _cache = cache;
    }

    // This method retrieves the complete product catalog and maps it to transfer objects using cache.
    public async Task<IEnumerable<ProductDto>> GetAllProductsAsync()
    {
        if (!_cache.TryGetValue(AllProductsCacheKey, out IEnumerable<ProductDto>? cachedProducts))
        {
            var products = await _productRepository.GetAllAsync();
            cachedProducts = products.Select(ToDto).ToList();

            var cacheEntryOptions = new MemoryCacheEntryOptions()
                .SetAbsoluteExpiration(TimeSpan.FromMinutes(15));

            _cache.Set(AllProductsCacheKey, cachedProducts, cacheEntryOptions);
        }

        return cachedProducts!;
    }

    // This method retrieves the product catalog in a paginated and filtered form, mapping it to DTOs.
    public async Task<PaginatedResultDto<ProductDto>> GetPaginatedProductsAsync(int page, int pageSize, string? search, string? category)
    {
        var (items, totalCount) = await _productRepository.GetPaginatedAsync(page, pageSize, search, category);

        return new PaginatedResultDto<ProductDto>
        {
            Items = items.Select(ToDto).ToList(),
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
    }

    // This method looks up a specific product by its unique identifier and verifies its existence.
    public async Task<ProductDto> GetProductByIdAsync(Guid id)
    {
        var product = await _productRepository.GetByIdAsync(id);
        if (product == null) throw new ResourceNotFoundException("Product not found.");

        return ToDto(product);
    }

    // This method initializes and persists a new product in the inventory, applying default values if necessary.
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
            CreatedAt = DateTime.UtcNow // This value records the exact server date and time.
        };

        var createdProduct = await _productRepository.AddAsync(product);
        _cache.Remove(AllProductsCacheKey);

        return ToDto(createdProduct);
    }

    // This method updates the modifiable properties of an existing product while ensuring data integrity.
    public async Task<ProductDto> UpdateProductAsync(Guid id, UpdateProductDto dto)
    {
        var product = await _productRepository.GetByIdAsync(id);
        if (product == null) throw new ResourceNotFoundException("Product not found.");

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
        _cache.Remove(AllProductsCacheKey);

        return ToDto(product);
    }

    // This method deactivates a product instead of permanently deleting it, preserving its history
    // (e.g. past order items) while excluding it from default catalog queries.
    public async Task DeleteProductAsync(Guid id)
    {
        var product = await _productRepository.GetByIdAsync(id);
        if (product == null) throw new ResourceNotFoundException("Product not found.");

        product.IsActive = false;
        await _productRepository.UpdateAsync(product);
        _cache.Remove(AllProductsCacheKey);
    }

    // This method converts a product entity into its transfer object representation.
    private static ProductDto ToDto(Product product)
    {
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
}
