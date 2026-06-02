using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using InventoryBackend.Dto;
using InventoryBackend.DomainService.Interfaces;
using System.Security.Claims;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace InventoryBackend.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;
    private readonly IUserRepository _userRepository;
    private readonly IAuditService _auditService; // <- 1. Inyectamos el servicio

    public OrdersController(IOrderService orderService, IUserRepository userRepository, IAuditService auditService)
    {
        _orderService = orderService;
        _userRepository = userRepository;
        _auditService = auditService;
    }

    private async Task<Guid> GetUserIdAsync()
    {
        var claim = User.Claims.FirstOrDefault(c => 
            c.Type == ClaimTypes.NameIdentifier || 
            c.Type == "id" || 
            c.Type == "UserId" || 
            c.Type.Contains("nameidentifier"));

        if (claim == null || string.IsNullOrWhiteSpace(claim.Value))
            throw new Exception("El token no contiene un identificador válido.");

        if (Guid.TryParse(claim.Value, out Guid parsedId)) return parsedId;

        var user = await _userRepository.GetByUsernameAsync(claim.Value);
        if (user == null) throw new Exception("El usuario del token ya no existe en la base de datos.");

        return user.UserId;
    }

    [HttpGet("cart")]
    public async Task<IActionResult> GetCart()
    {
        try 
        {
            var userId = await GetUserIdAsync();
            var cart = await _orderService.GetCartAsync(userId);
            return Ok(cart);
        }
        catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
    }

    [HttpPost("cart/items")]
    public async Task<IActionResult> AddToCart([FromBody] AddToCartDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(new { message = "Datos inválidos enviados desde el navegador." });

        try 
        {
            var userId = await GetUserIdAsync();
            var cart = await _orderService.AddItemToCartAsync(userId, dto);
            return Ok(cart);
        }
        catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
    }

    [HttpPost("checkout")]
    public async Task<IActionResult> Checkout()
    {
        try 
        {
            var userId = await GetUserIdAsync();
            var result = await _orderService.CheckoutAsync(userId);
            
            // 2. Extraemos el nombre de usuario del token (o asignamos "Cliente" por defecto)
            var nameClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name || c.Type.Contains("name"));
            string username = nameClaim?.Value ?? "Cliente";

            // 3. ¡AQUÍ ESCRIBIMOS EN LA BITÁCORA!
            await _auditService.LogActionAsync(username, $"Finalizó una compra por ₡{result.TotalAmount.ToString("N2")}");

            return Ok(new { message = "Orden procesada exitosamente.", order = result });
        }
        catch (Exception ex)
        {
            var inner = ex.InnerException != null ? " | DB Error: " + ex.InnerException.Message : "";
            return BadRequest(new { message = ex.Message + inner });
        }
    }

    [HttpGet("all")]
    public async Task<IActionResult> GetAllOrders()
    {
        try 
        {
            var orders = await _orderService.GetAllCompletedOrdersAsync();
            return Ok(orders);
        }
        catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
    }
}
