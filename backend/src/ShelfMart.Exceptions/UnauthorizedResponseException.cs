// This file handles errors related to missing credentials or insufficient permissions.
using System;

namespace ShelfMart.Exceptions;

// This class explicitly generates an HTTP 401 code to protect restricted endpoints.
public class UnauthorizedResponseException : MessageException
{
    public UnauthorizedResponseException() : base("Unauthorized access") { }
    public UnauthorizedResponseException(string message) : base(message) { }
}