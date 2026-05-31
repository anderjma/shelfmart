namespace InventoryBackend.Exceptions;

public class ResourceNotFoundException : MessageException
{
    public ResourceNotFoundException() : base("Resource not found") { }
    public ResourceNotFoundException(string message) : base(message) { }
}