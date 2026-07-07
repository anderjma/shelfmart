// This file provides the join table needed to implement the access control pattern.
using System;

namespace ShelfMart.Domain.Entities;

// This class associates a user profile with a particular authorization level or role within the database architecture.
public class UserRole
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public Guid RoleId { get; set; }
    public Role Role { get; set; } = null!;
}
