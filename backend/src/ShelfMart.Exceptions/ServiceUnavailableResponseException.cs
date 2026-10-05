// This file defines custom exceptions for Service Unavailable (503) errors caused by missing infrastructure.
namespace ShelfMart.Exceptions;

// This class represents an HTTP 503 error when an external dependency is not configured or reachable.
public class ServiceUnavailableResponseException : MessageException
{
    public ServiceUnavailableResponseException() : base("Service unavailable") { }
    public ServiceUnavailableResponseException(string message) : base(message) { }
}

