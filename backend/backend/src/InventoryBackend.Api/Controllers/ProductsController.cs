using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using InventoryBackend.Dto;
using InventoryBackend.Facade.Interfaces;

namespace InventoryBackend.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductFacade _productFacade;

    public ProductsController(IProductFacade productFacade)
    {
        _productFacade = productFacade;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var products = await _productFacade.GetAllProductsAsync();
        return Ok(products);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateProductDto request)
    {
        var created = await _productFacade.CreateProductAsync(request);
        return Created("", created);
    }
}
