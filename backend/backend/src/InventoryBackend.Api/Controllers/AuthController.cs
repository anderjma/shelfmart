using Microsoft.AspNetCore.Mvc;
using InventoryBackend.Dto;
using InventoryBackend.Facade.Interfaces;

namespace InventoryBackend.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
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
