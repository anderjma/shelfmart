// This file exposes the read-only category reference catalog used to classify products.
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShelfMart.Facade.Interfaces;
using System.Threading.Tasks;

namespace ShelfMart.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryFacade _categoryFacade;

    public CategoriesController(ICategoryFacade categoryFacade)
    {
        _categoryFacade = categoryFacade;
    }

    // This attribute allows any user to read the category catalog without authentication,
    // since it is consumed by the public store's category filters as well as the admin panel.
    [AllowAnonymous]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var categories = await _categoryFacade.GetAllCategoriesAsync();
        return Ok(categories);
    }
}
