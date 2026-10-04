// This file coordinates the handling of user information and its logical validation.
using ShelfMart.Domain.Entities;
using ShelfMart.DomainService.Interfaces;
using ShelfMart.Dto;
using ShelfMart.Exceptions;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ShelfMart.DomainService;

// This class encapsulates the underlying business logic for profiles, registration, and authentication.
public class UserService : IUserService
{
    private readonly UserManager<User> _userManager;
    private readonly RoleManager<Role> _roleManager;
    private readonly IUserRepository _userRepository; // Keeping for GetAllUsersAsync or if needed
    private static readonly string[] AssignableRoles = { "Admin", "Customer" };

    public UserService(UserManager<User> userManager, RoleManager<Role> roleManager, IUserRepository userRepository)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _userRepository = userRepository;
    }

    public async Task<UserDto> CreateUserAsync(User user, string plainPassword)
    {
        user.UserId = Guid.NewGuid();
        var result = await _userManager.CreateAsync(user, plainPassword);
        if (!result.Succeeded)
        {
            throw new BadRequestResponseException(string.Join(", ", result.Errors.Select(e => e.Description)));
        }

        if (await _roleManager.RoleExistsAsync("Customer"))
        {
            await _userManager.AddToRoleAsync(user, "Customer");
        }

        var createdUser = await _userRepository.GetByIdAsync(user.Id);
        return ToDto(createdUser ?? user);
    }

    public async Task<UserDto> RegisterCustomerAsync(User user, string plainPassword)
    {
        return await CreateUserAsync(user, plainPassword);
    }

    public async Task<User?> ValidateUserCredentialsAsync(string username, string plainPassword)
    {
        var user = await _userManager.FindByNameAsync(username);
        if (user == null)
        {
            throw new UnauthorizedResponseException("Invalid credentials.");
        }

        // Accounts created before the Identity migration store BCrypt hashes, which Identity's
        // PasswordHasher cannot verify. Verify them with BCrypt and transparently upgrade the hash.
        var isLegacyHash = user.PasswordHash != null && user.PasswordHash.StartsWith("$2");
        if (isLegacyHash)
        {
            bool legacyValid;
            try { legacyValid = BCrypt.Net.BCrypt.Verify(plainPassword, user.PasswordHash); }
            catch (Exception) { legacyValid = false; }

            if (!legacyValid)
            {
                throw new UnauthorizedResponseException("Invalid credentials.");
            }

            user.PasswordHash = _userManager.PasswordHasher.HashPassword(user, plainPassword);
            await _userManager.UpdateAsync(user);
        }
        else if (!await _userManager.CheckPasswordAsync(user, plainPassword))
        {
            throw new UnauthorizedResponseException("Invalid credentials.");
        }
        
        // Ensure user is loaded with roles for token generation
        var fullUser = await _userRepository.GetByIdAsync(user.Id);
        return fullUser ?? user;
    }

    public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
    {
        var users = await _userRepository.GetAllAsync();
        return users.Select(ToDto);
    }

    public async Task<UserDto> UpdateUserRoleAsync(Guid userId, string newRole)
    {
        if (!AssignableRoles.Contains(newRole))
        {
            throw new BadRequestResponseException($"'{newRole}' is not a valid role. Allowed roles: {string.Join(", ", AssignableRoles)}.");
        }

        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null) throw new ResourceNotFoundException("User not found.");

        if (!await _roleManager.RoleExistsAsync(newRole))
            throw new ResourceNotFoundException($"Role '{newRole}' does not exist.");

        var currentRoles = await _userManager.GetRolesAsync(user);
        await _userManager.RemoveFromRolesAsync(user, currentRoles);
        await _userManager.AddToRoleAsync(user, newRole);

        var updatedUser = await _userRepository.GetByIdAsync(userId);
        return ToDto(updatedUser!);
    }

    private static UserDto ToDto(User user)
    {
        return new UserDto
        {
            UserResourceId = user.UserId,
            Name = user.Name,
            Username = user.Username,
            Email = user.Email,
            Role = user.UserRoles?.Select(ur => ur.Role.Name).FirstOrDefault() ?? string.Empty
        };
    }
}
