using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
// Este archivo expone las estadísticas e historial de auditoría al panel de gerencia.
using BusinessSystem.DomainService.Interfaces;
using System.Threading.Tasks;
using System;

namespace BusinessSystem.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
// Este controlador restringe el acceso a las métricas del negocio únicamente a personal autorizado como administradores.
public class AuditController : ControllerBase
{
    private readonly IAuditService _auditService;

    public AuditController(IAuditService auditService)
    {
        _auditService = auditService;
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var stats = await _auditService.GetDashboardStatsAsync();
        return Ok(stats);
    }

    [HttpGet("logs")]
    public async Task<IActionResult> GetLogs()
    {
        var logs = await _auditService.GetAuditLogsAsync();
        return Ok(logs);
    }
}
