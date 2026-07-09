using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShelfMart.Dto;
using Microsoft.AspNetCore.RateLimiting;
// This file establishes the REST routes for the comprehensive management of orders and shopping carts.
using ShelfMart.DomainService.Interfaces;
using ShelfMart.Exceptions;
using System.Security.Claims;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace ShelfMart.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
// This controller routes the transactional requests of any authenticated user.
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;
    private readonly IUserRepository _userRepository;
    private readonly IAuditService _auditService;

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
            throw new Exception("The token does not contain a valid identifier.");

        if (Guid.TryParse(claim.Value, out Guid parsedId)) return parsedId;

        var user = await _userRepository.GetByUsernameAsync(claim.Value);
        if (user == null) throw new Exception("The token's user no longer exists in the database.");

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
        catch (MessageException ex) { return BadRequest(new { message = ex.Message }); }
    }

    [HttpPost("cart/items")]
    public async Task<IActionResult> AddToCart([FromBody] AddToCartDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(new { message = "Invalid data sent from the browser." });

        try
        {
            var userId = await GetUserIdAsync();
            var cart = await _orderService.AddItemToCartAsync(userId, dto);
            return Ok(cart);
        }
        catch (MessageException ex) { return BadRequest(new { message = ex.Message }); }
    }

    [HttpPut("cart/items/{productId}")]
    public async Task<IActionResult> UpdateItemQuantity(Guid productId, [FromBody] UpdateCartItemDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(new { message = "Invalid data." });

        try
        {
            var userId = await GetUserIdAsync();
            var cart = await _orderService.UpdateItemQuantityAsync(userId, productId, dto.Quantity);
            return Ok(cart);
        }
        catch (MessageException ex) { return BadRequest(new { message = ex.Message }); }
    }

    [HttpDelete("cart/items/{productId}")]
    public async Task<IActionResult> RemoveItem(Guid productId)
    {
        try
        {
            var userId = await GetUserIdAsync();
            var cart = await _orderService.RemoveItemFromCartAsync(userId, productId);
            return Ok(cart);
        }
        catch (MessageException ex) { return BadRequest(new { message = ex.Message }); }
    }

    [HttpPost("checkout")]
    [EnableRateLimiting("CheckoutPolicy")]
    public async Task<IActionResult> Checkout()
    {
        try 
        {
            var userId = await GetUserIdAsync();
            var result = await _orderService.CheckoutAsync(userId);
            
            var nameClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name || c.Type.Contains("name"));
            string username = nameClaim?.Value ?? "Customer";

            await _auditService.LogActionAsync(username, $"Completed a purchase for ₡{result.TotalAmount.ToString("N2")}");

            return Ok(new { message = "Order processed successfully.", order = result });
        }
        catch (ShelfMart.Exceptions.MessageException ex)
        {
            // Known domain failures (e.g. insufficient stock, empty cart) are safe to surface as-is.
            return BadRequest(new { message = ex.Message });
        }
        // Anything else (e.g. an infrastructure/DB error) is left to propagate to the global
        // exception middleware, which logs it and returns a generic message instead of leaking
        // internal details such as raw database error text to the client.
    }

    // Restricted to administrators: this endpoint exposes every customer's completed orders.
    [Authorize(Roles = "Admin")]
    [HttpGet("all")]
    public async Task<IActionResult> GetAllOrders()
    {
        try
        {
            var orders = await _orderService.GetAllCompletedOrdersAsync();
            return Ok(orders);
        }
        catch (MessageException ex) { return BadRequest(new { message = ex.Message }); }
    }

    // Allows an administrator to move an order to a new status (e.g. Confirmed, Shipped, Delivered, Cancelled).
    [Authorize(Roles = "Admin")]
    [HttpPut("{orderId:guid}/status")]
    public async Task<IActionResult> UpdateOrderStatus(Guid orderId, [FromBody] UpdateOrderStatusDto dto)
    {
        try
        {
            var order = await _orderService.UpdateOrderStatusAsync(orderId, dto.Status);
            return Ok(order);
        }
        catch (MessageException ex) { return BadRequest(new { message = ex.Message }); }
    }

    [HttpGet("my-orders")]
    public async Task<IActionResult> GetMyOrders()
    {
        try
        {
            var userId = await GetUserIdAsync();
            var orders = await _orderService.GetCustomerOrdersAsync(userId);
            return Ok(orders);
        }
        catch (MessageException ex) { return BadRequest(new { message = ex.Message }); }
    }

    // Allows a customer to cancel their own order, but only while it hasn't progressed
    // past the point where fulfillment has started (i.e. still Pending). Restoring stock
    // is handled by the same domain logic the admin cancellation path already uses.
    [HttpPost("{orderId:guid}/cancel")]
    public async Task<IActionResult> CancelMyOrder(Guid orderId)
    {
        try
        {
            var userId = await GetUserIdAsync();
            var order = await _orderService.CancelOwnOrderAsync(userId, orderId);
            return Ok(order);
        }
        catch (MessageException ex) { return BadRequest(new { message = ex.Message }); }
    }
}
