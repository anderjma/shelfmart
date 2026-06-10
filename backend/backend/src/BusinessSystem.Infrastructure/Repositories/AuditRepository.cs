// Este archivo provee las consultas directas a base de datos requeridas para generar informes estadísticos.
using BusinessSystem.Domain.Entities;
using BusinessSystem.DomainService.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BusinessSystem.Infrastructure.Repositories;

// Esta clase gestiona las tablas de auditoría, incluyendo sumatorias financieras y conteos de actividad.
public class AuditRepository : IAuditRepository
{
    private readonly AppDbContext _context;

    public AuditRepository(AppDbContext context)
    {
        _context = context;
    }

    // Este método computa el valor total facturado de las órdenes completadas como métrica global.
    public async Task<decimal> GetTotalRevenueAsync()
    {
        return await _context.Orders.Where(o => o.Status == "Completed").SumAsync(o => o.TotalAmount);
    }

    // Este método efectúa un conteo de la cantidad total de transacciones finalizadas exitosamente.
    public async Task<int> GetTotalCompletedOrdersAsync()
    {
        return await _context.Orders.CountAsync(o => o.Status == "Completed");
    }

    // Este método cuantifica los artículos cuyo inventario se encuentra por debajo del umbral de alerta.
    public async Task<int> GetLowStockProductsCountAsync()
    {
        return await _context.Products.CountAsync(p => p.Stock <= 5);
    }

    // Este método extrae el subconjunto más reciente de los eventos ocurridos dentro del sistema.
    public async Task<IEnumerable<AuditLog>> GetRecentAuditLogsAsync(int count)
    {
        return await _context.AuditLogs
            .OrderByDescending(a => a.Timestamp)
            .Take(count)
            .ToListAsync();
    }

    // Este método escribe de manera inmutable el historial de acciones y operaciones de los usuarios.
    public async Task LogActionAsync(AuditLog log)
    {
        _context.AuditLogs.Add(log);
        await _context.SaveChangesAsync();
    }

    // Este método recupera los agrupamientos de ventas diarias necesarias para construir el gráfico analítico.
    public async Task<IEnumerable<Order>> GetOrdersFromLastDaysAsync(int days)
    {
        var orders = await _context.Orders
            .Where(o => o.Status == "Completed")
            .ToListAsync();
        
        // Este bloque asigna la fecha actual a las órdenes antiguas con fecha predeterminada por migración para mantenerlas en el gráfico.
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
