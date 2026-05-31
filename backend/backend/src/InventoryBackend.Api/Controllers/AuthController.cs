using Microsoft.AspNetCore.Mvc;
using InventoryBackend.Dto;
using InventoryBackend.Facade.Interfaces;
using InventoryBackend.Exceptions;

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
        try
        {
            var result = await _authFacade.RegisterAsync(request);
            return Created("", result);
        }
        catch (BadRequestResponseException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
    {
        try
        {
            var result = await _authFacade.LoginAsync(request);
            return Ok(result);
        }
        catch (UnauthorizedResponseException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }
}
