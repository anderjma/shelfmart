// This file defines the business contract for validating and storing product images.
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace ShelfMart.DomainService.Interfaces;

public interface IProductImageService
{
    Task<string> UploadAsync(Stream content, long length, CancellationToken cancellationToken = default);
}

