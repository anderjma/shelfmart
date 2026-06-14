// Este archivo define los endpoints para el control y modificación del catálogo de inventario.
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BusinessSystem.Dto;
using BusinessSystem.Facade.Interfaces;
using System;
using System.Threading.Tasks;

namespace BusinessSystem.Api.Controllers;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/[controller]")]
// Este controlador requiere privilegios administrativos para realizar cambios en los precios o la información de productos.
public class ProductsController : ControllerBase
{
    private readonly IProductFacade _productFacade;

    public ProductsController(IProductFacade productFacade)
    {
        _productFacade = productFacade;
    }

    // Este atributo permite que cualquier usuario visualice el catálogo de productos sin autenticación.
    [AllowAnonymous] 
    [HttpGet]
    // Este método retorna el inventario completo o paginado, habilitando su lectura para la tienda y el panel de gestión.
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

    // Este atributo permite que cualquier usuario visualice un producto específico sin autenticación.
    [AllowAnonymous] 
    [HttpGet("{id:guid}")]
    // Este método despacha la información en detalle de un producto específico, validando previamente que exista.
    public async Task<IActionResult> GetById(Guid id)
    {
        var product = await _productFacade.GetProductByIdAsync(id);
        return Ok(product);
    }

    // Las siguientes rutas mantienen la protección del atributo de autorización global de la clase.
    [HttpPost]
    // Este método atiende las peticiones de creación para alojar nuevos artículos dentro del catálogo disponible.
    public async Task<IActionResult> Create([FromBody] CreateProductDto request)
    {
        var created = await _productFacade.CreateProductAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = created.ProductResourceId }, created);
    }

    [HttpPut("{id:guid}")]
    // Este método acepta una solicitud de reemplazo para modificar características como precio o inventario de un producto.
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateProductDto request)
    {
        var updated = await _productFacade.UpdateProductAsync(id, request);
        return Ok(updated);
    }

    [HttpDelete("{id:guid}")]
    // Este método ejecuta la orden de borrado para remover del sistema aquel producto que ya no se ofrezca.
    public async Task<IActionResult> Delete(Guid id)
    {
        await _productFacade.DeleteProductAsync(id);
        return NoContent();
    }
}
