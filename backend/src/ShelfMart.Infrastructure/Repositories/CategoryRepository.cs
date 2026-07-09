// This file translates category catalog queries into commands understood by the underlying database.
using ShelfMart.Domain.Entities;
using ShelfMart.DomainService.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ShelfMart.Infrastructure.Repositories;

public class CategoryRepository : ICategoryRepository
{
    private readonly AppDbContext _context;

    public CategoryRepository(AppDbContext context)
    {
        _context = context;
    }

    // This method retrieves the full category reference catalog.
    public async Task<IEnumerable<Category>> GetAllAsync()
    {
        return await _context.Categories.AsNoTracking().OrderBy(c => c.Name).ToListAsync();
    }

    // This method checks whether a category name exists in the reference catalog, used to
    // validate product writes so Products.Category can never drift from Categories.
    public async Task<bool> ExistsByNameAsync(string name)
    {
        return await _context.Categories.AsNoTracking().AnyAsync(c => c.Name == name);
    }
}
