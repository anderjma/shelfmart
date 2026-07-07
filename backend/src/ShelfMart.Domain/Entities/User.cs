// This file specifies the central identity model used throughout the entire application.
using System;
using System.Collections.Generic;

namespace ShelfMart.Domain.Entities;

// This class stores credentials in a secure format and the essential contact information of a customer or employee.
public class User
{
    public Guid UserId { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
}
