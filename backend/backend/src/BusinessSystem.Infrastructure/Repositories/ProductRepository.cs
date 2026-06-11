// Este archivo traduce las operaciones del catálogo de productos en comandos que entiende la base de datos subyacente.
using BusinessSystem.Domain.Entities;
using BusinessSystem.DomainService.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BusinessSystem.Infrastructure.Repositories;

// Esta clase proporciona acceso a la tabla de productos, facilitando la creación y remoción de existencias.
public class ProductRepository : IProductRepository
{
    private readonly AppDbContext _context;

    public ProductRepository(AppDbContext context)
    {
        _context = context;
    }

    // Este método extrae todo el catálogo disponible en la base de datos sin aplicar filtros adicionales.
    public async Task<IEnumerable<Product>> GetAllAsync()
    {
        return await _context.Products.ToListAsync();
    }

    // Este método extrae el catálogo disponible filtrado y paginado a nivel de base de datos.
    public async Task<(IEnumerable<Product> Items, int TotalCount)> GetPaginatedAsync(int page, int pageSize, string? search, string? category)
    {
        var query = _context.Products.AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var searchLower = search.ToLower();
            query = query.Where(p => p.Name.ToLower().Contains(searchLower) || 
                                     (p.Category != null && p.Category.ToLower().Contains(searchLower)));
        }

        if (!string.IsNullOrWhiteSpace(category) && category != "Todas")
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

    // Este método rastrea y devuelve un producto individual empleando su identificador global.
    public async Task<Product?> GetByIdAsync(Guid id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            product = await _context.Products.FirstOrDefaultAsync(p => p.ProductResourceId == id);
        }
        return product;
    }

    // Este método persiste un nuevo elemento en el inventario, confirmando los cambios en la capa de datos.
    public async Task<Product> AddAsync(Product product)
    {
        _context.Products.Add(product);
        await _context.SaveChangesAsync();
        return product;
    }

    // Este método actualiza las propiedades de un artículo existente marcando la entidad como modificada.
    public async Task UpdateAsync(Product product)
    {
        // Este método guarda los cambios rastreados en la base de datos.
        await _context.SaveChangesAsync();
    }

    // Este método borra un producto definitivamente tras asegurar su existencia previa.
    public async Task DeleteAsync(Product product)
    {
        _context.Products.Remove(product);
        await _context.SaveChangesAsync();
    }
}
