// This file declares the entity used to maintain an immutable history of system operations.
using System;

namespace ShelfMart.Domain.Entities;

// This class tracks a specific action performed by a user, including its timestamp for security audits.
public class AuditLog
{
    public Guid AuditLogId { get; set; } = Guid.NewGuid();
    public string Username { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
