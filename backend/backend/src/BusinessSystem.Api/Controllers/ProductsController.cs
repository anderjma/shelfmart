using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BusinessSystem.Dto;
using BusinessSystem.Facade.Interfaces;
using System;
using System.Threading.Tasks;

namespace BusinessSystem.Api.Controllers;

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

    // ¡Pase libre! Cualquiera puede ver el catálogo
    [AllowAnonymous] 
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var products = await _productFacade.GetAllProductsAsync();
        return Ok(products);
    }

    // ¡Pase libre! Cualquiera puede ver un producto específico
    [AllowAnonymous] 
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var product = await _productFacade.GetProductByIdAsync(id);
        return Ok(product);
    }

    // Estas rutas siguen protegidas por el [Authorize] global de la clase
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateProductDto request)
    {
        var created = await _productFacade.CreateProductAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = created.ProductResourceId }, created);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateProductDto request)
    {
        var updated = await _productFacade.UpdateProductAsync(id, request);
        return Ok(updated);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _productFacade.DeleteProductAsync(id);
        return NoContent();
    }
}
