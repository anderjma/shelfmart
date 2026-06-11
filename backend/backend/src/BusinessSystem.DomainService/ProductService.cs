// Este archivo provee los servicios de dominio necesarios para administrar el inventario de productos.
using BusinessSystem.Domain.Entities;
using BusinessSystem.DomainService.Interfaces;
using BusinessSystem.Dto;
using BusinessSystem.Exceptions;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace BusinessSystem.DomainService;

// Esta clase contiene la lógica de negocio para la gestión, creación y modificación de productos.
public class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;

    public ProductService(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    // Este método extrae el catálogo completo de productos y lo mapea hacia objetos de transferencia.
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

    // Este método extrae el catálogo de productos de forma paginada y filtrada, mapeándolo a DTOs.
    public async Task<PaginatedResultDto<ProductDto>> GetPaginatedProductsAsync(int page, int pageSize, string? search, string? category)
    {
        var (items, totalCount) = await _productRepository.GetPaginatedAsync(page, pageSize, search, category);
        
        var dtos = items.Select(p => new ProductDto
        {
            ProductResourceId = p.ProductResourceId,
            Name = p.Name,
            Category = p.Category,
            Stock = p.Stock,
            Price = p.Price,
            ImageUrl = p.ImageUrl,
            DiscountPercentage = p.DiscountPercentage,
            CreatedAt = p.CreatedAt
        }).ToList();

        return new PaginatedResultDto<ProductDto>
        {
            Items = dtos,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
    }

    // Este método busca un producto específico mediante su identificador único y verifica su existencia.
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

    // Este método inicializa y persiste un nuevo producto en el inventario aplicando valores por defecto si es necesario.
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
            CreatedAt = DateTime.UtcNow // Este valor registra la fecha y hora exacta del servidor.
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

    // Este método actualiza las propiedades modificables de un producto existente asegurando la integridad de los datos.
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

    // Este método elimina de manera permanente un producto del sistema tras confirmar su existencia.
    public async Task DeleteProductAsync(Guid id)
    {
        var product = await _productRepository.GetByIdAsync(id);
        if (product == null) throw new ResourceNotFoundException("Producto no encontrado.");

        await _productRepository.DeleteAsync(product);
    }
}
