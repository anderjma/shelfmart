using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using InventoryBackend.Dto;
using InventoryBackend.DomainService.Interfaces;
using System.Security.Claims;
using System;
using System.Threading.Tasks;

namespace InventoryBackend.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    private Guid GetUserId()
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.Parse(userIdString!);
    }

    [HttpGet("cart")]
    public async Task<IActionResult> GetCart()
    {
        var cart = await _orderService.GetCartAsync(GetUserId());
        return Ok(cart);
    }

    [HttpPost("cart/items")]
    public async Task<IActionResult> AddToCart([FromBody] AddToCartDto dto)
    {
        try 
        {
            var cart = await _orderService.AddItemToCartAsync(GetUserId(), dto);
            return Ok(cart);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("checkout")]
    public async Task<IActionResult> Checkout()
    {
        try 
        {
            var result = await _orderService.CheckoutAsync(GetUserId());
            return Ok(new { message = "Orden procesada exitosamente.", order = result });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
