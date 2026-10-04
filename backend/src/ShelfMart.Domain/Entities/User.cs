using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;

using System.ComponentModel.DataAnnotations.Schema;

namespace ShelfMart.Domain.Entities;

public class User : IdentityUser<Guid>
{
    [NotMapped]
    public Guid UserId { get => Id; set => Id = value; }
    
    [NotMapped]
    public string Username { get => UserName ?? ""; set => UserName = value; }
    
    public string Name { get; set; } = string.Empty;
    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
}
