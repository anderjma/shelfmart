// Este archivo contiene la lógica para la gestión y recolección de los registros de auditoría del sistema.
using BusinessSystem.Domain.Entities;
using BusinessSystem.DomainService.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BusinessSystem.DomainService;

// Esta clase expone las métricas principales y los historiales de acceso para el panel de administración.
public class AuditService : IAuditService
{
    private readonly IAuditRepository _auditRepository;

    public AuditService(IAuditRepository auditRepository)
    {
        _auditRepository = auditRepository;
    }

    // Este método consolida las métricas globales del negocio para su visualización en el dashboard principal.
    public async Task<object> GetDashboardStatsAsync()
    {
        var totalRevenue = await _auditRepository.GetTotalRevenueAsync();
        var totalOrders = await _auditRepository.GetTotalCompletedOrdersAsync();
        var lowStock = await _auditRepository.GetLowStockProductsCountAsync();

        var recentOrders = await _auditRepository.GetOrdersFromLastDaysAsync(5);
        
        var chart = new List<object>();
        var culture = new System.Globalization.CultureInfo("es-CR");

        // Este bloque construye el gráfico de ventas día por día, desde hace cuatro días hasta hoy.
        for (int i = 4; i >= 0; i--)
        {
            var targetDate = DateTime.UtcNow.AddDays(-i).Date;
            
            // Este cálculo suma exactamente lo vendido en la fecha iterada.
            var dailyTotal = recentOrders
                .Where(o => o.CreatedAt.Date == targetDate)
                .Sum(o => o.TotalAmount);
            
            // Esta instrucción obtiene el nombre abreviado del día en español.
            var dayName = culture.DateTimeFormat.GetAbbreviatedDayName(targetDate.DayOfWeek);
            dayName = char.ToUpper(dayName[0]) + dayName.Substring(1).Replace(".", "");

            chart.Add(new { date = dayName, total = dailyTotal });
        }

        return new {
            revenue = totalRevenue,
            orders = totalOrders,
            lowStock = lowStock,
            salesChart = chart
        };
    }

    // Este método obtiene el historial completo de auditorías ordenado de forma descendente por fecha.
    public async Task<IEnumerable<object>> GetAuditLogsAsync()
    {
        var logs = await _auditRepository.GetRecentAuditLogsAsync(50);
        return logs.Select(a => new {
            id = a.AuditLogId,
            user = a.Username,
            action = a.Action,
            timestamp = a.Timestamp
        });
    }

    // Este método registra de manera persistente las acciones ejecutadas por los usuarios.
    public async Task LogActionAsync(string username, string action)
    {
        var log = new AuditLog { Username = username, Action = action, Timestamp = DateTime.UtcNow };
        await _auditRepository.LogActionAsync(log);
    }
}
