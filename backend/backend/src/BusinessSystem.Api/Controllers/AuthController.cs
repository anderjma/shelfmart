using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
// Este archivo expone el endpoint necesario para intercambiar credenciales por tokens de sesión.
using BusinessSystem.Dto;
using BusinessSystem.Facade.Interfaces;

namespace BusinessSystem.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[EnableRateLimiting("LoginPolicy")]
// Este controlador valida la identidad de los usuarios y rechaza las solicitudes no autorizadas.
public class AuthController : ControllerBase
{
    private readonly IAuthFacade _authFacade;

    public AuthController(IAuthFacade authFacade)
    {
        _authFacade = authFacade;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] LoginRequestDto request)
    {
        var result = await _authFacade.RegisterAsync(request);
        return Created("", result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
    {
        var result = await _authFacade.LoginAsync(request);
        return Ok(result);
    }
}
