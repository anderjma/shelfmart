// Este archivo detalla un intermediario de alto nivel para gestionar los requerimientos de perfiles de usuario.
using BusinessSystem.Dto;

namespace BusinessSystem.Facade.Interfaces;

// Esta interfaz unifica el registro y recuperación de clientes para ser consumida de manera simplificada por los endpoints.
public interface IUserFacade
{
    Task<IEnumerable<UserDto>> GetAllUsersAsync();
    Task<UserDto> CreateUserAsync(CreateUserDto dto);
}
