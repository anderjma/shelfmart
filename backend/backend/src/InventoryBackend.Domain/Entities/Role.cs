using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace InventoryBackend.Domain.Entities;

[Table(nameof(Role))]
[Index(nameof(Name), IsUnique = true)]
[Index(nameof(RoleResourceId), IsUnique = true)]
public class Role
{
   [Key]
   [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
   public int Id { get; set; }
   public Guid RoleResourceId { get; set; } = Guid.NewGuid();
   [MaxLength(100)]
   [Required]
   public required string Name { get; set; }
   public List<UserRole> UserRoles { get; set; } = [];
}