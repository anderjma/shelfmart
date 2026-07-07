using ShelfMart.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ShelfMart.DomainService.Interfaces;

// This file abstracts the data access mechanism for the business's log tables.
public interface IAuditRepository
{
    Task<decimal> GetTotalRevenueAsync();
    Task<int> GetTotalCompletedOrdersAsync();
    Task<int> GetLowStockProductsCountAsync();
    Task<int> GetTotalCustomersCountAsync();
    Task<(IEnumerable<AuditLog> Items, int TotalCount)> GetPaginatedAuditLogsAsync(int page, int pageSize);
    Task LogActionAsync(AuditLog log);
    Task<IEnumerable<Order>> GetOrdersFromLastDaysAsync(int days);
}
