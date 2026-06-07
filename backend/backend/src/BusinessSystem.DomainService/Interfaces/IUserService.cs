using BusinessSystem.Domain.Entities;
using BusinessSystem.Dto;

namespace BusinessSystem.DomainService.Interfaces;

public interface IUserService
{
    Task<UserDto> CreateUserAsync(User user, string plainPassword);
    Task<UserDto> RegisterCustomerAsync(User user, string plainPassword);
    Task<User?> ValidateUserCredentialsAsync(string username, string plainPassword);
    Task<IEnumerable<UserDto>> GetAllUsersAsync();
}
