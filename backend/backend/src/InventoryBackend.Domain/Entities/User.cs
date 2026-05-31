using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InventoryBackend.Domain.Entities;

[Table("User")]
public class User
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int UserId { get; private set; }

    [Required]
    public Guid UserResourceId { get; set; }

    [Column("Name")]
    [StringLength(50)]
    [Required]
    public required string Name { get; set; }

    [Column("Username")]
    [StringLength(50)]
    [Required]
    public required string Username { get; set; }

    [Required]
    [MaxLength(100)]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MaxLength(255)]
    public string PasswordHash { get; set; } = string.Empty;

    public List<UserRole> UserRoles { get; set; } = [];

    public void ClearRoles()
    {
        UserRoles.Clear();
    }
}