using BusinessSystem.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BusinessSystem.DomainService.Interfaces;

// Este archivo constituye la capa de aislamiento para las consultas relativas al registro general de productos.
public interface IProductRepository
{
    Task<IEnumerable<Product>> GetAllAsync();
    Task<(IEnumerable<Product> Items, int TotalCount)> GetPaginatedAsync(int page, int pageSize, string? search, string? category);
    Task<Product?> GetByIdAsync(Guid id);
    Task<Product> AddAsync(Product product);
    Task UpdateAsync(Product product);
    Task DeleteAsync(Product product);
}
