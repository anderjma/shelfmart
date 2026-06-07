using System;

namespace BusinessSystem.Domain.Entities;

public class AuditLog
{
    public Guid AuditLogId { get; set; } = Guid.NewGuid();
    public string Username { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
