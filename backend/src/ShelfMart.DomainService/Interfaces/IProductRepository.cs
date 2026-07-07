using ShelfMart.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ShelfMart.DomainService.Interfaces;

// This file constitutes the isolation layer for queries related to the general product registry.
public interface IProductRepository
{
    Task<IEnumerable<Product>> GetAllAsync();
    Task<(IEnumerable<Product> Items, int TotalCount)> GetPaginatedAsync(int page, int pageSize, string? search, string? category);
    Task<Product?> GetByIdAsync(Guid id);
    Task<Product> AddAsync(Product product);
    Task UpdateAsync(Product product);
    Task DeleteAsync(Product product);
}
