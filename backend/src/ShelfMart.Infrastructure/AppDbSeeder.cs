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

        // Remove 'General' and all redundant categories, reassigning products to standard categories
        var redundantCategoryNames = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
        {
            "General",
            "General Clothing",
            "Footwear",
            "Kitchen",
            "Men's Clothing",
            "Women's Clothing"
        };

        var redundantCategories = context.Categories
            .Where(c => redundantCategoryNames.Contains(c.Name))
            .ToList();
        if (redundantCategories.Count > 0)
        {
            context.Categories.RemoveRange(redundantCategories);
        }

        var redundantProducts = context.Products
            .Where(p => redundantCategoryNames.Contains(p.Category))
            .ToList();
        foreach (var p in redundantProducts)
        {
            var lower = p.Category.ToLower();
            p.Category = (lower.Contains("clothing") || lower == "footwear") ? "Clothing" : "Home";
        }

        // Clean up legacy test products with raw colon prices and placeholder names
        var legacyNameFixes = new Dictionary<string, (string NewName, string Category, decimal Price, string ImageUrl, string Description)>
        {
            ["microwave"] = (
                "Black+Decker Countertop Toaster Oven & Broiler",
                "Home",
                69.99m,
                "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=600&q=80",
                "Stainless steel countertop convection toaster oven and broiler with precision temperature dials and baking pan."
            ),
            ["lamp"] = (
                "Industrial Matte Charcoal Steel Floor Reading Lamp",
                "Home",
                49.99m,
                "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80",
                "Architectural matte charcoal powder-coated steel floor standing lamp with adjustable dome shade for reading or living rooms."
            ),
            ["socks"] = (
                "Pop Art Lips Printed Cotton Crew Socks",
                "Clothing",
                12.50m,
                "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&w=600&q=80",
                "Fun vibrant pop-art kiss lips pattern ribbed knit cotton blend crew socks with reinforced heel and elastic cuff."
            ),
            ["silver spoon set"] = (
                "Gourmet Vegetable Stir-Fry Rice Skillet",
                "Groceries",
                14.00m,
                "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=600&q=80",
                "Fresh seasoned long-grain rice skillet with sweet corn, shredded carrots, green herbs, and extra virgin olive oil."
            ),
            ["nike sports sneakers"] = (
                "Nike Air Max 1 White & Tangerine Orange Sneakers",
                "Clothing",
                129.99m,
                "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=600&q=80",
                "Iconic white perforated leather lifestyle sneakers featuring signature visible Max Air cushioning and vibrant orange mudguard."
            ),
            ["skirt"] = (
                "High-Waisted Pleated Black Mini Skirt",
                "Clothing",
                34.00m,
                "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=600&q=80",
                "Structured box-pleated high-waisted black mini skater skirt tailored with comfortable stretch woven fabric."
            ),
            ["shirt"] = (
                "Chambray Dot-Print Button-Up 3/4 Sleeve Shirt",
                "Clothing",
                42.00m,
                "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80",
                "Casual blue cotton chambray button-down shirt with subtle micro dot print, classic collar, and 3/4 sleeves."
            )
        };

        var allProducts = context.Products.ToList();
        Console.WriteLine($"[Seeder] Total products loaded: {allProducts.Count}");
        foreach (var kvp in legacyNameFixes)
        {
            var p = allProducts.FirstOrDefault(prod => prod.Name.Trim().Equals(kvp.Key, StringComparison.OrdinalIgnoreCase) 
                                                    || prod.Name.Trim().Equals(kvp.Value.NewName, StringComparison.OrdinalIgnoreCase)
                                                    || (kvp.Key == "microwave" && prod.ProductResourceId == Guid.Parse("a720f997-f94e-43a4-b86b-4f5709e05f60")));
            if (p != null)
            {
                Console.WriteLine($"[Seeder] Updating legacy item '{p.Name}' to '{kvp.Value.NewName}' (${kvp.Value.Price})");
                p.Name = kvp.Value.NewName;
                p.Category = kvp.Value.Category;
                p.Price = kvp.Value.Price;
                p.ImageUrl = kvp.Value.ImageUrl;
                p.Description = kvp.Value.Description;
                if (p.DiscountPercentage == 0) p.DiscountPercentage = 10;
            }
            else
            {
                Console.WriteLine($"[Seeder] Could not match legacy item '{kvp.Key}'");
            }
        }

        // Convert any leftover colon prices (>= 1000) to USD
        var colonProducts = context.Products.Where(prod => prod.Price >= 1000m).ToList();
        foreach (var cp in colonProducts)
        {
            cp.Price = Math.Round(cp.Price / 500m, 2);
        }

        context.SaveChanges();

        var defaultCategories = new[]
        {
            "Electronics",
            "Clothing",
            "Groceries",
            "Home",
            "Furniture",
            "Sports",
            "Beauty",
            "Books"
        };

        foreach (var catName in defaultCategories)
        {
            if (!context.Categories.Any(c => c.Name.ToLower() == catName.ToLower()))
            {
                context.Categories.Add(new Category { Name = catName });
            }
        }
        context.SaveChanges();

        var existingNames = context.Products
            .Select(p => p.Name.ToLower())
            .ToHashSet();

        var catalog = new List<Product>
        {
            // Electronics
            new Product
            {
                ProductResourceId = Guid.NewGuid(),
                Name = "Sony WH-1000XM5 Wireless Headphones",
                Description = "Industry-leading noise canceling wireless over-ear headphones with 30-hour battery life.",
                Price = 399.99m,
                Stock = 24,
                DiscountPercentage = 15,
                ImageUrl = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
                Category = "Electronics"
            },
            new Product
            {
                ProductResourceId = Guid.NewGuid(),
                Name = "Logitech MX Master 3S Wireless Mouse",
                Description = "Performance wireless ergonomic mouse with Quiet Clicks and 8K DPI track-on-glass sensor.",
                Price = 99.99m,
                Stock = 45,
                DiscountPercentage = 10,
                ImageUrl = "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80",
                Category = "Electronics"
            },
            new Product
            {
                ProductResourceId = Guid.NewGuid(),
                Name = "Apple Magic Wireless Keyboard",
                Description = "Ultra-slim wireless rechargeable keyboard with comfortable scissor mechanism and macOS layout.",
                Price = 99.00m,
                Stock = 30,
                DiscountPercentage = 0,
                ImageUrl = "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80",
                Category = "Electronics"
            },
            new Product
            {
                ProductResourceId = Guid.NewGuid(),
                Name = "Apple iMac 27-inch 5K Retina All-in-One Desktop",
                Description = "All-in-one desktop computer with stunning 5K Retina display, Magic Keyboard, and Magic Trackpad.",
                Price = 1299.00m,
                Stock = 12,
                DiscountPercentage = 5,
                ImageUrl = "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80",
                Category = "Electronics"
            },
            new Product
            {
                ProductResourceId = Guid.NewGuid(),
                Name = "Minimalist Matte White Smartwatch with Silicone Band",
                Description = "Sleek circular digital smartwatch with white sport silicone strap and fitness tracking sensors.",
                Price = 189.00m,
                Stock = 18,
                DiscountPercentage = 0,
                ImageUrl = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
                Category = "Electronics"
            },
            new Product
            {
                ProductResourceId = Guid.NewGuid(),
                Name = "Xiaomi Mi 20,800mAh Fast Charging Power Bank",
                Description = "High-capacity anodized aluminum portable power bank with dual USB ports and rapid mobile charging.",
                Price = 45.99m,
                Stock = 35,
                DiscountPercentage = 20,
                ImageUrl = "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=600&q=80",
                Category = "Electronics"
            },

            // Clothing & Apparel
            new Product
            {
                ProductResourceId = Guid.NewGuid(),
                Name = "Graphic Print Beige Cotton Crewneck T-Shirt",
                Description = "Premium 100% combed cotton beige graphic crewneck t-shirt with Japanese Lucky Cat art print.",
                Price = 28.00m,
                Stock = 120,
                DiscountPercentage = 0,
                ImageUrl = "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80",
                Category = "Clothing"
            },
            new Product
            {
                ProductResourceId = Guid.NewGuid(),
                Name = "Levi's 511 Slim Fit Stretch Denim Jeans (Trio)",
                Description = "Classic authentic Levi's denim jeans in light blue, dark indigo, and solid black washes.",
                Price = 69.50m,
                Stock = 85,
                DiscountPercentage = 15,
                ImageUrl = "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80",
                Category = "Clothing"
            },
            new Product
            {
                ProductResourceId = Guid.NewGuid(),
                Name = "Nike Free RN Flyknit Crimson Running Shoes",
                Description = "Featherlight breathable road running sneakers with flexible Flyknit upper and dynamic sole cushioning.",
                Price = 120.00m,
                Stock = 40,
                DiscountPercentage = 10,
                ImageUrl = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
                Category = "Clothing"
            },
            new Product
            {
                ProductResourceId = Guid.NewGuid(),
                Name = "Zara Faux Leather Biker Moto Jacket",
                Description = "Classic asymmetrical zip biker jacket crafted from supple faux leather with silver-tone hardware.",
                Price = 89.00m,
                Stock = 22,
                DiscountPercentage = 0,
                ImageUrl = "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80",
                Category = "Clothing"
            },
            new Product
            {
                ProductResourceId = Guid.NewGuid(),
                Name = "Round Gold Metal Frame Polarized Sunglasses",
                Description = "Vintage-inspired round sunglasses with polished gold metal wireframe and dark green UV-protective lenses.",
                Price = 45.00m,
                Stock = 30,
                DiscountPercentage = 25,
                ImageUrl = "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80",
                Category = "Clothing"
            },
            new Product
            {
                ProductResourceId = Guid.NewGuid(),
                Name = "Urban Commuter Minimalist Laptop Backpack 25L",
                Description = "Sleek water-resistant black everyday carry backpack with padded laptop compartment and luggage pass-through.",
                Price = 65.00m,
                Stock = 50,
                DiscountPercentage = 0,
                ImageUrl = "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
                Category = "Clothing"
            },

            // Groceries & Gourmet
            new Product
            {
                ProductResourceId = Guid.NewGuid(),
                Name = "Specialty Ethiopian Whole Bean Coffee (12oz)",
                Description = "Single-origin washed Arabica coffee beans with vibrant notes of bergamot, peach, and floral jasmine.",
                Price = 18.50m,
                Stock = 90,
                DiscountPercentage = 0,
                ImageUrl = "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80",
                Category = "Groceries"
            },
            new Product
            {
                ProductResourceId = Guid.NewGuid(),
                Name = "Organic Herbal Pyramid Tea Bags (Gift Box)",
                Description = "Artisanal loose-leaf herbal tea encased in biodegradable pyramid infusers for smooth aromatic brewing.",
                Price = 16.00m,
                Stock = 65,
                DiscountPercentage = 10,
                ImageUrl = "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
                Category = "Groceries"
            },
            new Product
            {
                ProductResourceId = Guid.NewGuid(),
                Name = "Organic Extra Virgin Olive Oil (500ml)",
                Description = "Cold-pressed extra virgin olive oil from single-estate Koroneiki olives with robust peppery finish.",
                Price = 24.99m,
                Stock = 45,
                DiscountPercentage = 0,
                ImageUrl = "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80",
                Category = "Groceries"
            },
            new Product
            {
                ProductResourceId = Guid.NewGuid(),
                Name = "Fresh Organic Whole Seedless Watermelon",
                Description = "Crisp, sweet, and highly hydrating whole seedless watermelon sourced directly from organic orchards.",
                Price = 7.99m,
                Stock = 75,
                DiscountPercentage = 0,
                ImageUrl = "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80",
                Category = "Groceries"
            },
            new Product
            {
                ProductResourceId = Guid.NewGuid(),
                Name = "Artisanal White Chocolate Bar with Roasted Almonds",
                Description = "Smooth Swiss-style creamy white chocolate stacked with whole premium roasted crunchy almonds.",
                Price = 6.99m,
                Stock = 140,
                DiscountPercentage = 15,
                ImageUrl = "https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=600&q=80",
                Category = "Groceries"
            },

            // Home & Living
            new Product
            {
                ProductResourceId = Guid.NewGuid(),
                Name = "Dark Roast Fresh Espresso Coffee with Crema",
                Description = "Rich full-bodied espresso shot served in a white ceramic mug with thick golden crema atop.",
                Price = 4.50m,
                Stock = 55,
                DiscountPercentage = 0,
                ImageUrl = "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
                Category = "Groceries"
            },
            new Product
            {
                ProductResourceId = Guid.NewGuid(),
                Name = "Ultra-Plush Hotel Down Alternative Sleeping Pillow",
                Description = "Hypoallergenic medium-firm bed pillow with breathable pure cotton shell for restorative sleep.",
                Price = 34.00m,
                Stock = 45,
                DiscountPercentage = 20,
                ImageUrl = "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80",
                Category = "Home"
            },
            new Product
            {
                ProductResourceId = Guid.NewGuid(),
                Name = "Botanical Amber Glass Dropper Bottle (50ml)",
                Description = "UV-protective amber glass apothecary bottle with glass pipette dropper for serums and essential oils.",
                Price = 12.50m,
                Stock = 40,
                DiscountPercentage = 10,
                ImageUrl = "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80",
                Category = "Home"
            },
            new Product
            {
                ProductResourceId = Guid.NewGuid(),
                Name = "Matte Olive Green Insulated Thermos Bottle (24oz)",
                Description = "Double-wall stainless steel vacuum canteen that maintains beverage temperatures all day.",
                Price = 28.00m,
                Stock = 110,
                DiscountPercentage = 0,
                ImageUrl = "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80",
                Category = "Home"
            },

            // Sports & Fitness
            new Product
            {
                ProductResourceId = Guid.NewGuid(),
                Name = "Manduka Studio High-Density Yoga Mat Roll",
                Description = "Professional non-slip textured yoga mat with high joint cushioning for studio and home practice.",
                Price = 75.00m,
                Stock = 25,
                DiscountPercentage = 10,
                ImageUrl = "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=600&q=80",
                Category = "Sports"
            },
            new Product
            {
                ProductResourceId = Guid.NewGuid(),
                Name = "Commercial Grade Heavy Hex Dumbbells Rack Set",
                Description = "Ergonomic cast-iron rubber-encased hexagonal dumbbells for strength and progressive overload training.",
                Price = 299.00m,
                Stock = 8,
                DiscountPercentage = 15,
                ImageUrl = "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80",
                Category = "Sports"
            },
            new Product
            {
                ProductResourceId = Guid.NewGuid(),
                Name = "Morning Sunrise Outdoor Yoga Fitness Session",
                Description = "Guided outdoor vinyasa yoga and flexibility training program pass overlooking coastal sunrise.",
                Price = 25.00m,
                Stock = 30,
                DiscountPercentage = 0,
                ImageUrl = "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80",
                Category = "Sports"
            },

            // Beauty & Personal Care
            new Product
            {
                ProductResourceId = Guid.NewGuid(),
                Name = "Curology Gentle Daily Cleanser (80ml)",
                Description = "Dermatologist-formulated non-comedogenic foaming face cleanser that deeply purifies without drying.",
                Price = 16.00m,
                Stock = 120,
                DiscountPercentage = 0,
                ImageUrl = "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80",
                Category = "Beauty"
            },
            new Product
            {
                ProductResourceId = Guid.NewGuid(),
                Name = "Luxury Botanical Skincare & Jade Roller Routine Set",
                Description = "Complete daily glow collection featuring facial wash, energizing creams, lip tint, and natural jade roller.",
                Price = 85.00m,
                Stock = 60,
                DiscountPercentage = 10,
                ImageUrl = "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80",
                Category = "Beauty"
            },

            // Books & Knowledge
            new Product
            {
                ProductResourceId = Guid.NewGuid(),
                Name = "Reading Essentials: Open Paperback Book & Coffee Set",
                Description = "Inspirational hardcover reading journal and lifestyle set for mindful reflection, study, and cozy mornings.",
                Price = 19.99m,
                Stock = 35,
                DiscountPercentage = 10,
                ImageUrl = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
                Category = "Books"
            },
            new Product
            {
                ProductResourceId = Guid.NewGuid(),
                Name = "Milk and Honey by Rupi Kaur (Hardcover Edition)",
                Description = "The #1 New York Times bestselling poetry and prose collection by Rupi Kaur on love, loss, trauma, and healing.",
                Price = 18.70m,
                Stock = 80,
                DiscountPercentage = 15,
                ImageUrl = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80",
                Category = "Books"
            },
            new Product
            {
                ProductResourceId = Guid.NewGuid(),
                Name = "The Psychology of Money by Morgan Housel",
                Description = "Timeless lessons on wealth, greed, and happiness by Morgan Housel exploring behavioral psychology in finance.",
                Price = 19.99m,
                Stock = 60,
                DiscountPercentage = 0,
                ImageUrl = "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&w=600&q=80",
                Category = "Books"
            },

            // Furniture
            new Product
            {
                ProductResourceId = Guid.NewGuid(),
                Name = "French Provincial Button-Tufted Cream Accent Chair",
                Description = "Elegant carved wooden-leg armchair featuring deep diamond tufting and plush cream velvet upholstery.",
                Price = 289.99m,
                Stock = 14,
                DiscountPercentage = 15,
                ImageUrl = "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=600&q=80",
                Category = "Furniture"
            },
            new Product
            {
                ProductResourceId = Guid.NewGuid(),
                Name = "Scandinavian Minimalist Wall Clock & Ceramic Planter Set",
                Description = "Natural round wood grain wall clock paired with a modern matte white desk lamp and ceramic plant pot.",
                Price = 59.99m,
                Stock = 18,
                DiscountPercentage = 10,
                ImageUrl = "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=600&q=80",
                Category = "Furniture"
            },
            new Product
            {
                ProductResourceId = Guid.NewGuid(),
                Name = "Ergonomic High-Back Mesh Executive Office Chair",
                Description = "Breathable mesh desk chair with 3D adjustable armrests, lumbar support, and pneumatic seat height adjustment.",
                Price = 249.00m,
                Stock = 25,
                DiscountPercentage = 20,
                ImageUrl = "https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=600&q=80",
                Category = "Furniture"
            },
            new Product
            {
                ProductResourceId = Guid.NewGuid(),
                Name = "Bespoke Three-Piece Plaid Wool Suit (Navy Blue)",
                Description = "Tailored 3-piece formal suit featuring a windowpane plaid pattern blazer, matching vest, and pleated trousers.",
                Price = 349.00m,
                Stock = 20,
                DiscountPercentage = 12,
                ImageUrl = "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80",
                Category = "Clothing"
            },
            new Product
            {
                ProductResourceId = Guid.NewGuid(),
                Name = "Architectural Modern Residence Architecture Plan Blueprint",
                Description = "Award-winning open-concept two-story contemporary pavilion architectural blueprint and consultation.",
                Price = 450.00m,
                Stock = 5,
                DiscountPercentage = 0,
                ImageUrl = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
                Category = "Home"
            }
        };

        foreach (var item in catalog)
        {
            var existing = context.Products.FirstOrDefault(p => 
                p.ImageUrl == item.ImageUrl || 
                p.Name.ToLower() == item.Name.ToLower()
            );

            if (existing != null)
            {
                existing.Name = item.Name;
                existing.Price = item.Price;
                existing.ImageUrl = item.ImageUrl;
                existing.Description = item.Description;
                existing.Category = item.Category;
                existing.DiscountPercentage = item.DiscountPercentage;
                if (existing.Stock <= 0) existing.Stock = item.Stock;
            }
            else
            {
                context.Products.Add(item);
            }
        }
        context.SaveChanges();
    }
}
