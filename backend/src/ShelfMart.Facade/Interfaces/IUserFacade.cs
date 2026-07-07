// This file details a high-level intermediary for managing user profile requirements.
using ShelfMart.Dto;

namespace ShelfMart.Facade.Interfaces;

// This interface unifies customer registration and retrieval so it can be consumed in a simplified way by the endpoints.
public interface IUserFacade
{
    Task<IEnumerable<UserDto>> GetAllUsersAsync();
    Task<UserDto> CreateUserAsync(CreateUserDto dto);
}
