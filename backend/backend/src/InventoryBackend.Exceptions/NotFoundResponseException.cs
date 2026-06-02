using System;

namespace InventoryBackend.Exceptions;

public class NotFoundResponseException : Exception
{
    public NotFoundResponseException(string message) : base(message)
    {
    }
}
