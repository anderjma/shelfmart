// Este archivo especifica el modelo central de identidad utilizado a través de toda la aplicación.
using System;
using System.Collections.Generic;

namespace BusinessSystem.Domain.Entities;

// Esta clase almacena las credenciales en formato seguro y la información de contacto esencial de un cliente o empleado.
public class User
{
    public Guid UserId { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
}
