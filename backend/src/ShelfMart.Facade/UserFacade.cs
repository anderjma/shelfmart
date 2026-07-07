using ShelfMart.Domain.Entities;
// This file provides an abstraction layer so controllers can handle users without coupling directly to the domain.
using ShelfMart.DomainService.Interfaces;
using ShelfMart.Dto;
using ShelfMart.Facade.Interfaces;

namespace ShelfMart.Facade;

// This class handles delegation to the user service for processes such as creation and querying.
public class UserFacade : IUserFacade
{
    private readonly IUserService _userService;

    public UserFacade(IUserService userService)
    {
        _userService = userService;
    }

    // This method retrieves the complete list of existing users in the system via the domain service.
    public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
    {
        return await _userService.GetAllUsersAsync();
    }

    // This method passes the information for registering a new user to the corresponding service validator.
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

    // This method forwards a role change request to the domain service.
    public async Task<UserDto> UpdateUserRoleAsync(Guid userId, string newRole)
    {
        return await _userService.UpdateUserRoleAsync(userId, newRole);
    }
}
