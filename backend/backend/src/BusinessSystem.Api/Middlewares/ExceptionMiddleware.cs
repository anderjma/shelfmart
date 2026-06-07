using System.Net;
using System.Text.Json;
using BusinessSystem.Exceptions;

namespace BusinessSystem.Api.Middlewares;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ocurrió una excepción.");
            await HandleExceptionAsync(context, ex);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        context.Response.StatusCode = exception switch
        {
            BadRequestResponseException => (int)HttpStatusCode.BadRequest,
            UnauthorizedResponseException => (int)HttpStatusCode.Unauthorized,
            ResourceNotFoundException => (int)HttpStatusCode.NotFound,
            _ => (int)HttpStatusCode.InternalServerError
        };

        var response = new
        {
            message = exception.Message,
            statusCode = context.Response.StatusCode
        };

        return context.Response.WriteAsync(JsonSerializer.Serialize(response));
    }
}
