using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using InventoryBackend.Facade.Interfaces;

namespace InventoryBackend.Api.Controllers;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/[controller]")]
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
}
