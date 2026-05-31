using InventoryBackend.Domain.Entities;

namespace InventoryBackend.DomainService.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByUsernameAsync(string username);
    Task<User> AddAsync(User user);
    Task<bool> ExistsAsync(string username);
}