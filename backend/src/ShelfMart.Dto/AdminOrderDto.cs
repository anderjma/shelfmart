// This file presents an order breakdown designed specifically for the administrative interface.
using System;
using System.Collections.Generic;

namespace ShelfMart.Dto;

// This class includes additional sensitive order information, such as the buyer's username.
public class AdminOrderDto
{
    public Guid OrderId { get; set; }
    public string CustomerUsername { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = string.Empty;
    public List<CartItemDto> Items { get; set; } = new();
}
