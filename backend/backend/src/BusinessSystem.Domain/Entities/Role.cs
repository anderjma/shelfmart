// Este archivo declara el modelo de base de datos utilizado para el control de accesos basados en roles.
using System;
using System.Collections.Generic;

namespace BusinessSystem.Domain.Entities;

// Esta clase representa un rol dentro del sistema, determinando los niveles de autorización de los usuarios.
public class Role
{
    public Guid RoleId { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
}
