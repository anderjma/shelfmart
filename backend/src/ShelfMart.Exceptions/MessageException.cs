namespace ShelfMart.Exceptions;

// This abstract class allows error messages to be carried in a structured way to the global middleware.
public abstract class MessageException : Exception
{
    protected MessageException(string message) : base(message) { }
    protected MessageException(string message, // This file defines the base exception from which business validation errors inherit.
        Exception innerException) : base(message, innerException) { }
}