using InventoryBackend.Dto;

namespace InventoryBackend.Facade.Interfaces;

public interface IAuthFacade
{
    Task<UserDto> RegisterAsync(LoginRequestDto request);
    Task<LoginResponseDto> LoginAsync(LoginRequestDto request);
}
