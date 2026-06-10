using Microsoft.AspNetCore.Mvc;
// Este archivo facilita endpoints orientados específicamente a los consumidores del sistema.
using BusinessSystem.Domain.Entities;
using BusinessSystem.Dto;
using BusinessSystem.DomainService.Interfaces;

namespace BusinessSystem.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
// Este controlador permite la creación de nuevas cuentas para los clientes públicos del negocio.
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
