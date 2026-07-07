// This file implements transactional saving and hierarchical querying of orders and their items.
using ShelfMart.Domain.Entities;
using ShelfMart.DomainService.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ShelfMart.Infrastructure.Repositories;

// This class isolates the Entity Framework Core syntax needed to persist sales.
public class OrderRepository : IOrderRepository
{
    private readonly AppDbContext _context;

    public OrderRepository(AppDbContext context)
    {
        _context = context;
    }

    // This method retrieves the user's pending cart, including the full detail of their selected items.
    public async Task<Order?> GetActiveCartByUserIdAsync(Guid userId)
    {
        return await _context.Orders
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .FirstOrDefaultAsync(o => o.UserResourceId == userId && o.Status == "Cart");
    }

    // This method retrieves all orders that have gone through the successful final payment process.
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

    // This method transactionally inserts a new invoice with its purchase breakdown into the database.
    public async Task<Order> CreateOrderAsync(Order order)
    {
        _context.Orders.Add(order);
        await _context.SaveChangesAsync();
        return order;
    }

    // This method updates the purchase status and propagates the changes to the subordinate entities.
    public async Task UpdateOrderAsync(Order order)
    {
        // EF Core automatically tracks changes (new OrderItems, modified quantities, etc.)
        // because the Order entity was loaded in the same (Scoped) context.
        await _context.SaveChangesAsync();
    }

    // This method gathers the previous, completed purchase history for a specific customer.
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
