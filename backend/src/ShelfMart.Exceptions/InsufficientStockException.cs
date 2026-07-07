namespace ShelfMart.Exceptions;

// This class represents an HTTP 400 error when a stock movement would result in negative inventory.
public class InsufficientStockException : BadRequestResponseException
{
    public InsufficientStockException() : base("Insufficient stock.") { }
    public InsufficientStockException(string message) : base(message) { }
}
