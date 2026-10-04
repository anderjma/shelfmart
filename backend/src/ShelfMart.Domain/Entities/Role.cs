using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;

namespace ShelfMart.Domain.Entities;

public class Role : IdentityRole<Guid>
{
    public Guid RoleId { get => Id; set => Id = value; }
    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
}
