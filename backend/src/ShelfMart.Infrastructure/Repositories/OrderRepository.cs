// This file implements transactional saving and hierarchical querying of orders and their items.
using ShelfMart.Domain.Entities;
using ShelfMart.Domain.Enums;
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
            .FirstOrDefaultAsync(o => o.UserResourceId == userId && o.Status == OrderStatus.Cart);
    }

    // This method retrieves a single order by its identifier, including its items.
    public async Task<Order?> GetByIdAsync(Guid orderId)
    {
        return await _context.Orders
            .Include(o => o.User)
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .FirstOrDefaultAsync(o => o.OrderId == orderId);
    }

    // This method retrieves all orders that have gone through the successful final payment process.
    public async Task<IEnumerable<Order>> GetAllCompletedOrdersAsync()
    {
        return await _context.Orders
            .Include(o => o.User)
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .Where(o => o.Status != OrderStatus.Cart)
            .OrderByDescending(o => o.CreatedAt)
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

    // This method gathers the previous purchase history for a specific customer, across all non-cart statuses.
    public async Task<IEnumerable<Order>> GetOrdersByUserIdAsync(Guid userId)
    {
        return await _context.Orders
            .Include(o => o.User)
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .Where(o => o.UserResourceId == userId && o.Status != OrderStatus.Cart)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
    }

    // Executes the given operation within an explicit database transaction, committing on success and rolling back on failure.
    public async Task<T> ExecuteInTransactionAsync<T>(Func<Task<T>> operation)
    {
        var strategy = _context.Database.CreateExecutionStrategy();
        return await strategy.ExecuteAsync(async () =>
        {
            await using var transaction = await _context.Database.BeginTransactionAsync();
            var result = await operation();
            await transaction.CommitAsync();
            return result;
        });
    }
}
