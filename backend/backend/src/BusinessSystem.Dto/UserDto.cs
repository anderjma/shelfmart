// Este archivo transporta la información pública de los usuarios hacia la capa de presentación.
using System;

namespace BusinessSystem.Dto;

// Esta clase representa la estructura de datos transferida para las operaciones relacionadas con cuentas.
public class UserDto
{
    public Guid UserResourceId { get; set; }
    public required string Name { get; set; }
    public required string Username { get; set; }
    public required string Email { get; set; }
}
