using NSubstitute;
using ShelfMart.DomainService;
using ShelfMart.DomainService.Interfaces;
using ShelfMart.Exceptions;
using Xunit;

namespace ShelfMart.UnitTests;

public class ProductImageServiceTests
{
    private static readonly byte[] Jpeg = { 0xFF, 0xD8, 0xFF, 0xE0, 0, 0, 0, 0, 0, 0, 0, 0 };
    private static readonly byte[] Png = { 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0, 0, 0, 0 };
    private static readonly byte[] Webp = { (byte)'R', (byte)'I', (byte)'F', (byte)'F', 0, 0, 0, 0, (byte)'W', (byte)'E', (byte)'B', (byte)'P' };

    private readonly IImageStorageService _storage = Substitute.For<IImageStorageService>();
    private readonly ProductImageService _service;

    public ProductImageServiceTests()
    {
        _storage.IsConfigured.Returns(true);
        _storage.UploadAsync(Arg.Any<Stream>(), Arg.Any<string>(), Arg.Any<string>(), Arg.Any<CancellationToken>())
            .Returns("https://example.supabase.co/storage/v1/object/public/product-images/products/x.jpg");
        _service = new ProductImageService(_storage);
    }

    [Theory]
    [InlineData(0xFF, ".jpg", "image/jpeg")]
    [InlineData(0x89, ".png", "image/png")]
    [InlineData(0x52, ".webp", "image/webp")]
    public async Task UploadAsync_ShouldStoreSupportedImages_UsingDetectedType(int firstByte, string extension, string contentType)
    {
        var bytes = firstByte switch { 0xFF => Jpeg, 0x89 => Png, _ => Webp };

        var url = await _service.UploadAsync(new MemoryStream(bytes), bytes.Length);

        Assert.StartsWith("https://", url);
        await _storage.Received(1).UploadAsync(Arg.Any<Stream>(), extension, contentType, Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task UploadAsync_ShouldRejectFilesWithUnsupportedSignature()
    {
        var svg = System.Text.Encoding.UTF8.GetBytes("<svg onload=alert(1)></svg>");

        await Assert.ThrowsAsync<BadRequestResponseException>(() => _service.UploadAsync(new MemoryStream(svg), svg.Length));
        await _storage.DidNotReceiveWithAnyArgs().UploadAsync(default!, default!, default!, default);
    }

    [Fact]
    public async Task UploadAsync_ShouldRejectOversizedFiles()
    {
        await Assert.ThrowsAsync<BadRequestResponseException>(
            () => _service.UploadAsync(new MemoryStream(Jpeg), ImageFileValidator.MaxBytes + 1));
    }

    [Fact]
    public async Task UploadAsync_ShouldRejectEmptyFiles()
    {
        await Assert.ThrowsAsync<BadRequestResponseException>(() => _service.UploadAsync(new MemoryStream(), 0));
    }

    [Fact]
    public async Task UploadAsync_ShouldThrowServiceUnavailable_WhenStorageIsNotConfigured()
    {
        _storage.IsConfigured.Returns(false);

        await Assert.ThrowsAsync<ServiceUnavailableResponseException>(() => _service.UploadAsync(new MemoryStream(Jpeg), Jpeg.Length));
    }
}

