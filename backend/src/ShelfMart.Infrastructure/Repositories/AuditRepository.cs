// This file provides the direct database queries required to generate statistical reports.
using ShelfMart.Domain.Entities;
using ShelfMart.Domain.Enums;
using ShelfMart.DomainService.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ShelfMart.Infrastructure.Repositories;

// This class manages the audit tables, including financial sums and activity counts.
public class AuditRepository : IAuditRepository
{
    private readonly AppDbContext _context;

    public AuditRepository(AppDbContext context)
    {
        _context = context;
    }

    // This method computes the total billed value of completed orders as a global metric.
    public async Task<decimal> GetTotalRevenueAsync()
    {
        return await _context.Orders
            .Where(o => o.Status != OrderStatus.Cart && o.Status != OrderStatus.Cancelled)
            .SumAsync(o => o.TotalAmount);
    }

    // This method counts the total number of successfully completed transactions.
    public async Task<int> GetTotalCompletedOrdersAsync()
    {
        return await _context.Orders
            .CountAsync(o => o.Status != OrderStatus.Cart && o.Status != OrderStatus.Cancelled);
    }

    // This method quantifies the active items whose inventory is below the alert threshold.
    public async Task<int> GetLowStockProductsCountAsync()
    {
        return await _context.Products.CountAsync(p => p.IsActive && p.Stock <= 5);
    }

    // This method counts the total number of registered customer accounts.
    public async Task<int> GetTotalCustomersCountAsync()
    {
        return await _context.Users
            .CountAsync(u => u.UserRoles.Any(ur => ur.Role.Name == "Customer"));
    }

    // This method retrieves a page of audit log entries, most recent first.
    public async Task<(IEnumerable<AuditLog> Items, int TotalCount)> GetPaginatedAuditLogsAsync(int page, int pageSize)
    {
        var query = _context.AuditLogs.OrderByDescending(a => a.Timestamp);

        var totalCount = await query.CountAsync();
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    // This method immutably writes the history of user actions and operations.
    public async Task LogActionAsync(AuditLog log)
    {
        _context.AuditLogs.Add(log);
        await _context.SaveChangesAsync();
    }

    // This method retrieves the daily sales groupings needed to build the analytics chart.
    public async Task<IEnumerable<Order>> GetOrdersFromLastDaysAsync(int days)
    {
        var dateThreshold = DateTime.UtcNow.AddDays(-days);

        return await _context.Orders
            .AsNoTracking()
            .Where(o => o.Status != OrderStatus.Cart && o.Status != OrderStatus.Cancelled && o.CreatedAt >= dateThreshold)
            .ToListAsync();
    }
}
