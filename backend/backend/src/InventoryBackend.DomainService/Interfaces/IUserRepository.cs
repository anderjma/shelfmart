using InventoryBackend.Domain.Entities;

namespace InventoryBackend.DomainService.Interfaces;

public interface IUserRepository
{
    Task<bool> ExistsAsync(string username);
    Task<User> AddAsync(User user);
    Task<User?> GetByUsernameAsync(string username);
    Task<IEnumerable<User>> GetAllAsync();
}
