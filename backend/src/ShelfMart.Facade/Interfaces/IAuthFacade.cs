// This file specifies the facade that isolates the complex authentication and authorization processes.
using ShelfMart.Dto;

namespace ShelfMart.Facade.Interfaces;

// This interface masks the underlying login validation logic from the outer layers.
public interface IAuthFacade
{
    Task<UserDto> RegisterAsync(LoginRequestDto request);
    Task<LoginResponseDto> LoginAsync(LoginRequestDto request);
}
