using BusinessSystem.Dto;

namespace BusinessSystem.Facade.Interfaces;

public interface IAuthFacade
{
    Task<UserDto> RegisterAsync(LoginRequestDto request);
    Task<LoginResponseDto> LoginAsync(LoginRequestDto request);
}
