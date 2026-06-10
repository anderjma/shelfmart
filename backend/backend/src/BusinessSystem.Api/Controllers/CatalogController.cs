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
    public async Task<IActionResult> GetAll()
    {
        var products = await _productFacade.GetAllProductsAsync();
        return Ok(products);
    }
}
