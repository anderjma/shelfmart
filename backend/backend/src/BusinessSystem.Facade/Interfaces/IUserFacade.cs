using BusinessSystem.Dto;

namespace BusinessSystem.Facade.Interfaces;

public interface IUserFacade
{
    Task<IEnumerable<UserDto>> GetAllUsersAsync();
    Task<UserDto> CreateUserAsync(CreateUserDto dto);
}
