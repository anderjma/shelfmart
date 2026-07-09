// This file configures the data access layer and the representation of the relational database schema.
using Microsoft.EntityFrameworkCore;
using ShelfMart.Domain.Entities;

namespace ShelfMart.Infrastructure;

// This class handles the object-relational mapping (ORM), linking the domain entities to the physical database tables.
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Product> Products { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<UserRole> UserRoles { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }

    // This property defines the audit log records table.
    public DbSet<AuditLog> AuditLogs { get; set; }

    // This property defines the reference catalog of product categories.
    public DbSet<Category> Categories { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.Entity<Product>().HasKey(p => p.ProductResourceId);
        modelBuilder.Entity<Product>().Property(p => p.ProductResourceId).ValueGeneratedNever();

        modelBuilder.Entity<User>().HasKey(u => u.UserId);
        modelBuilder.Entity<User>().Property(u => u.UserId).ValueGeneratedNever();

        modelBuilder.Entity<AuditLog>().HasKey(a => a.AuditLogId);
        modelBuilder.Entity<AuditLog>().Property(a => a.AuditLogId).ValueGeneratedNever();

        modelBuilder.Entity<Role>().Property(r => r.RoleId).ValueGeneratedNever();

        modelBuilder.Entity<Order>().Property(o => o.OrderId).ValueGeneratedNever();

        modelBuilder.Entity<UserRole>().HasKey(ur => new { ur.UserId, ur.RoleId });
        modelBuilder.Entity<UserRole>().HasOne(ur => ur.User).WithMany(u => u.UserRoles).HasForeignKey(ur => ur.UserId);
        modelBuilder.Entity<UserRole>().HasOne(ur => ur.Role).WithMany(r => r.UserRoles).HasForeignKey(ur => ur.RoleId);

        modelBuilder.Entity<OrderItem>()
            .Property(oi => oi.OrderItemId)
            .ValueGeneratedNever();

        modelBuilder.Entity<OrderItem>()
            .HasOne(oi => oi.Order)
            .WithMany(o => o.OrderItems)
            .HasForeignKey(oi => oi.OrderId);

        modelBuilder.Entity<OrderItem>()
            .HasOne(oi => oi.Product)
            .WithMany(p => p.OrderItems)
            .HasForeignKey(oi => oi.ProductResourceId);

        modelBuilder.Entity<Order>()
            .HasOne(o => o.User)
            .WithMany()
            .HasForeignKey(o => o.UserResourceId);

        modelBuilder.Entity<Order>()
            .Property(o => o.Status)
            .HasConversion<string>()
            .HasMaxLength(20);

        modelBuilder.Entity<Category>().HasKey(c => c.CategoryId);
        modelBuilder.Entity<Category>().Property(c => c.CategoryId).ValueGeneratedNever();
        modelBuilder.Entity<Category>().HasIndex(c => c.Name).IsUnique();

        // Products.Category is a real foreign key into Categories.Name (not free text), so the
        // storefront filter and the admin category picker can never drift apart again. Renaming a
        // category cascades to every product using it instead of orphaning them.
        modelBuilder.Entity<Product>()
            .HasOne<Category>()
            .WithMany()
            .HasForeignKey(p => p.Category)
            .HasPrincipalKey(c => c.Name)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
