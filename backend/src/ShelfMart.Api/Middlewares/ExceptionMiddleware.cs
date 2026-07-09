using System.Net;
using System.Text.Json;
using ShelfMart.Exceptions;

namespace ShelfMart.Api.Middlewares;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;
    private readonly IHostEnvironment _environment;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment environment)
    {
        _next = next;
        _logger = logger;
        _environment = environment;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An exception occurred.");
            await HandleExceptionAsync(context, ex);
        }
    }

    // Known domain exceptions (anything deriving from MessageException) carry messages that
    // are already written to be safe to show a client. Anything else is an unexpected failure
    // (e.g. a raw DB error) whose message may contain internal details (schema, connection
    // strings, stack info) and must never reach the client outside of local development.
    private Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        context.Response.StatusCode = exception switch
        {
            BadRequestResponseException => (int)HttpStatusCode.BadRequest,
            UnauthorizedResponseException => (int)HttpStatusCode.Unauthorized,
            NotFoundResponseException or ResourceNotFoundException => (int)HttpStatusCode.NotFound,
            _ => (int)HttpStatusCode.InternalServerError
        };

        var message = exception is MessageException || _environment.IsDevelopment()
            ? exception.Message
            : "An unexpected error occurred. Please try again later.";

        var response = new
        {
            message,
            statusCode = context.Response.StatusCode
        };

        return context.Response.WriteAsync(JsonSerializer.Serialize(response));
    }
}
