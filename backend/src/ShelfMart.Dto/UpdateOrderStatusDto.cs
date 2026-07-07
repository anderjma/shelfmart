// This file carries the requested status transition for an order.
using ShelfMart.Domain.Enums;

namespace ShelfMart.Dto;

public class UpdateOrderStatusDto
{
    public OrderStatus Status { get; set; }
}
