namespace BusinessSystem.Exceptions;

// Esta clase abstracta permite transportar de manera estructurada los mensajes de error hacia el middleware global.
public abstract class MessageException : Exception
{
    protected MessageException(string message) : base(message) { }
    protected MessageException(string message, // Este archivo define la excepción base a partir de la cual heredan los errores de validación de negocio.
        Exception innerException) : base(message, innerException) { }
}