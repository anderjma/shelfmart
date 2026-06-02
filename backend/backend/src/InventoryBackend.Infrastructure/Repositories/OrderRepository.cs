using InventoryBackend.Domain.Entities;
using InventoryBackend.DomainService.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace InventoryBackend.Infrastructure.Repositories;

public class OrderRepository : IOrderRepository
{
    private readonly AppDbContext _context;

    public OrderRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Order?> GetActiveCartByUserIdAsync(Guid userId)
    {
        return await _context.Orders
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .FirstOrDefaultAsync(o => o.UserResourceId == userId && o.Status == "Cart");
    }

    public async Task<Order> CreateOrderAsync(Order order)
    {
        _context.Orders.Add(order);
        await _context.SaveChangesAsync();
        return order;
    }

    public async Task UpdateOrderAsync(Order order)
    {
        // MODO ESTRICTO: Revisamos manualmente los ítems del carrito.
        // Si hay un ítem nuevo que EF Core no reconoce (Detached), 
        // lo forzamos a estado "Added" para garantizar un INSERT en la BD.
        foreach (var item in order.OrderItems)
        {
            if (_context.Entry(item).State == EntityState.Detached)
            {
                _context.Entry(item).State = EntityState.Added;
            }
        }
        
        // EF Core ahora calculará las diferencias correctamente.
        await _context.SaveChangesAsync();
    }
}
