namespace ShelfMart.Domain.Enums;

// This enum represents the lifecycle states of an order, from an active cart to its final resolution.
public enum OrderStatus
{
    Cart = 0,
    Pending = 1,
    Confirmed = 2,
    Shipped = 3,
    Delivered = 4,
    Cancelled = 5
}
