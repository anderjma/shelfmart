using Microsoft.AspNetCore.Mvc;
// Este archivo provee las consultas públicas del catálogo sin requerir autenticación.
using BusinessSystem.Facade.Interfaces;

namespace BusinessSystem.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
// Este controlador gestiona la visualización de los artículos de inventario para cualquier visitante de la tienda.
public class CatalogController : ControllerBase
{
    private readonly IProductFacade _productFacade;

    public CatalogController(IProductFacade productFacade)
    {
        _productFacade = productFacade;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int? page, [FromQuery] int? pageSize, [FromQuery] string? search, [FromQuery] string? category)
    {
        if (page.HasValue && page.Value > 0)
        {
            var size = pageSize ?? 10;
            var result = await _productFacade.GetPaginatedProductsAsync(page.Value, size, search, category);
            return Ok(result);
        }

        var products = await _productFacade.GetAllProductsAsync();
        return Ok(products);
    }
}
