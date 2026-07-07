using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
// This file exposes audit statistics and history to the management panel.
using ShelfMart.DomainService.Interfaces;
using System.Threading.Tasks;
using System;

namespace ShelfMart.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
// This controller restricts access to business metrics to personnel authorized as administrators only.
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
