using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;

namespace ShelfMart.Domain.Entities;

public class User : IdentityUser<Guid>
{
    public Guid UserId { get => Id; set => Id = value; }
    public string Username { get => UserName ?? ""; set => UserName = value; }
    
    public string Name { get; set; } = string.Empty;
    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
}
