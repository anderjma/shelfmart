// Este archivo provee la tabla de unión necesaria para implementar el patrón de control de accesos.
using System;

namespace BusinessSystem.Domain.Entities;

// Esta clase asocia un perfil de usuario con un nivel de autorización o rol particular dentro de la arquitectura de la base de datos.
public class UserRole
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public Guid RoleId { get; set; }
    public Role Role { get; set; } = null!;
}
