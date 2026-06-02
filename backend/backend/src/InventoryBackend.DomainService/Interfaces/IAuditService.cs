using System.Collections.Generic;
using System.Threading.Tasks;

namespace InventoryBackend.DomainService.Interfaces;

public interface IAuditService
{
    Task<object> GetDashboardStatsAsync();
    Task<IEnumerable<object>> GetAuditLogsAsync();
    Task LogActionAsync(string username, string action);
}
