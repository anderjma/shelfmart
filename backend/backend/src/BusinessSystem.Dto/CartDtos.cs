using System;
using System.Collections.Generic;

namespace BusinessSystem.Dto;

public class AddToCartDto
{
    public Guid ProductId { get; set; }
    public int Quantity { get; set; }
}

public class CartItemDto
{
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal SubTotal => Quantity * UnitPrice;
}

public class CartDto
{
    public Guid OrderId { get; set; }
    public decimal TotalAmount { get; set; }
    public List<CartItemDto> Items { get; set; } = new();
}
