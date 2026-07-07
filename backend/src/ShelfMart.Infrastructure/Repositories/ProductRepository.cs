// This file translates product catalog operations into commands understood by the underlying database.
using ShelfMart.Domain.Entities;
using ShelfMart.DomainService.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ShelfMart.Infrastructure.Repositories;

// This class provides access to the products table, facilitating the creation and removal of stock.
public class ProductRepository : IProductRepository
{
    private readonly AppDbContext _context;

    public ProductRepository(AppDbContext context)
    {
        _context = context;
    }

    // This method retrieves the product catalog. By default, inactive (soft-deleted) products are excluded.
    public async Task<IEnumerable<Product>> GetAllAsync(bool includeInactive = false)
    {
        var query = _context.Products.AsNoTracking().AsQueryable();
        if (!includeInactive)
        {
            query = query.Where(p => p.IsActive);
        }

        return await query.ToListAsync();
    }

    // This method retrieves the available catalog, filtered and paginated at the database level.
    // Inactive (soft-deleted) products are always excluded, since this method backs customer-facing listings.
    public async Task<(IEnumerable<Product> Items, int TotalCount)> GetPaginatedAsync(int page, int pageSize, string? search, string? category)
    {
        var query = _context.Products.Where(p => p.IsActive).AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var searchLower = search.ToLower();
            query = query.Where(p => p.Name.ToLower().Contains(searchLower) ||
                                     (p.Category != null && p.Category.ToLower().Contains(searchLower)));
        }

        if (!string.IsNullOrWhiteSpace(category) && category != "All")
        {
            query = query.Where(p => p.Category == category);
        }

        int totalCount = await query.CountAsync();

        var items = await query.OrderBy(p => p.Name)
                              .Skip((page - 1) * pageSize)
                              .Take(pageSize)
                              .ToListAsync();

        return (items, totalCount);
    }

    // This method looks up and returns a single product using its global identifier.
    public async Task<Product?> GetByIdAsync(Guid id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            product = await _context.Products.FirstOrDefaultAsync(p => p.ProductResourceId == id);
        }
        return product;
    }

    // This method persists a new item in the inventory, committing the changes to the data layer.
    public async Task<Product> AddAsync(Product product)
    {
        _context.Products.Add(product);
        await _context.SaveChangesAsync();
        return product;
    }

    // This method updates the properties of an existing item, marking the entity as modified.
    public async Task UpdateAsync(Product product)
    {
        // This method saves the tracked changes to the database.
        await _context.SaveChangesAsync();
    }

    // This method permanently deletes a product after confirming its prior existence.
    public async Task DeleteAsync(Product product)
    {
        _context.Products.Remove(product);
        await _context.SaveChangesAsync();
    }
}
