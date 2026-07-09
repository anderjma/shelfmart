// This file groups multiple transfer models designed to operate on carts and orders.
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ShelfMart.Dto;

// This class carries the identifier and quantity of the product to be added to an order.
public class AddToCartDto
{
    public Guid ProductId { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "Quantity must be greater than zero.")]
    public int Quantity { get; set; }
}

// This class individually breaks down a purchase line within the cart detail.
public class CartItemDto
{
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal SubTotal => Quantity * UnitPrice;
}

// This class summarizes the current financial state and components of an in-progress order.
public class CartDto
{
    public Guid OrderId { get; set; }
    public decimal TotalAmount { get; set; }
    public List<CartItemDto> Items { get; set; } = new();
}

// This class carries the updated quantity for a cart item.
public class UpdateCartItemDto
{
    [Range(1, int.MaxValue, ErrorMessage = "Quantity must be greater than zero.")]
    public int Quantity { get; set; }
}

