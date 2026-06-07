namespace BusinessSystem.Exceptions;

public class BadRequestResponseException : MessageException
{
    public BadRequestResponseException() : base("Invalid request") { }
    public BadRequestResponseException(string message) : base(message) { }
}