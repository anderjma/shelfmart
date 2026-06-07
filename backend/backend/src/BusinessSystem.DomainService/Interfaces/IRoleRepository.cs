using BusinessSystem.Domain.Entities;

namespace BusinessSystem.DomainService.Interfaces;

public interface IRoleRepository
{
    Task<Role?> GetByNameAsync(string name);
    Task<List<Role>> GetAllAsync();
}