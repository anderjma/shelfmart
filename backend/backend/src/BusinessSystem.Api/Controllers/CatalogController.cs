using Microsoft.AspNetCore.Mvc;
using BusinessSystem.Facade.Interfaces;

namespace BusinessSystem.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CatalogController : ControllerBase
{
    private readonly IProductFacade _productFacade;

    public CatalogController(IProductFacade productFacade)
    {
        _productFacade = productFacade;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var products = await _productFacade.GetAllProductsAsync();
        return Ok(products);
    }
}
