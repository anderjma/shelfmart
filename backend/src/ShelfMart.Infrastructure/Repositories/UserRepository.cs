// This file implements the CRUD queries required by the user accounts service.
using ShelfMart.Domain.Entities;
using ShelfMart.DomainService.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ShelfMart.Infrastructure.Repositories;

// This class uses Entity Framework to perform saves, reads, and deletions on the users table.
public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context)
    {
        _context = context;
    }

    // This method retrieves a user's complete profile using their username as the search filter.
    public async Task<User?> GetByUsernameAsync(string username)
    {
        return await _context.Users
            .Include(u => u.UserRoles)
            .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.Username == username);
    }

    // This method retrieves a user's complete profile using their unique identifier.
    public async Task<User?> GetByIdAsync(Guid userId)
    {
        return await _context.Users
            .Include(u => u.UserRoles)
            .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.UserId == userId);
    }

    // This method efficiently checks whether a user with the same registered email or username already exists.
    public async Task<bool> ExistsAsync(string username)
    {
        return await _context.Users.AnyAsync(u => u.Username == username);
    }

    // This method inserts a new account entity into the database context for later persistence.
    public async Task<User> AddAsync(User user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }

    // This method retrieves the complete list of all registered users along with their respective roles.
    public async Task<IEnumerable<User>> GetAllAsync()
    {
        return await _context.Users
            .Include(u => u.UserRoles)
            .ThenInclude(ur => ur.Role)
            .ToListAsync();
    }

    // This method queries the permissions table to find a specific role by its name.
    public async Task<Role?> GetRoleByNameAsync(string roleName)
    {
        return await _context.Roles.FirstOrDefaultAsync(r => r.Name == roleName);
    }

    // This method replaces every existing role assignment for the user with a single new role.
    public async Task SetUserRoleAsync(User user, Role role)
    {
        var existingAssignments = await _context.UserRoles
            .Where(ur => ur.UserId == user.UserId)
            .ToListAsync();

        _context.UserRoles.RemoveRange(existingAssignments);
        _context.UserRoles.Add(new UserRole { UserId = user.UserId, RoleId = role.RoleId, User = user, Role = role });

        await _context.SaveChangesAsync();
    }
}
