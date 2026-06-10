// Este archivo define la respuesta exitosa entregada tras una autenticación válida.
namespace BusinessSystem.Dto;

// Esta clase empaca el token JWT y los datos esenciales del usuario para habilitar su sesión.
public class LoginResponseDto
{
    public required string Token { get; set; }
    public required string Username { get; set; }
    public List<string> Roles { get; set; } = [];
}
