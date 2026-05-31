using InventoryBackend.Domain.Entities;
using InventoryBackend.DomainService.Interfaces;
using InventoryBackend.Dto;
using InventoryBackend.Facade.Interfaces;

namespace InventoryBackend.Facade;

public class UserFacade : IUserFacade
{
    private readonly IUserService _userService;

    public UserFacade(IUserService userService)
    {
        _userService = userService;
    }

    public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
    {
        return await _userService.GetAllUsersAsync();
    }

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
