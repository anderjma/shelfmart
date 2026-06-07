using System.Collections.Generic;
using System.Threading.Tasks;

namespace BusinessSystem.DomainService.Interfaces;

public interface IAuditService
{
    Task<object> GetDashboardStatsAsync();
    Task<IEnumerable<object>> GetAuditLogsAsync();
    Task LogActionAsync(string username, string action);
}
