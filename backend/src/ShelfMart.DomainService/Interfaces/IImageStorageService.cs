// This file defines the contract for the external object storage that hosts product images.
namespace ShelfMart.DomainService.Interfaces;

public interface IImageStorageService
{
    // Indicates whether the storage credentials are present, so callers can fail with a clear message.
    bool IsConfigured { get; }

    // Stores the file and returns its public URL.
    Task<string> UploadAsync(Stream content, string extension, string contentType, CancellationToken cancellationToken = default);
}

