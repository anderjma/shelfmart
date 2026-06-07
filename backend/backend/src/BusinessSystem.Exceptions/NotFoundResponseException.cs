using System;

namespace BusinessSystem.Exceptions;

public class NotFoundResponseException : Exception
{
    public NotFoundResponseException(string message) : base(message)
    {
    }
}
