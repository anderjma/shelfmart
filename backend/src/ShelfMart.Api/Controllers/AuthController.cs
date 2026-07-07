using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
// This file exposes the endpoint needed to exchange credentials for session tokens.
using ShelfMart.Dto;
using ShelfMart.Facade.Interfaces;

namespace ShelfMart.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[EnableRateLimiting("LoginPolicy")]
// This controller validates users' identity and rejects unauthorized requests.
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
