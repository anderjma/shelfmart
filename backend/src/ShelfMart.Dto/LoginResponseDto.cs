// This file defines the successful response delivered after a valid authentication.
namespace ShelfMart.Dto;

// This class packages the JWT token and the essential user data needed to enable their session.
public class LoginResponseDto
{
    public required string Token { get; set; }
    public required string Username { get; set; }
    public List<string> Roles { get; set; } = [];
}
