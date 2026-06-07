using BusinessSystem.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BusinessSystem.DomainService.Interfaces;

public interface IAuditRepository
{
    Task<decimal> GetTotalRevenueAsync();
    Task<int> GetTotalCompletedOrdersAsync();
    Task<int> GetLowStockProductsCountAsync();
    Task<IEnumerable<AuditLog>> GetRecentAuditLogsAsync(int count);
    Task LogActionAsync(AuditLog log);
    Task<IEnumerable<Order>> GetOrdersFromLastDaysAsync(int days);
}
