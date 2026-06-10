using BusinessSystem.Domain.Entities;
// Este archivo provee una capa de abstracción para que los controladores manejen a los usuarios sin acoplarse directamente al dominio.
using BusinessSystem.DomainService.Interfaces;
using BusinessSystem.Dto;
using BusinessSystem.Facade.Interfaces;

namespace BusinessSystem.Facade;

// Esta clase maneja las derivaciones hacia el servicio de usuarios para procesos como la creación y la consulta.
public class UserFacade : IUserFacade
{
    private readonly IUserService _userService;

    public UserFacade(IUserService userService)
    {
        _userService = userService;
    }

    // Este método permite recuperar la lista completa de usuarios existentes en el sistema mediante el servicio de dominio.
    public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
    {
        return await _userService.GetAllUsersAsync();
    }

    // Este método pasa la información para el registro de un nuevo usuario hacia el validador del servicio correspondiente.
    public async Task<UserDto> CreateUserAsync(CreateUserDto dto)
    {
        var user = new User
        {
            Name = dto.Name,
            Username = dto.Username,
            Email = dto.Email
        };
        return await _userService.CreateUserAsync(user, dto.Password);
    }
}
