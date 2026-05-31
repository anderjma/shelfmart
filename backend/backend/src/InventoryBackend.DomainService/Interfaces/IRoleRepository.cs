using InventoryBackend.Domain.Entities;

namespace InventoryBackend.DomainService.Interfaces;

public interface IRoleRepository
{
    Task<Role?> GetByNameAsync(string name);
    Task<List<Role>> GetAllAsync();
}