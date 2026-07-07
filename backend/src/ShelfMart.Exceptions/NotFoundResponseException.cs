// This file handles errors that occur when a nonexistent resource is requested.
using System;

namespace ShelfMart.Exceptions;

// This class translates the absence of a database record into a standardized HTTP 404 response.
public class NotFoundResponseException : MessageException
{
    public NotFoundResponseException(string message) : base(message)
    {
    }
}
