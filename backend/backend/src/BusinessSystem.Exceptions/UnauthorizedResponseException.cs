namespace BusinessSystem.Exceptions;

public class UnauthorizedResponseException : MessageException
{
    public UnauthorizedResponseException() : base("Unauthorized access") { }
    public UnauthorizedResponseException(string message) : base(message) { }
}