// This file simplifies product image uploads so they can be consumed by the controllers.
using ShelfMart.DomainService.Interfaces;
using ShelfMart.Facade.Interfaces;

namespace ShelfMart.Facade;

public class ProductImageFacade : IProductImageFacade
{
    private readonly IProductImageService _imageService;

    public ProductImageFacade(IProductImageService imageService)
    {
        _imageService = imageService;
    }

    public Task<string> UploadAsync(Stream content, long length, CancellationToken cancellationToken = default)
    {
        return _imageService.UploadAsync(content, length, cancellationToken);
    }
}

