using InventoryBackend.Domain.Entities;
using InventoryBackend.DomainService.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
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

    public async Task<IEnumerable<Order>> GetAllCompletedOrdersAsync()
    {
        // Traemos todas las órdenes que ya salieron del carrito
        return await _context.Orders
            .Include(o => o.User)
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .Where(o => o.Status != "Cart")
            .OrderByDescending(o => o.OrderId)
            .ToListAsync();
    }

    public async Task<Order> CreateOrderAsync(Order order)
    {
        _context.Orders.Add(order);
        await _context.SaveChangesAsync();
        return order;
    }

    public async Task UpdateOrderAsync(Order order)
    {
        // ¡LA PIEZA CLAVE! Obligamos a EF Core a reconocer que el estado cambió
        _context.Entry(order).State = EntityState.Modified;

        foreach (var item in order.OrderItems)
        {
            if (_context.Entry(item).State == EntityState.Detached)
            {
                _context.Entry(item).State = EntityState.Added;
            }
        }
        await _context.SaveChangesAsync();
    }
}
