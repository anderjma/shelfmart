using ShelfMart.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ShelfMart.Infrastructure;

public static class AppDbSeeder
{
    private const int PasswordWorkFactor = 11;

    public static void Seed(AppDbContext context, bool seedAdminUser, string? adminPassword)
    {
        context.Database.Migrate();

        // Rows created before the ASP.NET Core Identity migration have NULL normalized names and stamps,
        // which makes UserManager.FindByNameAsync / RoleManager.RoleExistsAsync miss them. Backfill once.
        context.Database.ExecuteSqlRaw("""
            UPDATE "AspNetUsers" SET "NormalizedUserName" = UPPER("Username"), "NormalizedEmail" = UPPER("Email"),
                "SecurityStamp" = COALESCE("SecurityStamp", gen_random_uuid()::text),
                "ConcurrencyStamp" = COALESCE("ConcurrencyStamp", gen_random_uuid()::text)
            WHERE "NormalizedUserName" IS NULL
            """);
        context.Database.ExecuteSqlRaw("""
            UPDATE "AspNetRoles" SET "NormalizedName" = UPPER("Name"),
                "ConcurrencyStamp" = COALESCE("ConcurrencyStamp", gen_random_uuid()::text)
            WHERE "NormalizedName" IS NULL
            """);

        if (!context.Roles.Any())
        {
            var adminRole = new Role { Name = "Admin", NormalizedName = "ADMIN" };
            var customerRole = new Role { Name = "Customer", NormalizedName = "CUSTOMER" };
            context.Roles.AddRange(adminRole, customerRole);
            context.SaveChanges();

            if (seedAdminUser && !string.IsNullOrWhiteSpace(adminPassword))
            {
                var adminUser = new User
                {
                    Name = "Administrator",
                    Username = "admin",
                    NormalizedUserName = "ADMIN",
                    Email = "admin@company.com",
                    NormalizedEmail = "ADMIN@COMPANY.COM",
                    SecurityStamp = Guid.NewGuid().ToString()
                };
                adminUser.PasswordHash = new Microsoft.AspNetCore.Identity.PasswordHasher<User>().HashPassword(adminUser, adminPassword);
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
                new Category { Name = "Home" },
                new Category { Name = "Clothing" }
            );
            context.SaveChanges();
        }

        if (!context.Products.Any())
        {
            context.Products.AddRange(
                new Product { ProductResourceId = Guid.NewGuid(), Name = "Wireless Mouse", Description = "Ergonomic wireless mouse", Price = 29.99m, Stock = 100, ImageUrl = "https://picsum.photos/seed/mouse/200", Category = "Electronics" },
                new Product { ProductResourceId = Guid.NewGuid(), Name = "Mechanical Keyboard", Description = "RGB mechanical keyboard", Price = 89.99m, Stock = 50, ImageUrl = "https://picsum.photos/seed/keyboard/200", Category = "Electronics" },
                new Product { ProductResourceId = Guid.NewGuid(), Name = "Noise-Cancelling Headphones", Description = "Over-ear headphones", Price = 199.99m, Stock = 30, ImageUrl = "https://picsum.photos/seed/headphones/200", Category = "Electronics" },
                new Product { ProductResourceId = Guid.NewGuid(), Name = "4K Monitor", Description = "27 inch 4K display", Price = 349.99m, Stock = 20, ImageUrl = "https://picsum.photos/seed/monitor/200", Category = "Electronics" },
                new Product { ProductResourceId = Guid.NewGuid(), Name = "Smartwatch", Description = "Waterproof smartwatch", Price = 149.99m, Stock = 60, ImageUrl = "https://picsum.photos/seed/smartwatch/200", Category = "Electronics" },
                
                new Product { ProductResourceId = Guid.NewGuid(), Name = "Cotton T-Shirt", Description = "100% cotton casual tee", Price = 19.99m, Stock = 200, ImageUrl = "https://picsum.photos/seed/tshirt/200", Category = "Clothing" },
                new Product { ProductResourceId = Guid.NewGuid(), Name = "Denim Jeans", Description = "Classic fit denim jeans", Price = 49.99m, Stock = 150, ImageUrl = "https://picsum.photos/seed/jeans/200", Category = "Clothing" },
                new Product { ProductResourceId = Guid.NewGuid(), Name = "Running Shoes", Description = "Lightweight running sneakers", Price = 79.99m, Stock = 80, ImageUrl = "https://picsum.photos/seed/shoes/200", Category = "Clothing" },
                new Product { ProductResourceId = Guid.NewGuid(), Name = "Winter Jacket", Description = "Warm winter coat", Price = 129.99m, Stock = 40, ImageUrl = "https://picsum.photos/seed/jacket/200", Category = "Clothing" },
                new Product { ProductResourceId = Guid.NewGuid(), Name = "Sunglasses", Description = "UV400 protection", Price = 24.99m, Stock = 100, ImageUrl = "https://picsum.photos/seed/sunglasses/200", Category = "Clothing" },

                new Product { ProductResourceId = Guid.NewGuid(), Name = "Organic Coffee Beans", Description = "1lb dark roast coffee", Price = 14.99m, Stock = 300, ImageUrl = "https://picsum.photos/seed/coffee/200", Category = "Groceries" },
                new Product { ProductResourceId = Guid.NewGuid(), Name = "Green Tea", Description = "Box of 50 green tea bags", Price = 8.99m, Stock = 250, ImageUrl = "https://picsum.photos/seed/tea/200", Category = "Groceries" },
                new Product { ProductResourceId = Guid.NewGuid(), Name = "Olive Oil", Description = "Extra virgin olive oil", Price = 12.99m, Stock = 120, ImageUrl = "https://picsum.photos/seed/oliveoil/200", Category = "Groceries" },

                new Product { ProductResourceId = Guid.NewGuid(), Name = "Ceramic Mug", Description = "Handcrafted coffee mug", Price = 11.99m, Stock = 100, ImageUrl = "https://picsum.photos/seed/mug/200", Category = "Home" },
                new Product { ProductResourceId = Guid.NewGuid(), Name = "Throw Blanket", Description = "Soft fleece throw", Price = 34.99m, Stock = 70, ImageUrl = "https://picsum.photos/seed/blanket/200", Category = "Home" }
            );
            context.SaveChanges();
        }
    }
}
