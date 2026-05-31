using InventoryBackend.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace InventoryBackend.Infrastructure;

public static class AppDbSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        if (!await context.Roles.AnyAsync())
        {
            var adminRole = new Role { Name = "Admin", RoleResourceId = Guid.NewGuid() };
            var employeeRole = new Role { Name = "Empleado", RoleResourceId = Guid.NewGuid() };
            
            context.Roles.AddRange(adminRole, employeeRole);
            await context.SaveChangesAsync();

            var adminUser = new User
            {
                UserResourceId = Guid.NewGuid(),
                Name = "Administrador Pyme",
                Username = "admin",
                Email = "admin@pyme.cr",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123*")
            };
            
            context.Users.Add(adminUser);
            await context.SaveChangesAsync();

            context.UserRoles.Add(new UserRole
            {
                UserId = adminUser.UserId,
                User = adminUser,
                RoleId = adminRole.Id,
                Role = adminRole
            });
            
            await context.SaveChangesAsync();
        }
    }
}
