// Este archivo coordina el manejo de la información de los usuarios y su validación lógica.
using BusinessSystem.Domain.Entities;
using BusinessSystem.DomainService.Interfaces;
using BusinessSystem.Dto;
using BusinessSystem.Exceptions;

namespace BusinessSystem.DomainService;

// Esta clase encapsula la lógica de negocio subyacente para los perfiles, registro y autenticación.
public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    // Este método administra la creación de usuarios base, realizando validaciones preventivas sobre las credenciales a utilizar.
    public async Task<UserDto> CreateUserAsync(User user, string plainPassword)
    {
        if (await _userRepository.ExistsAsync(user.Username))
        {
            throw new BadRequestResponseException("El nombre de usuario ya existe.");
        }

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(plainPassword, 8);
        user.UserId = Guid.NewGuid();

        var createdUser = await _userRepository.AddAsync(user);

        return new UserDto
        {
            UserResourceId = createdUser.UserId,
            Name = createdUser.Name,
            Username = createdUser.Username,
            Email = createdUser.Email
        };
    }

    public async Task<UserDto> RegisterCustomerAsync(User user, string plainPassword)
    {
        if (await _userRepository.ExistsAsync(user.Username))
        {
            throw new BadRequestResponseException("El nombre de usuario ya existe.");
        }

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(plainPassword, 8);
        user.UserId = Guid.NewGuid();

        var customerRole = await _userRepository.GetRoleByNameAsync("Customer");
        if (customerRole != null)
        {
            user.UserRoles.Add(new UserRole
            {
                UserId = user.UserId,
                RoleId = customerRole.RoleId,
                User = user,
                Role = customerRole
            });
        }

        var createdUser = await _userRepository.AddAsync(user);

        return new UserDto
        {
            UserResourceId = createdUser.UserId,
            Name = createdUser.Name,
            Username = createdUser.Username,
            Email = createdUser.Email
        };
    }

    public async Task<User?> ValidateUserCredentialsAsync(string username, string plainPassword)
    {
        var user = await _userRepository.GetByUsernameAsync(username);
        if (user == null || !BCrypt.Net.BCrypt.Verify(plainPassword, user.PasswordHash))
        {
            throw new UnauthorizedResponseException("Credenciales inválidas.");
        }
        return user;
    }

    // Este método lista los datos transferibles de los perfiles de todos los usuarios del sistema.
    public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
    {
        var users = await _userRepository.GetAllAsync();
        return users.Select(u => new UserDto
        {
            UserResourceId = u.UserId,
            Name = u.Name,
            Username = u.Username,
            Email = u.Email
        });
    }
}
