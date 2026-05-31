using InventoryBackend.Domain.Entities;
using InventoryBackend.Dto;

namespace InventoryBackend.DomainService.Interfaces;

public interface IUserService
{
    Task<UserDto> CreateUserAsync(User user, string plainPassword);
    Task<User?> ValidateUserCredentialsAsync(string username, string plainPassword);
}
