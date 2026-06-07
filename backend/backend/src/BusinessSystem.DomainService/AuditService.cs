using BusinessSystem.Domain.Entities;
using BusinessSystem.DomainService.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BusinessSystem.DomainService;

public class AuditService : IAuditService
{
    private readonly IAuditRepository _auditRepository;

    public AuditService(IAuditRepository auditRepository)
    {
        _auditRepository = auditRepository;
    }

    public async Task<object> GetDashboardStatsAsync()
    {
        var totalRevenue = await _auditRepository.GetTotalRevenueAsync();
        var totalOrders = await _auditRepository.GetTotalCompletedOrdersAsync();
        var lowStock = await _auditRepository.GetLowStockProductsCountAsync();

        var recentOrders = await _auditRepository.GetOrdersFromLastDaysAsync(5);
        
        var chart = new List<object>();
        var culture = new System.Globalization.CultureInfo("es-CR");

        // Construimos el gráfico día por día (de hace 4 días hasta hoy)
        for (int i = 4; i >= 0; i--)
        {
            var targetDate = DateTime.UtcNow.AddDays(-i).Date;
            
            // Sumamos exactamente lo que se vendió en esa fecha
            var dailyTotal = recentOrders
                .Where(o => o.CreatedAt.Date == targetDate)
                .Sum(o => o.TotalAmount);
            
            // Obtenemos el nombre del día en español (ej. "Lun", "Mar")
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

    public async Task LogActionAsync(string username, string action)
    {
        var log = new AuditLog { Username = username, Action = action, Timestamp = DateTime.UtcNow };
        await _auditRepository.LogActionAsync(log);
    }
}
