// This file coordinates the validation and storage of product images.
using ShelfMart.DomainService.Interfaces;

namespace ShelfMart.DomainService;

public class ProductImageService : IProductImageService
{
    private readonly IImageStorageService _storage;

    public ProductImageService(IImageStorageService storage)
    {
        _storage = storage;
    }

    // This method checks the file signature and size, then uploads it and returns the public URL.
    public async Task<string> UploadAsync(Stream content, long length, CancellationToken cancellationToken = default)
    {
        if (!_storage.IsConfigured)
        {
            throw new ShelfMart.Exceptions.ServiceUnavailableResponseException("Image storage is not configured on the server.");
        }

        var header = new byte[ImageFileValidator.HeaderLength];
        var read = 0;
        while (read < header.Length)
        {
            var n = await content.ReadAsync(header.AsMemory(read), cancellationToken);
            if (n == 0) break;
            read += n;
        }

        var (extension, contentType) = ImageFileValidator.Detect(length, header.AsSpan(0, read));

        content.Position = 0;
        return await _storage.UploadAsync(content, extension, contentType, cancellationToken);
    }
}

