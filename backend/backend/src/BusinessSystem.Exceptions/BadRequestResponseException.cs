// Este archivo define excepciones personalizadas para errores de tipo Bad Request (400) causados por el cliente.
namespace BusinessSystem.Exceptions;

// Esta clase representa un error HTTP 400 cuando las validaciones o requerimientos de negocio no se cumplen.
public class BadRequestResponseException : MessageException
{
    public BadRequestResponseException() : base("Invalid request") { }
    public BadRequestResponseException(string message) : base(message) { }
}