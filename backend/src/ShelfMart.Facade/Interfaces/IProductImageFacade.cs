// This file defines the facade design pattern applied to product image uploads.
namespace ShelfMart.Facade.Interfaces;

public interface IProductImageFacade
{
    Task<string> UploadAsync(Stream content, long length, CancellationToken cancellationToken = default);
}

