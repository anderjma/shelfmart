// Este archivo maneja los errores vinculados a la falta de credenciales o permisos insuficientes.
using System;

namespace BusinessSystem.Exceptions;

// Esta clase genera de manera explícita un código HTTP 401 para proteger los endpoints restringidos.
public class UnauthorizedResponseException : MessageException
{
    public UnauthorizedResponseException() : base("Unauthorized access") { }
    public UnauthorizedResponseException(string message) : base(message) { }
}