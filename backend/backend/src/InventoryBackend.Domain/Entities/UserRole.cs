using System;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace InventoryBackend.Domain.Entities;

[Table(nameof(UserRole))]
[Index(nameof(UserRoleResourceId), IsUnique = true)]
public class UserRole
{
   public int UserId { get; set; }
   public required User User { get; set; }
   public int RoleId { get; set; }
   public required Role Role { get; set; }
   public Guid UserRoleResourceId { get; set; } = Guid.NewGuid();
}