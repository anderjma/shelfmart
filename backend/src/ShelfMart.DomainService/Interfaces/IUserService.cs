// This file formalizes the contract of the service responsible for user accounts.
using ShelfMart.Domain.Entities;
using ShelfMart.Dto;

namespace ShelfMart.DomainService.Interfaces;

public interface IUserService
{
    Task<UserDto> CreateUserAsync(User user, string plainPassword);
    Task<UserDto> RegisterCustomerAsync(User user, string plainPassword);
    Task<User?> ValidateUserCredentialsAsync(string username, string plainPassword);
    Task<IEnumerable<UserDto>> GetAllUsersAsync();
}
