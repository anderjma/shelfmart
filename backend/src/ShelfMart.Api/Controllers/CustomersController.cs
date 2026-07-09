using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
// This file provides endpoints specifically oriented toward the system's consumers.
using ShelfMart.Domain.Entities;
using ShelfMart.Dto;
using ShelfMart.DomainService.Interfaces;

namespace ShelfMart.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[EnableRateLimiting("LoginPolicy")]
// This controller allows the creation of new accounts for the business's public customers.
public class CustomersController : ControllerBase
{
    private readonly IUserService _userService;

    public CustomersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] CreateUserDto dto)
    {
        try
        {
            var user = new User
            {
                Name = dto.Name,
                Username = dto.Username,
                Email = dto.Email
            };
            
            var result = await _userService.RegisterCustomerAsync(user, dto.Password);
            return Ok(result);
        }
        catch (System.Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
