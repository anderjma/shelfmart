using Microsoft.EntityFrameworkCore;
// This file contains the low-level queries exclusively used to locate roles within the permissions system.
using ShelfMart.Domain.Entities;
using ShelfMart.DomainService.Interfaces;

namespace ShelfMart.Infrastructure.Repositories;

// This class interacts with the ORM to obtain the entity representing the role sought during registration.
public class RoleRepository : IRoleRepository
{
    private readonly AppDbContext _context;

    public RoleRepository(AppDbContext context)
    {
        _context = context;
    }

    // This method looks up an existing authorization role based on its alphanumeric name.
    public async Task<Role?> GetByNameAsync(string name)
    {
        return await _context.Roles.FirstOrDefaultAsync(r => r.Name == name);
    }

    // This method retrieves all access levels available within the security architecture.
    public async Task<List<Role>> GetAllAsync()
    {
        return await _context.Roles.ToListAsync();
    }
}