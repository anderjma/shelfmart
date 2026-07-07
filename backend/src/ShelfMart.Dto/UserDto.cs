// This file carries public user information to the presentation layer.
using System;

namespace ShelfMart.Dto;

// This class represents the data structure transferred for account-related operations.
public class UserDto
{
    public Guid UserResourceId { get; set; }
    public required string Name { get; set; }
    public required string Username { get; set; }
    public required string Email { get; set; }
}
