using System;
using System.Collections.Generic;

namespace BusinessSystem.Dto;

public class AdminOrderDto
{
    public Guid OrderId { get; set; }
    public string CustomerUsername { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = string.Empty;
    public List<CartItemDto> Items { get; set; } = new();
}
