// This file defines the endpoints for controlling and modifying the inventory catalog.
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShelfMart.Dto;
using ShelfMart.Facade.Interfaces;
using System;
using System.Threading.Tasks;

namespace ShelfMart.Api.Controllers;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/[controller]")]
// This controller requires administrative privileges to make changes to product prices or information.
public class ProductsController : ControllerBase
{
    private readonly IProductFacade _productFacade;

    public ProductsController(IProductFacade productFacade)
    {
        _productFacade = productFacade;
    }

    // This attribute allows any user to view the product catalog without authentication.
    [AllowAnonymous]
    [HttpGet]
    // This method returns the complete or paginated inventory, enabling its reading by the store and the management panel.
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

    // This attribute allows any user to view a specific product without authentication.
    [AllowAnonymous]
    [HttpGet("{id:guid}")]
    // This method dispatches the detailed information of a specific product, first validating that it exists.
    public async Task<IActionResult> GetById(Guid id)
    {
        var product = await _productFacade.GetProductByIdAsync(id);
        return Ok(product);
    }

    // The following routes remain protected by the class's global authorization attribute.
    [HttpPost]
    // This method handles creation requests to add new items to the available catalog.
    public async Task<IActionResult> Create([FromBody] CreateProductDto request)
    {
        var created = await _productFacade.CreateProductAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = created.ProductResourceId }, created);
    }

    [HttpPut("{id:guid}")]
    // This method accepts a replacement request to modify characteristics such as a product's price or inventory.
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateProductDto request)
    {
        var updated = await _productFacade.UpdateProductAsync(id, request);
        return Ok(updated);
    }

    [HttpDelete("{id:guid}")]
    // This method executes the deletion order to remove a product that is no longer offered from the system.
    public async Task<IActionResult> Delete(Guid id)
    {
        await _productFacade.DeleteProductAsync(id);
        return NoContent();
    }
}
