// This file validates uploaded images by their real content instead of trusting client-provided metadata.
using ShelfMart.Exceptions;

namespace ShelfMart.DomainService;

public static class ImageFileValidator
{
    public const long MaxBytes = 5 * 1024 * 1024;

    // Number of leading bytes needed to recognize every supported format.
    public const int HeaderLength = 12;

    // The file extension and content type are derived from the magic bytes, so a renamed
    // executable or an SVG (which can carry scripts) is rejected even with an image/* header.
    public static (string Extension, string ContentType) Detect(long length, ReadOnlySpan<byte> header)
    {
        if (length <= 0)
        {
            throw new BadRequestResponseException("The image file is empty.");
        }

        if (length > MaxBytes)
        {
            throw new BadRequestResponseException("The image must be 5 MB or smaller.");
        }

        if (header.Length >= 3 && header[0] == 0xFF && header[1] == 0xD8 && header[2] == 0xFF)
        {
            return (".jpg", "image/jpeg");
        }

        if (header.Length >= 8 && header[..8].SequenceEqual(new byte[] { 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A }))
        {
            return (".png", "image/png");
        }

        if (header.Length >= 12
            && header[..4].SequenceEqual("RIFF"u8)
            && header[8..12].SequenceEqual("WEBP"u8))
        {
            return (".webp", "image/webp");
        }

        throw new BadRequestResponseException("Only JPEG, PNG or WebP images are allowed.");
    }
}

