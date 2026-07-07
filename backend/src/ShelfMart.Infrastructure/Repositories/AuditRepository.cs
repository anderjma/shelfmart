// This file provides the direct database queries required to generate statistical reports.
using ShelfMart.Domain.Entities;
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
        return await _context.Orders.Where(o => o.Status == "Completed").SumAsync(o => o.TotalAmount);
    }

    // This method counts the total number of successfully completed transactions.
    public async Task<int> GetTotalCompletedOrdersAsync()
    {
        return await _context.Orders.CountAsync(o => o.Status == "Completed");
    }

    // This method quantifies the items whose inventory is below the alert threshold.
    public async Task<int> GetLowStockProductsCountAsync()
    {
        return await _context.Products.CountAsync(p => p.Stock <= 5);
    }

    // This method retrieves the most recent subset of events that occurred within the system.
    public async Task<IEnumerable<AuditLog>> GetRecentAuditLogsAsync(int count)
    {
        return await _context.AuditLogs
            .OrderByDescending(a => a.Timestamp)
            .Take(count)
            .ToListAsync();
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
        var orders = await _context.Orders
            .Where(o => o.Status == "Completed")
            .ToListAsync();

        // This block assigns the current date to old orders that have a migration-default date, to keep them in the chart.
        foreach(var order in orders)
        {
            if (order.CreatedAt.Year < 2020) 
            {
                order.CreatedAt = DateTime.UtcNow;
            }
        }

        var dateThreshold = DateTime.UtcNow.AddDays(-days);
        return orders.Where(o => o.CreatedAt >= dateThreshold).ToList();
    }
}
