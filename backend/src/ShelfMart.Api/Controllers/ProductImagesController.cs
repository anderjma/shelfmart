// This file exposes the endpoint used by the admin panel to upload product images from the local device.
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShelfMart.DomainService;
using ShelfMart.Exceptions;
using ShelfMart.Facade.Interfaces;
using System.Threading;
using System.Threading.Tasks;

namespace ShelfMart.Api.Controllers;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/product-images")]
public class ProductImagesController : ControllerBase
{
    private readonly IProductImageFacade _imageFacade;

    public ProductImagesController(IProductImageFacade imageFacade)
    {
        _imageFacade = imageFacade;
    }

    // This method receives a multipart file, validates it by content and returns the stored image's public URL.
    [HttpPost]
    [RequestSizeLimit(ImageFileValidator.MaxBytes + 64 * 1024)]
    public async Task<IActionResult> Upload(IFormFile? file, CancellationToken cancellationToken)
    {
        if (file == null)
        {
            throw new BadRequestResponseException("An image file is required.");
        }

        await using var stream = file.OpenReadStream();
        var url = await _imageFacade.UploadAsync(stream, file.Length, cancellationToken);
        return Ok(new { url });
    }
}

