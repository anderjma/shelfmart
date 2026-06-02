using Microsoft.AspNetCore.Mvc;
using InventoryBackend.Domain.Entities;
using InventoryBackend.Dto;
using InventoryBackend.DomainService.Interfaces;

namespace InventoryBackend.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
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
