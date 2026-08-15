using ShelfMart.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ShelfMart.Infrastructure;

public static class AppDbSeeder
{
    private const int PasswordWorkFactor = 11;

    public static void Seed(AppDbContext context, bool seedAdminUser, string? adminPassword)
    {
        context.Database.Migrate();

        if (!context.Roles.Any())
        {
            var adminRole = new Role { Name = "Admin" };
            var customerRole = new Role { Name = "Customer" };
            context.Roles.AddRange(adminRole, customerRole);
            context.SaveChanges();

            if (seedAdminUser && !string.IsNullOrWhiteSpace(adminPassword))
            {
                var adminUser = new User
                {
                    Name = "Administrator",
                    Username = "admin",
                    Email = "admin@company.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(adminPassword, PasswordWorkFactor)
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

        if (!context.Categories.Any())
        {
            context.Categories.AddRange(
                new Category { Name = "General" },
                new Category { Name = "Electronics" },
                new Category { Name = "Groceries" },
                new Category { Name = "Home" }
            );
            context.SaveChanges();
        }
    }
}
