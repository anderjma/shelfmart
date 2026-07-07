namespace ShelfMart.Exceptions;

// This class represents an HTTP 400 error when a category fails domain validation.
public class InvalidCategoryException : BadRequestResponseException
{
    public InvalidCategoryException() : base("Invalid category.") { }
    public InvalidCategoryException(string message) : base(message) { }
}
