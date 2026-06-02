using System;
using System.Collections.Generic;

namespace InventoryBackend.Domain.Entities;

public class Role
{
    public Guid RoleId { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
}
