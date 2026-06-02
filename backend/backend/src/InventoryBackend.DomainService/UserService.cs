using InventoryBackend.Domain.Entities;
using InventoryBackend.DomainService.Interfaces;
using InventoryBackend.Dto;
using InventoryBackend.Exceptions;

namespace InventoryBackend.DomainService;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<UserDto> CreateUserAsync(User user, string plainPassword)
    {
        if (await _userRepository.ExistsAsync(user.Username))
        {
            throw new BadRequestResponseException("Username already exists.");
        }

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(plainPassword);
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

    public async Task<User?> ValidateUserCredentialsAsync(string username, string plainPassword)
    {
        var user = await _userRepository.GetByUsernameAsync(username);
        if (user == null || !BCrypt.Net.BCrypt.Verify(plainPassword, user.PasswordHash))
        {
            throw new UnauthorizedResponseException("Invalid credentials.");
        }
        return user;
    }

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
