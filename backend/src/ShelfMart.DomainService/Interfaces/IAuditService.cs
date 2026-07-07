// This file defines the contract that audit service implementations must fulfill.
using ShelfMart.Dto;
using System.Threading.Tasks;

// This interface establishes the methods for querying vital statistics and logging actions in the system.
namespace ShelfMart.DomainService.Interfaces;

public interface IAuditService
{
    Task<DashboardStatsDto> GetDashboardStatsAsync();
    Task<PaginatedResultDto<AuditLogDto>> GetAuditLogsAsync(int page, int pageSize);
    Task LogActionAsync(string username, string action);
}
