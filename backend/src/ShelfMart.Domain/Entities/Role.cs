using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;

using System.ComponentModel.DataAnnotations.Schema;

namespace ShelfMart.Domain.Entities;

public class Role : IdentityRole<Guid>
{
    [NotMapped]
    public Guid RoleId { get => Id; set => Id = value; }
    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
}
