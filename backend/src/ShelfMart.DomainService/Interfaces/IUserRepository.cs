// This file exposes the account profile access contract without tying it to a specific ORM.
using ShelfMart.Domain.Entities;

namespace ShelfMart.DomainService.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByUsernameAsync(string username);
    Task<bool> ExistsAsync(string username);
    Task<User> AddAsync(User user);
    Task<IEnumerable<User>> GetAllAsync();
    Task<Role?> GetRoleByNameAsync(string roleName);
}
