// Este archivo agrupa múltiples modelos de transferencia diseñados para operar sobre carritos y pedidos.
using System;
using System.Collections.Generic;

namespace BusinessSystem.Dto;

// Esta clase transporta el identificador y cantidad del producto a añadir en una orden.
public class AddToCartDto
{
    public Guid ProductId { get; set; }
    public int Quantity { get; set; }
}

// Esta clase desglosa de manera individual un renglón de compra dentro del detalle del carrito.
public class CartItemDto
{
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal SubTotal => Quantity * UnitPrice;
}

// Esta clase resume el estado financiero actual y los componentes de una orden en progreso.
public class CartDto
{
    public Guid OrderId { get; set; }
    public decimal TotalAmount { get; set; }
    public List<CartItemDto> Items { get; set; } = new();
}

// Esta clase transporta la cantidad actualizada para un ítem del carrito.
public class UpdateCartItemDto
{
    public int Quantity { get; set; }
}

