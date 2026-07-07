// This file encapsulates the input credentials provided by the client when logging in.
namespace ShelfMart.Dto;

// This class models the body of a standard login request.
public class LoginRequestDto
{
    public required string Username { get; set; }
    public required string Password { get; set; }
}
