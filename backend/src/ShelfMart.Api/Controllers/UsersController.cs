using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShelfMart.Dto;
// This file exposes the administrative endpoints for managing accounts.
using ShelfMart.Facade.Interfaces;

namespace ShelfMart.Api.Controllers;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/[controller]")]
// This controller requires administrator permissions to interact with confidential user information.
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

    [HttpPut("{id:guid}/role")]
    public async Task<IActionResult> UpdateRole(System.Guid id, [FromBody] UpdateUserRoleDto dto)
    {
        try
        {
            var result = await _userFacade.UpdateUserRoleAsync(id, dto.Role);
            return Ok(result);
        }
        catch (System.Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
