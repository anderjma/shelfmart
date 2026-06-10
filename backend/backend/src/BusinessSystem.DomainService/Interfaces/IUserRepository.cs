// Este archivo expone el contrato de acceso a los perfiles de cuenta sin atarlos a un ORM específico.
using BusinessSystem.Domain.Entities;

namespace BusinessSystem.DomainService.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByUsernameAsync(string username);
    Task<bool> ExistsAsync(string username);
    Task<User> AddAsync(User user);
    Task<IEnumerable<User>> GetAllAsync();
    Task<Role?> GetRoleByNameAsync(string roleName);
}
