// This file declares the database model used for role-based access control.
using System;
using System.Collections.Generic;

namespace ShelfMart.Domain.Entities;

// This class represents a role within the system, determining users' authorization levels.
public class Role
{
    public Guid RoleId { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
}
