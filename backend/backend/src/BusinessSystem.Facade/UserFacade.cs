using BusinessSystem.Domain.Entities;
using BusinessSystem.DomainService.Interfaces;
using BusinessSystem.Dto;
using BusinessSystem.Facade.Interfaces;

namespace BusinessSystem.Facade;

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
