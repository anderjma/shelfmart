using ShelfMart.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ShelfMart.Infrastructure;

public static class AppDbSeeder
{
    public static void Seed(AppDbContext context)
    {
        context.Database.Migrate();

        if (!context.Roles.Any())
        {
            var adminRole = new Role { Name = "Admin" };
            var customerRole = new Role { Name = "Customer" };
            context.Roles.AddRange(adminRole, customerRole);
            context.SaveChanges();

            var adminUser = new User
            {
                Name = "Administrator",
                Username = "admin",
                Email = "admin@company.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!", 8)
            };
            context.Users.Add(adminUser);
            context.SaveChanges();

            context.UserRoles.Add(new UserRole { 
                UserId = adminUser.UserId, 
                RoleId = adminRole.RoleId,
                User = adminUser,
                Role = adminRole
            });
            context.SaveChanges();
        }
    }
}
