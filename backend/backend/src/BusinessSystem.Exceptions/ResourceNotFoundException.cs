// Este archivo define la excepción lanzada cuando no se encuentran los registros solicitados en la base de datos.
using System;

namespace BusinessSystem.Exceptions;

// Esta clase representa un error HTTP 404 estandarizado para la aplicación.
public class ResourceNotFoundException : MessageException
{
    public ResourceNotFoundException() : base("Resource not found") { }
    public ResourceNotFoundException(string message) : base(message) { }
}