using System;

namespace BusinessSystem.Dto;

public class UserDto
{
    public Guid UserResourceId { get; set; }
    public required string Name { get; set; }
    public required string Username { get; set; }
    public required string Email { get; set; }
}
