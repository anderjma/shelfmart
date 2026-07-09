using FluentAssertions;
using ShelfMart.Domain.Entities;
using ShelfMart.DomainService;
using ShelfMart.DomainService.Interfaces;
using ShelfMart.Exceptions;
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
    private readonly UserService _userService;

    public UserServiceTests()
    {
        _userRepository = Substitute.For<IUserRepository>();
        _userService = new UserService(_userRepository);
    }

    private static Role CustomerRole => new() { RoleId = Guid.NewGuid(), Name = "Customer" };
    private static Role AdminRole => new() { RoleId = Guid.NewGuid(), Name = "Admin" };

    #region CreateUserAsync Tests

    [Fact]
    public async Task CreateUserAsync_ShouldThrowBadRequestResponseException_WhenUsernameAlreadyExists()
    {
        // Arrange
        var user = new User { Username = "taken" };
        _userRepository.ExistsAsync("taken").Returns(true);

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
        var customerRole = CustomerRole;
        _userRepository.ExistsAsync("newuser").Returns(false);
        _userRepository.GetRoleByNameAsync("Customer").Returns(customerRole);
        _userRepository.AddAsync(Arg.Any<User>()).Returns(callInfo => callInfo.Arg<User>());

        // Act
        var result = await _userService.CreateUserAsync(user, "Password123!");

        // Assert
        result.Role.Should().Be("Customer");
        user.UserRoles.Should().ContainSingle(ur => ur.RoleId == customerRole.RoleId);
    }

    [Fact]
    public async Task CreateUserAsync_ShouldHashThePassword_NotStoreItInPlainText()
    {
        // Arrange
        var user = new User { Username = "newuser" };
        _userRepository.ExistsAsync("newuser").Returns(false);
        _userRepository.GetRoleByNameAsync("Customer").Returns(CustomerRole);
        _userRepository.AddAsync(Arg.Any<User>()).Returns(callInfo => callInfo.Arg<User>());

        // Act
        await _userService.CreateUserAsync(user, "Password123!");

        // Assert
        user.PasswordHash.Should().NotBe("Password123!");
        BCrypt.Net.BCrypt.Verify("Password123!", user.PasswordHash).Should().BeTrue();
    }

    [Fact]
    public async Task CreateUserAsync_ShouldLeaveUserRoleless_WhenCustomerRoleDoesNotExist()
    {
        // Arrange
        var user = new User { Username = "newuser" };
        _userRepository.ExistsAsync("newuser").Returns(false);
        _userRepository.GetRoleByNameAsync("Customer").Returns((Role?)null);
        _userRepository.AddAsync(Arg.Any<User>()).Returns(callInfo => callInfo.Arg<User>());

        // Act
        var result = await _userService.CreateUserAsync(user, "Password123!");

        // Assert
        result.Role.Should().BeEmpty();
        user.UserRoles.Should().BeEmpty();
    }

    #endregion

    #region RegisterCustomerAsync Tests

    [Fact]
    public async Task RegisterCustomerAsync_ShouldThrowBadRequestResponseException_WhenUsernameAlreadyExists()
    {
        // Arrange
        var user = new User { Username = "taken" };
        _userRepository.ExistsAsync("taken").Returns(true);

        // Act
        Func<Task> act = async () => await _userService.RegisterCustomerAsync(user, "Password123!");

        // Assert
        await act.Should().ThrowAsync<BadRequestResponseException>()
            .WithMessage("Username already exists.");
    }

    [Fact]
    public async Task RegisterCustomerAsync_ShouldAssignCustomerRole_WhenRoleExists()
    {
        // Arrange
        var user = new User { Username = "newcustomer" };
        var customerRole = CustomerRole;
        _userRepository.ExistsAsync("newcustomer").Returns(false);
        _userRepository.GetRoleByNameAsync("Customer").Returns(customerRole);
        _userRepository.AddAsync(Arg.Any<User>()).Returns(callInfo => callInfo.Arg<User>());

        // Act
        var result = await _userService.RegisterCustomerAsync(user, "Password123!");

        // Assert
        result.Role.Should().Be("Customer");
    }

    #endregion

    #region ValidateUserCredentialsAsync Tests

    [Fact]
    public async Task ValidateUserCredentialsAsync_ShouldThrowUnauthorizedResponseException_WhenUserDoesNotExist()
    {
        // Arrange
        _userRepository.GetByUsernameAsync("ghost").Returns((User?)null);

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
        var user = new User
        {
            Username = "someone",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("CorrectPassword1!", 4)
        };
        _userRepository.GetByUsernameAsync("someone").Returns(user);

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
        var user = new User
        {
            Username = "someone",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("CorrectPassword1!", 4)
        };
        _userRepository.GetByUsernameAsync("someone").Returns(user);

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
        _userRepository.GetByIdAsync(userId).Returns((User?)null);

        // Act
        Func<Task> act = async () => await _userService.UpdateUserRoleAsync(userId, "Admin");

        // Assert
        await act.Should().ThrowAsync<ResourceNotFoundException>()
            .WithMessage("User not found.");
    }

    [Fact]
    public async Task UpdateUserRoleAsync_ShouldThrowResourceNotFoundException_WhenTargetRoleDoesNotExistInDatabase()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var user = new User { UserId = userId, Username = "someone" };
        _userRepository.GetByIdAsync(userId).Returns(user);
        _userRepository.GetRoleByNameAsync("Admin").Returns((Role?)null);

        // Act
        Func<Task> act = async () => await _userService.UpdateUserRoleAsync(userId, "Admin");

        // Assert
        await act.Should().ThrowAsync<ResourceNotFoundException>()
            .WithMessage("Role 'Admin' does not exist.");
    }

    [Fact]
    public async Task UpdateUserRoleAsync_ShouldCallSetUserRoleAsync_WhenRoleAndUserAreValid()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var adminRole = AdminRole;
        var user = new User { UserId = userId, Username = "someone" };
        var updatedUser = new User
        {
            UserId = userId,
            Username = "someone",
            UserRoles = new List<UserRole> { new UserRole { UserId = userId, RoleId = adminRole.RoleId, Role = adminRole } }
        };

        _userRepository.GetByIdAsync(userId).Returns(user, updatedUser);
        _userRepository.GetRoleByNameAsync("Admin").Returns(adminRole);

        // Act
        var result = await _userService.UpdateUserRoleAsync(userId, "Admin");

        // Assert
        result.Role.Should().Be("Admin");
        await _userRepository.Received(1).SetUserRoleAsync(user, adminRole);
    }

    #endregion
}
