// This file contains the logic for managing and collecting the system's audit records.
using ShelfMart.Domain.Entities;
using ShelfMart.DomainService.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ShelfMart.DomainService;

// This class exposes the main metrics and access history for the administration panel.
public class AuditService : IAuditService
{
    private readonly IAuditRepository _auditRepository;

    public AuditService(IAuditRepository auditRepository)
    {
        _auditRepository = auditRepository;
    }

    // This method consolidates the global business metrics for display on the main dashboard.
    public async Task<object> GetDashboardStatsAsync()
    {
        var totalRevenue = await _auditRepository.GetTotalRevenueAsync();
        var totalOrders = await _auditRepository.GetTotalCompletedOrdersAsync();
        var lowStock = await _auditRepository.GetLowStockProductsCountAsync();

        var recentOrders = await _auditRepository.GetOrdersFromLastDaysAsync(5);

        var chart = new List<object>();
        var culture = System.Globalization.CultureInfo.InvariantCulture;

        // This block builds the sales chart day by day, from four days ago through today.
        for (int i = 4; i >= 0; i--)
        {
            var targetDate = DateTime.UtcNow.AddDays(-i).Date;

            // This calculation sums exactly what was sold on the iterated date.
            var dailyTotal = recentOrders
                .Where(o => o.CreatedAt.Date == targetDate)
                .Sum(o => o.TotalAmount);

            // This statement gets the abbreviated day name in English.
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

    // This method retrieves the complete audit history ordered descending by date.
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

    // This method persistently logs the actions performed by users.
    public async Task LogActionAsync(string username, string action)
    {
        var log = new AuditLog { Username = username, Action = action, Timestamp = DateTime.UtcNow };
        await _auditRepository.LogActionAsync(log);
    }
}
