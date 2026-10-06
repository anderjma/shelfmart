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
                "Stainless Steel Countertop Microwave Oven",
                "Home",
                89.99m,
                "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=600&q=80",
                "Compact 900W stainless steel microwave with digital display, express cooking presets, and easy-to-clean enamel interior."
            ),
            ["lamp"] = (
                "Modern Ceramic Bedside Table Lamp",
                "Home",
                39.99m,
                "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80",
                "Minimalist ceramic table lamp with linen drum shade and warm diffused ambient illumination for bedside or living room."
            ),
            ["socks"] = (
                "Merino Wool Breathable Crew Socks (3-Pack)",
                "Clothing",
                16.50m,
                "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&w=600&q=80",
                "Cushioned moisture-wicking merino wool blend crew socks with seamless toe closure for daily wear and hiking."
            ),
            ["silver spoon set"] = (
                "Mirror Polish Stainless Steel Cutlery Set (24-Piece)",
                "Home",
                42.00m,
                "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=600&q=80",
                "Food-grade 18/10 stainless steel flatware silverware set with mirror finish and ergonomic handles for 6 place settings."
            ),
            ["nike sports sneakers"] = (
                "Nike Revolution 6 Next Nature Running Shoes",
                "Clothing",
                69.99m,
                "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=600&q=80",
                "Breathable road running shoes made with recycled materials and soft foam cushioning for an effortless stride."
            ),
            ["skirt"] = (
                "Pleated High-Waisted A-Line Midi Skirt",
                "Clothing",
                38.00m,
                "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=600&q=80",
                "Flowy pleated A-line midi skirt with elasticized waistband and breathable woven fabric for all seasons."
            ),
            ["shirt"] = (
                "Tailored Oxford Button-Down Long Sleeve Shirt",
                "Clothing",
                45.00m,
                "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80",
                "Classic fit 100% combed cotton Oxford shirt with button-down collar and durable pearlized buttons."
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
                Name = "Logitech MX Master 3S Mouse",
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
                Name = "Keychron K2 Mechanical Keyboard",
                Description = "Compact 75% wireless mechanical keyboard with hot-swappable Gateron G Pro switches and RGB backlight.",
                Price = 89.99m,
                Stock = 30,
                DiscountPercentage = 0,
                ImageUrl = "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80",
                Category = "Electronics"
            },
            new Product
            {
                ProductResourceId = Guid.NewGuid(),
                Name = "Dell UltraSharp 27-inch 4K Monitor",
                Description = "IPS Black technology 4K UHD monitor with 98% DCI-P3 wide color gamut and USB-C hub.",
                Price = 529.99m,
                Stock = 12,
                DiscountPercentage = 5,
                ImageUrl = "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80",
                Category = "Electronics"
            },
            new Product
            {
                ProductResourceId = Guid.NewGuid(),
                Name = "Apple Watch Series 9 GPS 45mm",
                Description = "Advanced health sensors, Crash Detection, and bright Always-On Retina display with water resistance.",
                Price = 429.00m,
                Stock = 18,
                DiscountPercentage = 0,
                ImageUrl = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
                Category = "Electronics"
            },
            new Product
            {
                ProductResourceId = Guid.NewGuid(),
                Name = "Anker 737 Fast Power Bank 24,000mAh",
                Description = "Ultra-powerful two-way charging power bank with smart digital display and 140W total output.",
                Price = 149.99m,
                Stock = 35,
                DiscountPercentage = 20,
                ImageUrl = "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=600&q=80",
                Category = "Electronics"
            },

            // Clothing & Apparel
            new Product
            {
                ProductResourceId = Guid.NewGuid(),
                Name = "Classic Heavyweight Cotton T-Shirt",
                Description = "Premium 220 GSM combed organic cotton t-shirt with durable reinforced crew neck and relaxed fit.",
                Price = 28.00m,
                Stock = 120,
                DiscountPercentage = 0,
                ImageUrl = "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80",
                Category = "Clothing"
            },
            new Product
            {
                ProductResourceId = Guid.NewGuid(),
                Name = "Levi's 511 Slim Fit Stretch Jeans",
                Description = "Modern slim-cut denim jeans with added stretch for all-day comfort and mobility.",
                Price = 69.50m,
                Stock = 85,
                DiscountPercentage = 15,
                ImageUrl = "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80",
                Category = "Clothing"
            },
            new Product
            {
                ProductResourceId = Guid.NewGuid(),
                Name = "Nike Air Zoom Pegasus 40",
                Description = "Responsive everyday road running shoes featuring dual Zoom Air units and engineered mesh.",
                Price = 130.00m,
                Stock = 40,
                DiscountPercentage = 10,
                ImageUrl = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
                Category = "Clothing"
            },
            new Product
            {
                ProductResourceId = Guid.NewGuid(),
                Name = "Patagonia Torrentshell 3L Rain Jacket",
                Description = "Durable waterproof and breathable 3-layer shell jacket designed for harsh outdoor weather.",
                Price = 179.00m,
                Stock = 22,
                DiscountPercentage = 0,
                ImageUrl = "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80",
                Category = "Clothing"
            },
            new Product
            {
                ProductResourceId = Guid.NewGuid(),
                Name = "Ray-Ban Classic Aviator Sunglasses",
                Description = "Timeless gold metal frame sunglasses with green polarized crystal G-15 lenses.",
                Price = 163.00m,
                Stock = 30,
                DiscountPercentage = 25,
                ImageUrl = "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80",
                Category = "Clothing"
            },
            new Product
            {
                ProductResourceId = Guid.NewGuid(),
                Name = "The North Face Borealis Backpack 28L",
                Description = "Versatile commuter and trail backpack with dedicated 15-inch laptop sleeve and FlexVent suspension.",
                Price = 99.00m,
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
                Name = "Ceremonial Grade Uji Matcha (100g)",
                Description = "First-harvest stone-ground Japanese green tea powder with rich umami flavor and vibrant jade color.",
                Price = 32.00m,
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
                Name = "Raw Wildflower Honey (16oz)",
                Description = "Unfiltered and unheated pure wildflower honey harvested sustainably from pesticide-free apiaries.",
                Price = 14.50m,
                Stock = 75,
                DiscountPercentage = 0,
                ImageUrl = "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80",
                Category = "Groceries"
            },
            new Product
            {
                ProductResourceId = Guid.NewGuid(),
                Name = "Artisanal Single-Origin Dark Chocolate 85%",
                Description = "Handcrafted organic dark chocolate bar made from fine aroma cacao beans with notes of dried plum.",
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
                Name = "Handcrafted Matte Ceramic Mug (12oz)",
                Description = "Stoneware ceramic coffee mug with textured satin finish, comfortable ergonomic handle, and heat retention.",
                Price = 16.00m,
                Stock = 55,
                DiscountPercentage = 0,
                ImageUrl = "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
                Category = "Home"
            },
            new Product
            {
                ProductResourceId = Guid.NewGuid(),
                Name = "Chunky Knit Merino Wool Throw Blanket",
                Description = "Ultra-soft 100% merino wool knit throw blanket for living rooms and cozy bedroom decor (50x60 in).",
                Price = 89.00m,
                Stock = 15,
                DiscountPercentage = 20,
                ImageUrl = "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80",
                Category = "Home"
            },
            new Product
            {
                ProductResourceId = Guid.NewGuid(),
                Name = "Ultrasonic Essential Oil Aromatherapy Diffuser",
                Description = "Whisper-quiet cool mist aroma humidifier with warm ambient LED light and auto shut-off (300ml).",
                Price = 38.50m,
                Stock = 40,
                DiscountPercentage = 10,
                ImageUrl = "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80",
                Category = "Home"
            },
            new Product
            {
                ProductResourceId = Guid.NewGuid(),
                Name = "Stainless Steel Insulated Water Bottle (32oz)",
                Description = "Double-wall vacuum insulated canteen keeps drinks cold for 24 hours or hot for 12 hours.",
                Price = 29.99m,
                Stock = 110,
                DiscountPercentage = 0,
                ImageUrl = "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80",
                Category = "Home"
            },

            // Sports & Fitness
            new Product
            {
                ProductResourceId = Guid.NewGuid(),
                Name = "Manduka PRO High-Density Yoga Mat 6mm",
                Description = "Professional non-slip yoga mat with dense joint cushioning and lifetime durability guarantee.",
                Price = 120.00m,
                Stock = 25,
                DiscountPercentage = 10,
                ImageUrl = "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=600&q=80",
                Category = "Sports"
            },
            new Product
            {
                ProductResourceId = Guid.NewGuid(),
                Name = "Bowflex SelectTech 552 Adjustable Dumbbells",
                Description = "Rapid dial-adjust dumbbells that replace 15 sets of weights from 5 to 52.5 lbs per hand.",
                Price = 429.00m,
                Stock = 8,
                DiscountPercentage = 15,
                ImageUrl = "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80",
                Category = "Sports"
            },
            new Product
            {
                ProductResourceId = Guid.NewGuid(),
                Name = "Theragun Mini 2.0 Percussive Massage Gun",
                Description = "Ultra-portable compact massage device with quiet brushless motor and 3 scientifically calibrated speeds.",
                Price = 199.00m,
                Stock = 16,
                DiscountPercentage = 0,
                ImageUrl = "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80",
                Category = "Sports"
            },

            // Beauty & Personal Care
            new Product
            {
                ProductResourceId = Guid.NewGuid(),
                Name = "CeraVe Hydrating Facial Cleanser (16 fl oz)",
                Description = "Non-foaming daily face wash formulated with essential ceramides and hyaluronic acid for normal to dry skin.",
                Price = 15.49m,
                Stock = 120,
                DiscountPercentage = 0,
                ImageUrl = "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80",
                Category = "Beauty"
            },
            new Product
            {
                ProductResourceId = Guid.NewGuid(),
                Name = "La Roche-Posay Anthelios Mineral Sunscreen SPF 50",
                Description = "Ultra-light tinted face mineral sunscreen fluid with antioxidant protection and matte finish.",
                Price = 36.99m,
                Stock = 60,
                DiscountPercentage = 10,
                ImageUrl = "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80",
                Category = "Beauty"
            },

            // Books & Knowledge
            new Product
            {
                ProductResourceId = Guid.NewGuid(),
                Name = "Clean Code: A Handbook of Agile Software Craftsmanship",
                Description = "Classic programming guide by Robert C. Martin detailing principles, patterns, and practices of writing clean code.",
                Price = 44.99m,
                Stock = 35,
                DiscountPercentage = 20,
                ImageUrl = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
                Category = "Books"
            },
            new Product
            {
                ProductResourceId = Guid.NewGuid(),
                Name = "Atomic Habits: Tiny Changes, Remarkable Results",
                Description = "New York Times bestselling book by James Clear on building good habits and breaking bad ones.",
                Price = 22.00m,
                Stock = 80,
                DiscountPercentage = 15,
                ImageUrl = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80",
                Category = "Books"
            },
            new Product
            {
                ProductResourceId = Guid.NewGuid(),
                Name = "Amazon Kindle Paperwhite (16 GB) 6.8-inch",
                Description = "Waterproof e-reader with 300 ppi glare-free display, adjustable warm light, and weeks of battery life.",
                Price = 149.99m,
                Stock = 25,
                DiscountPercentage = 0,
                ImageUrl = "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&w=600&q=80",
                Category = "Books"
            },

            // Furniture
            new Product
            {
                ProductResourceId = Guid.NewGuid(),
                Name = "Mid-Century Modern Upholstered Armchair",
                Description = "Comfortable ergonomic accent armchair with solid walnut wood legs and high-resilience foam cushion.",
                Price = 289.99m,
                Stock = 14,
                DiscountPercentage = 15,
                ImageUrl = "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=600&q=80",
                Category = "Furniture"
            },
            new Product
            {
                ProductResourceId = Guid.NewGuid(),
                Name = "Solid Oak Minimalist Coffee Table",
                Description = "Handcrafted natural oak coffee table with rounded safety corners and durable matte protective lacquer.",
                Price = 199.50m,
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
                Name = "Modern 5-Tier Industrial Ladder Bookshelf",
                Description = "Sturdy steel frame open shelving unit with rustic wood grain shelves for living rooms and offices.",
                Price = 119.00m,
                Stock = 30,
                DiscountPercentage = 12,
                ImageUrl = "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80",
                Category = "Furniture"
            },
            new Product
            {
                ProductResourceId = Guid.NewGuid(),
                Name = "Minimalist Floating TV Stand & Media Console",
                Description = "Wall-mounted entertainment center with cable management holes and push-to-open storage compartments.",
                Price = 179.99m,
                Stock = 15,
                DiscountPercentage = 25,
                ImageUrl = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
                Category = "Furniture"
            }
        };

        foreach (var item in catalog)
        {
            var existing = context.Products.FirstOrDefault(p => p.Name.ToLower() == item.Name.ToLower());
            if (existing != null)
            {
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
