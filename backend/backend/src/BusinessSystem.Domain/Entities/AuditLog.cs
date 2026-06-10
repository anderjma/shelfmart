// Este archivo declara la entidad empleada para mantener un historial inmutable de las operaciones del sistema.
using System;

namespace BusinessSystem.Domain.Entities;

// Esta clase rastrea una acción específica realizada por un usuario, incluyendo su estampa de tiempo para auditorías de seguridad.
public class AuditLog
{
    public Guid AuditLogId { get; set; } = Guid.NewGuid();
    public string Username { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
