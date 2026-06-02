using InventoryBackend.Domain.Entities;
using InventoryBackend.DomainService.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InventoryBackend.Infrastructure.Repositories;

public class AuditRepository : IAuditRepository
{
    private readonly AppDbContext _context;

    public AuditRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<decimal> GetTotalRevenueAsync()
    {
        return await _context.Orders.Where(o => o.Status == "Completed").SumAsync(o => o.TotalAmount);
    }

    public async Task<int> GetTotalCompletedOrdersAsync()
    {
        return await _context.Orders.CountAsync(o => o.Status == "Completed");
    }

    public async Task<int> GetLowStockProductsCountAsync()
    {
        return await _context.Products.CountAsync(p => p.Stock <= 5);
    }

    public async Task<IEnumerable<AuditLog>> GetRecentAuditLogsAsync(int count)
    {
        return await _context.AuditLogs
            .OrderByDescending(a => a.Timestamp)
            .Take(count)
            .ToListAsync();
    }

    public async Task LogActionAsync(AuditLog log)
    {
        _context.AuditLogs.Add(log);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<Order>> GetOrdersFromLastDaysAsync(int days)
    {
        var orders = await _context.Orders
            .Where(o => o.Status == "Completed")
            .ToListAsync();
        
        // TRUCO DE RETROCOMPATIBILIDAD: 
        // Si la orden es vieja y su fecha quedó en "0001-01-01" por la migración,
        // le asignamos la fecha de hoy en memoria para que no se pierda del gráfico.
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
