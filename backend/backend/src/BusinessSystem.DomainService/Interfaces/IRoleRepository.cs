// Este archivo sirve como punto de conexión agnóstico de la base de datos para recuperar roles de autorización.
using BusinessSystem.Domain.Entities;

namespace BusinessSystem.DomainService.Interfaces;

public interface IRoleRepository
{
    Task<Role?> GetByNameAsync(string name);
    Task<List<Role>> GetAllAsync();
}