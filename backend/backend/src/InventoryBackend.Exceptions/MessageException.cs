namespace InventoryBackend.Exceptions;

public abstract class MessageException : Exception
{
    protected MessageException(string message) : base(message) { }
    protected MessageException(string message, Exception innerException) : base(message, innerException) { }
}