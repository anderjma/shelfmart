// Este archivo define el contrato que deben cumplir las implementaciones de los servicios de auditoría.
using System.Collections.Generic;
using System.Threading.Tasks;

// Esta interfaz establece los métodos para consultar estadísticas vitales y registrar acciones en el sistema.
namespace BusinessSystem.DomainService.Interfaces;

public interface IAuditService
{
    Task<object> GetDashboardStatsAsync();
    Task<IEnumerable<object>> GetAuditLogsAsync();
    Task LogActionAsync(string username, string action);
}
