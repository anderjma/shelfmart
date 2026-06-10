// Este archivo implementa el guardado transaccional y consulta jerárquica de los pedidos y sus artículos.
using BusinessSystem.Domain.Entities;
using BusinessSystem.DomainService.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BusinessSystem.Infrastructure.Repositories;

// Esta clase se encarga de aislar la sintaxis de Entity Framework Core necesaria para persistir ventas.
public class OrderRepository : IOrderRepository
{
    private readonly AppDbContext _context;

    public OrderRepository(AppDbContext context)
    {
        _context = context;
    }

    // Este método recupera el carrito pendiente del usuario incluyendo todo el detalle de sus artículos seleccionados.
    public async Task<Order?> GetActiveCartByUserIdAsync(Guid userId)
    {
        return await _context.Orders
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .FirstOrDefaultAsync(o => o.UserResourceId == userId && o.Status == "Cart");
    }

    // Este método obtiene todos los pedidos que han pasado por el proceso final de pago exitoso.
    public async Task<IEnumerable<Order>> GetAllCompletedOrdersAsync()
    {
        return await _context.Orders
            .Include(o => o.User)
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .Where(o => o.Status != "Cart")
            .OrderByDescending(o => o.OrderId)
            .ToListAsync();
    }

    // Este método inserta de forma transaccional una nueva factura con su desglose de compras en la base de datos.
    public async Task<Order> CreateOrderAsync(Order order)
    {
        _context.Orders.Add(order);
        await _context.SaveChangesAsync();
        return order;
    }

    // Este método actualiza el estado de la compra y propaga los cambios a las entidades subordinadas.
    public async Task UpdateOrderAsync(Order order)
    {
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

    // Este método recaba el historial de compras previo y completado correspondiente a un cliente en específico.
    public async Task<IEnumerable<Order>> GetOrdersByUserIdAsync(Guid userId)
    {
        return await _context.Orders
            .Include(o => o.User)
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .Where(o => o.UserResourceId == userId && o.Status == "Completed")
            .OrderByDescending(o => o.OrderId)
            .ToListAsync();
    }
}
