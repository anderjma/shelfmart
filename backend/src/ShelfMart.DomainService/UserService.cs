// This file coordinates the handling of user information and its logical validation.
using ShelfMart.Domain.Entities;
using ShelfMart.DomainService.Interfaces;
using ShelfMart.Dto;
using ShelfMart.Exceptions;

namespace ShelfMart.DomainService;

// This class encapsulates the underlying business logic for profiles, registration, and authentication.
public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    // This method manages the creation of base users, performing preventive validations on the credentials to be used.
    public async Task<UserDto> CreateUserAsync(User user, string plainPassword)
    {
        if (await _userRepository.ExistsAsync(user.Username))
        {
            throw new BadRequestResponseException("Username already exists.");
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
            throw new BadRequestResponseException("Username already exists.");
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
            throw new UnauthorizedResponseException("Invalid credentials.");
        }
        return user;
    }

    // This method lists the transferable data for all user profiles in the system.
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
