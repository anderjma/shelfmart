// This file carries a single audit log entry to the administration panel.
using System;

namespace ShelfMart.Dto;

public class AuditLogDto
{
    public Guid AuditLogId { get; set; }
    public string User { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
}
