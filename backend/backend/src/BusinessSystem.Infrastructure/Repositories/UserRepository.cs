// Este archivo materializa las consultas CRUD requeridas por el servicio de cuentas de usuario.
using BusinessSystem.Domain.Entities;
using BusinessSystem.DomainService.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BusinessSystem.Infrastructure.Repositories;

// Esta clase utiliza Entity Framework para efectuar guardados, lecturas y eliminación en la tabla de usuarios.
public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context)
    {
        _context = context;
    }

    // Este método extrae el perfil completo de un usuario utilizando su nombre de usuario como filtro de búsqueda.
    public async Task<User?> GetByUsernameAsync(string username)
    {
        return await _context.Users
            .Include(u => u.UserRoles)
            .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.Username == username);
    }

    // Este método comprueba de manera eficiente si existe un usuario con el mismo correo o nombre de usuario registrado.
    public async Task<bool> ExistsAsync(string username)
    {
        return await _context.Users.AnyAsync(u => u.Username == username);
    }

    // Este método inserta una nueva entidad de cuenta en el contexto de base de datos para su posterior almacenamiento.
    public async Task<User> AddAsync(User user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }

    // Este método recupera el listado completo de todos los usuarios registrados junto con sus roles respectivos.
    public async Task<IEnumerable<User>> GetAllAsync()
    {
        return await _context.Users.ToListAsync();
    }

    // Este método consulta la tabla de permisos para encontrar un rol específico mediante su denominación.
    public async Task<Role?> GetRoleByNameAsync(string roleName)
    {
        return await _context.Roles.FirstOrDefaultAsync(r => r.Name == roleName);
    }
}
