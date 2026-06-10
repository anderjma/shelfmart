using BusinessSystem.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BusinessSystem.DomainService.Interfaces;

// Este archivo abstrae el mecanismo de acceso a datos para las tablas de bitácoras del negocio.
public interface IAuditRepository
{
    Task<decimal> GetTotalRevenueAsync();
    Task<int> GetTotalCompletedOrdersAsync();
    Task<int> GetLowStockProductsCountAsync();
    Task<IEnumerable<AuditLog>> GetRecentAuditLogsAsync(int count);
    Task LogActionAsync(AuditLog log);
    Task<IEnumerable<Order>> GetOrdersFromLastDaysAsync(int days);
}
