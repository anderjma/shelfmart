using Microsoft.EntityFrameworkCore;
// Este archivo contiene las consultas de bajo nivel exclusivas para ubicar roles dentro del sistema de permisos.
using BusinessSystem.Domain.Entities;
using BusinessSystem.DomainService.Interfaces;

namespace BusinessSystem.Infrastructure.Repositories;

// Esta clase interactúa con el ORM para obtener la entidad representativa del rol buscado durante el registro.
public class RoleRepository : IRoleRepository
{
    private readonly AppDbContext _context;

    public RoleRepository(AppDbContext context)
    {
        _context = context;
    }

    // Este método busca un rol de autorización existente en base a su nombre alfanumérico.
    public async Task<Role?> GetByNameAsync(string name)
    {
        return await _context.Roles.FirstOrDefaultAsync(r => r.Name == name);
    }

    // Este método obtiene todos los niveles de acceso disponibles dentro de la arquitectura de seguridad.
    public async Task<List<Role>> GetAllAsync()
    {
        return await _context.Roles.ToListAsync();
    }
}