using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BusinessSystem.Dto;
// Este archivo expone los endpoints administrativos para la administración de cuentas.
using BusinessSystem.Facade.Interfaces;

namespace BusinessSystem.Api.Controllers;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/[controller]")]
// Este controlador requiere permisos de administrador para interactuar con la información confidencial de los usuarios.
public class UsersController : ControllerBase
{
    private readonly IUserFacade _userFacade;

    public UsersController(IUserFacade userFacade)
    {
        _userFacade = userFacade;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var users = await _userFacade.GetAllUsersAsync();
        return Ok(users);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateUserDto dto)
    {
        try 
        {
            var result = await _userFacade.CreateUserAsync(dto);
            return Ok(result);
        }
        catch (System.Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
