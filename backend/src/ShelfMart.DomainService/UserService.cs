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
    private static readonly string[] AssignableRoles = { "Admin", "Customer" };
    // BCrypt work factor 11: higher than the framework default (10) to raise the cost of
    // offline brute-forcing if the password hash table ever leaks, while staying fast enough
    // to not noticeably slow down login/registration.
    private const int PasswordWorkFactor = 11;

    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    // This method manages the creation of base users, performing preventive validations on the credentials to be used.
    // New users default to the Customer role; admins can promote them afterwards via UpdateUserRoleAsync.
    public async Task<UserDto> CreateUserAsync(User user, string plainPassword)
    {
        if (await _userRepository.ExistsAsync(user.Username))
        {
            throw new BadRequestResponseException("Username already exists.");
        }

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(plainPassword, PasswordWorkFactor);
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

        return ToDto(createdUser);
    }

    public async Task<UserDto> RegisterCustomerAsync(User user, string plainPassword)
    {
        if (await _userRepository.ExistsAsync(user.Username))
        {
            throw new BadRequestResponseException("Username already exists.");
        }

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(plainPassword, PasswordWorkFactor);
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

        return ToDto(createdUser);
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
        return users.Select(ToDto);
    }

    // This method changes a user's role, restricted to the roles the admin panel is allowed to assign.
    public async Task<UserDto> UpdateUserRoleAsync(Guid userId, string newRole)
    {
        if (!AssignableRoles.Contains(newRole))
        {
            throw new BadRequestResponseException($"'{newRole}' is not a valid role. Allowed roles: {string.Join(", ", AssignableRoles)}.");
        }

        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) throw new ResourceNotFoundException("User not found.");

        var role = await _userRepository.GetRoleByNameAsync(newRole);
        if (role == null) throw new ResourceNotFoundException($"Role '{newRole}' does not exist.");

        await _userRepository.SetUserRoleAsync(user, role);

        var updatedUser = await _userRepository.GetByIdAsync(userId);
        return ToDto(updatedUser!);
    }

    // This method converts a user entity into its transfer object representation, including its current role.
    private static UserDto ToDto(User user)
    {
        return new UserDto
        {
            UserResourceId = user.UserId,
            Name = user.Name,
            Username = user.Username,
            Email = user.Email,
            Role = user.UserRoles.Select(ur => ur.Role.Name).FirstOrDefault() ?? string.Empty
        };
    }
}
