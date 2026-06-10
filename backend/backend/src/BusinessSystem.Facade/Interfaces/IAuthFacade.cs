// Este archivo especifica la fachada que aísla los procesos complejos de autenticación y autorización.
using BusinessSystem.Dto;

namespace BusinessSystem.Facade.Interfaces;

// Esta interfaz enmascara la lógica subyacente para validación de ingresos frente a las capas externas.
public interface IAuthFacade
{
    Task<UserDto> RegisterAsync(LoginRequestDto request);
    Task<LoginResponseDto> LoginAsync(LoginRequestDto request);
}
