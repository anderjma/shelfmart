// Este archivo agrupa los datos requeridos durante el alta de una nueva cuenta en la plataforma.
namespace BusinessSystem.Dto;

// Esta clase dicta las propiedades mínimas necesarias para procesar un registro seguro.
public class CreateUserDto
{
    public string Name { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
