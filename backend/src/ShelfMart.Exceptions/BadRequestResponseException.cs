// This file defines custom exceptions for Bad Request (400) errors caused by the client.
namespace ShelfMart.Exceptions;

// This class represents an HTTP 400 error when validations or business requirements are not met.
public class BadRequestResponseException : MessageException
{
    public BadRequestResponseException() : base("Invalid request") { }
    public BadRequestResponseException(string message) : base(message) { }
}