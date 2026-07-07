// This file defines the exception thrown when the requested records are not found in the database.
using System;

namespace ShelfMart.Exceptions;

// This class represents a standardized HTTP 404 error for the application.
public class ResourceNotFoundException : MessageException
{
    public ResourceNotFoundException() : base("Resource not found") { }
    public ResourceNotFoundException(string message) : base(message) { }
}