// This file groups the data required when creating a new account on the platform.
namespace ShelfMart.Dto;

// This class dictates the minimum properties needed to process a secure registration.
public class CreateUserDto
{
    public string Name { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
