// Este archivo encapsula las credenciales de entrada proporcionadas por el cliente al iniciar sesión.
namespace BusinessSystem.Dto;

// Esta clase modela el cuerpo de una petición de inicio de sesión estándar.
public class LoginRequestDto
{
    public required string Username { get; set; }
    public required string Password { get; set; }
}
