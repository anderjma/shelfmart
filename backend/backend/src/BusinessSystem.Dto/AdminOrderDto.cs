// Este archivo presenta un desglose de pedidos diseñado específicamente para la interfaz administrativa.
using System;
using System.Collections.Generic;

namespace BusinessSystem.Dto;

// Esta clase incluye información sensible adicional de la orden, como el nombre de usuario del comprador.
public class AdminOrderDto
{
    public Guid OrderId { get; set; }
    public string CustomerUsername { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = string.Empty;
    public List<CartItemDto> Items { get; set; } = new();
}
