// Este archivo gestiona los errores que ocurren cuando se solicita un recurso inexistente.
using System;

namespace BusinessSystem.Exceptions;

// Esta clase traduce la ausencia de un registro de base de datos en una respuesta HTTP 404 estandarizada.
public class NotFoundResponseException : MessageException
{
    public NotFoundResponseException(string message) : base(message)
    {
    }
}
