using FluentAssertions;
using ShelfMart.Domain.Entities;
using ShelfMart.DomainService;
using ShelfMart.DomainService.Interfaces;
using ShelfMart.Exceptions;
using Microsoft.AspNetCore.Identity;
using NSubstitute;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace ShelfMart.UnitTests;

public class UserServiceTests
{
    private readonly IUserRepository _userRepository;
    private readonly UserManager<User> _userManager;
    private readonly RoleManager<Role> _roleManager;
    private readonly UserService _userService;

    public UserServiceTests()
    {
        _userRepository = Substitute.For<IUserRepository>();
        
        var userStore = Substitute.For<IUserStore<User>>();
        _userManager = Substitute.For<UserManager<User>>(userStore, null, null, null, null, null, null, null, null);
        
        var roleStore = Substitute.For<IRoleStore<Role>>();
        _roleManager = Substitute.For<RoleManager<Role>>(roleStore, null, null, null, null);

        _userService = new UserService(_userManager, _roleManager, _userRepository);
    }

    private static Role CustomerRole => new() { Id = Guid.NewGuid(), Name = "Customer" };
    private static Role AdminRole => new() { Id = Guid.NewGuid(), Name = "Admin" };

    #region CreateUserAsync Tests

    [Fact]
    public async Task CreateUserAsync_ShouldThrowBadRequestResponseException_WhenCreationFails()
    {
        // Arrange
        var user = new User { Username = "taken" };
        _userManager.CreateAsync(user, "Password123!").Returns(IdentityResult.Failed(new IdentityError { Description = "Username already exists." }));

        // Act
        Func<Task> act = async () => await _userService.CreateUserAsync(user, "Password123!");

        // Assert
        await act.Should().ThrowAsync<BadRequestResponseException>()
            .WithMessage("Username already exists.");
    }

    [Fact]
    public async Task CreateUserAsync_ShouldAssignCustomerRole_ByDefault()
    {
        // Arrange
        var user = new User { Username = "newuser" };
        _userManager.CreateAsync(user, "Password123!").Returns(IdentityResult.Success);
        _roleManager.RoleExistsAsync("Customer").Returns(true);
        _userManager.AddToRoleAsync(user, "Customer").Returns(IdentityResult.Success);
        
        var fullUser = new User 
        { 
            UserId = user.Id, 
            Username = "newuser", 
            UserRoles = new List<UserRole> { new UserRole { Role = new Role { Name = "Customer" } } } 
        };
        _userRepository.GetByIdAsync(Arg.Any<Guid>()).Returns(fullUser);

        // Act
        var result = await _userService.CreateUserAsync(user, "Password123!");

        // Assert
        result.Role.Should().Be("Customer");
        await _userManager.Received(1).AddToRoleAsync(user, "Customer");
    }

    #endregion

    #region ValidateUserCredentialsAsync Tests

    [Fact]
    public async Task ValidateUserCredentialsAsync_ShouldThrowUnauthorizedResponseException_WhenUserDoesNotExist()
    {
        // Arrange
        _userManager.FindByNameAsync("ghost").Returns((User?)null);

        // Act
        Func<Task> act = async () => await _userService.ValidateUserCredentialsAsync("ghost", "whatever");

        // Assert
        await act.Should().ThrowAsync<UnauthorizedResponseException>()
            .WithMessage("Invalid credentials.");
    }

    [Fact]
    public async Task ValidateUserCredentialsAsync_ShouldThrowUnauthorizedResponseException_WhenPasswordIsWrong()
    {
        // Arrange
        var user = new User { Username = "someone" };
        _userManager.FindByNameAsync("someone").Returns(user);
        _userManager.CheckPasswordAsync(user, "WrongPassword").Returns(false);

        // Act
        Func<Task> act = async () => await _userService.ValidateUserCredentialsAsync("someone", "WrongPassword");

        // Assert
        await act.Should().ThrowAsync<UnauthorizedResponseException>()
            .WithMessage("Invalid credentials.");
    }

    [Fact]
    public async Task ValidateUserCredentialsAsync_ShouldReturnUser_WhenCredentialsAreCorrect()
    {
        // Arrange
        var user = new User { Username = "someone", Id = Guid.NewGuid() };
        _userManager.FindByNameAsync("someone").Returns(user);
        _userManager.CheckPasswordAsync(user, "CorrectPassword1!").Returns(true);
        _userRepository.GetByIdAsync(user.Id).Returns(user);

        // Act
        var result = await _userService.ValidateUserCredentialsAsync("someone", "CorrectPassword1!");

        // Assert
        result.Should().Be(user);
    }

    #endregion

    #region UpdateUserRoleAsync Tests

    [Fact]
    public async Task UpdateUserRoleAsync_ShouldThrowBadRequestResponseException_WhenRoleIsNotAssignable()
    {
        // Act
        Func<Task> act = async () => await _userService.UpdateUserRoleAsync(Guid.NewGuid(), "SuperAdmin");

        // Assert
        await act.Should().ThrowAsync<BadRequestResponseException>();
    }

    [Fact]
    public async Task UpdateUserRoleAsync_ShouldThrowResourceNotFoundException_WhenUserDoesNotExist()
    {
        // Arrange
        var userId = Guid.NewGuid();
        _userManager.FindByIdAsync(userId.ToString()).Returns((User?)null);

        // Act
        Func<Task> act = async () => await _userService.UpdateUserRoleAsync(userId, "Admin");

        // Assert
        await act.Should().ThrowAsync<ResourceNotFoundException>()
            .WithMessage("User not found.");
    }

    [Fact]
    public async Task UpdateUserRoleAsync_ShouldThrowResourceNotFoundException_WhenTargetRoleDoesNotExist()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var user = new User { Id = userId, Username = "someone" };
        _userManager.FindByIdAsync(userId.ToString()).Returns(user);
        _roleManager.RoleExistsAsync("Admin").Returns(false);

        // Act
        Func<Task> act = async () => await _userService.UpdateUserRoleAsync(userId, "Admin");

        // Assert
        await act.Should().ThrowAsync<ResourceNotFoundException>()
            .WithMessage("Role 'Admin' does not exist.");
    }

    [Fact]
    public async Task UpdateUserRoleAsync_ShouldUpdateRole_WhenValid()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var user = new User { Id = userId, Username = "someone" };
        var currentRoles = new List<string> { "Customer" };
        
        _userManager.FindByIdAsync(userId.ToString()).Returns(user);
        _roleManager.RoleExistsAsync("Admin").Returns(true);
        _userManager.GetRolesAsync(user).Returns(currentRoles);
        
        var updatedUser = new User
        {
            Id = userId,
            Username = "someone",
            UserRoles = new List<UserRole> { new UserRole { Role = new Role { Name = "Admin" } } }
        };
        _userRepository.GetByIdAsync(userId).Returns(updatedUser);

        // Act
        var result = await _userService.UpdateUserRoleAsync(userId, "Admin");

        // Assert
        result.Role.Should().Be("Admin");
        await _userManager.Received(1).RemoveFromRolesAsync(user, currentRoles);
        await _userManager.Received(1).AddToRoleAsync(user, "Admin");
    }

    #endregion
}
