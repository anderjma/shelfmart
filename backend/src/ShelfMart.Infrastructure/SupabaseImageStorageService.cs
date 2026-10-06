// This file stores product images in a Supabase Storage bucket using the server-side service key.
using System.Net.Http.Headers;
using ShelfMart.DomainService.Interfaces;

namespace ShelfMart.Infrastructure;

public class SupabaseImageStorageService : IImageStorageService
{
    private readonly HttpClient _http;
    private readonly string? _baseUrl;
    private readonly string? _serviceKey;
    private readonly string _bucket;

    public SupabaseImageStorageService(HttpClient http, string? baseUrl, string? serviceKey, string bucket)
    {
        _http = http;
        _baseUrl = baseUrl?.TrimEnd('/');
        _serviceKey = serviceKey;
        _bucket = bucket;
    }

    public bool IsConfigured => !string.IsNullOrWhiteSpace(_baseUrl) && !string.IsNullOrWhiteSpace(_serviceKey);

    // The key never leaves the server: the browser only sends the file to our API.
    public async Task<string> UploadAsync(Stream content, string extension, string contentType, CancellationToken cancellationToken = default)
    {
        var objectPath = $"products/{Guid.NewGuid():N}{extension}";

        using var request = new HttpRequestMessage(HttpMethod.Post, $"{_baseUrl}/storage/v1/object/{_bucket}/{objectPath}");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _serviceKey);
        request.Headers.Add("apikey", _serviceKey);
        request.Headers.Add("x-upsert", "false");
        request.Content = new StreamContent(content);
        request.Content.Headers.ContentType = new MediaTypeHeaderValue(contentType);

        using var response = await _http.SendAsync(request, cancellationToken);
        if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
        {
            await EnsureBucketExistsAsync(cancellationToken);

            content.Position = 0;
            using var retry = new HttpRequestMessage(HttpMethod.Post, $"{_baseUrl}/storage/v1/object/{_bucket}/{objectPath}");
            retry.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _serviceKey);
            retry.Headers.Add("apikey", _serviceKey);
            retry.Headers.Add("x-upsert", "false");
            retry.Content = new StreamContent(content);
            retry.Content.Headers.ContentType = new MediaTypeHeaderValue(contentType);

            using var retryResponse = await _http.SendAsync(retry, cancellationToken);
            if (!retryResponse.IsSuccessStatusCode)
            {
                var body = await retryResponse.Content.ReadAsStringAsync(cancellationToken);
                throw new InvalidOperationException($"Image upload failed ({(int)retryResponse.StatusCode}): {body}");
            }
        }
        else if (!response.IsSuccessStatusCode)
        {
            var body = await response.Content.ReadAsStringAsync(cancellationToken);
            throw new InvalidOperationException($"Image upload failed ({(int)response.StatusCode}): {body}");
        }

        return $"{_baseUrl}/storage/v1/object/public/{_bucket}/{objectPath}";
    }

    private async Task EnsureBucketExistsAsync(CancellationToken cancellationToken)
    {
        try
        {
            using var req = new HttpRequestMessage(HttpMethod.Post, $"{_baseUrl}/storage/v1/bucket");
            req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _serviceKey);
            req.Headers.Add("apikey", _serviceKey);
            req.Content = new StringContent(
                $"{{\"id\":\"{_bucket}\",\"name\":\"{_bucket}\",\"public\":true}}",
                System.Text.Encoding.UTF8,
                "application/json");
            await _http.SendAsync(req, cancellationToken);
        }
        catch
        {
            // Ignore if creation fails or already exists
        }
    }
}

