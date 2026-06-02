using InventoryBackend.Domain.Entities;

namespace InventoryBackend.DomainService.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByUsernameAsync(string username);
    Task<bool> ExistsAsync(string username);
    Task<User> AddAsync(User user);
    Task<IEnumerable<User>> GetAllAsync();
    Task<Role?> GetRoleByNameAsync(string roleName);
}
