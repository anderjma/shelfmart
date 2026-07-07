// This file serves as a database-agnostic connection point for retrieving authorization roles.
using ShelfMart.Domain.Entities;

namespace ShelfMart.DomainService.Interfaces;

public interface IRoleRepository
{
    Task<Role?> GetByNameAsync(string name);
    Task<List<Role>> GetAllAsync();
}