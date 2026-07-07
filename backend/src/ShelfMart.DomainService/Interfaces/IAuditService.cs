// This file defines the contract that audit service implementations must fulfill.
using System.Collections.Generic;
using System.Threading.Tasks;

// This interface establishes the methods for querying vital statistics and logging actions in the system.
namespace ShelfMart.DomainService.Interfaces;

public interface IAuditService
{
    Task<object> GetDashboardStatsAsync();
    Task<IEnumerable<object>> GetAuditLogsAsync();
    Task LogActionAsync(string username, string action);
}
