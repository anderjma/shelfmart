using FluentAssertions;
using Microsoft.Extensions.Caching.Memory;
using ShelfMart.Domain.Entities;
using ShelfMart.DomainService;
using ShelfMart.DomainService.Interfaces;
using ShelfMart.Dto;
using ShelfMart.Exceptions;
using NSubstitute;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace ShelfMart.UnitTests;

public class ProductServiceTests
{
    private readonly IProductRepository _productRepository;
    private readonly ICategoryRepository _categoryRepository;
    private readonly IMemoryCache _cache;
    private readonly ProductService _productService;

    public ProductServiceTests()
    {
        _productRepository = Substitute.For<IProductRepository>();
        _categoryRepository = Substitute.For<ICategoryRepository>();
        _categoryRepository.ExistsByNameAsync(Arg.Any<string>()).Returns(true);
        // A real MemoryCache is used instead of a substitute: IMemoryCache.TryGetValue has an
        // out parameter, which NSubstitute cannot express cleanly. A real cache starts empty,
        // so every test exercises the repository path exactly like a cold cache would.
        _cache = new MemoryCache(new MemoryCacheOptions());
        _productService = new ProductService(_productRepository, _categoryRepository, _cache);
    }

    #region GetProductByIdAsync Tests

    [Fact]
    public async Task GetProductByIdAsync_ShouldThrowResourceNotFoundException_WhenProductDoesNotExist()
    {
        // Arrange
        var id = Guid.NewGuid();
        _productRepository.GetByIdAsync(id).Returns((Product?)null);

        // Act
        Func<Task> act = async () => await _productService.GetProductByIdAsync(id);

        // Assert
        await act.Should().ThrowAsync<ResourceNotFoundException>()
            .WithMessage("Product not found.");
    }

    [Fact]
    public async Task GetProductByIdAsync_ShouldReturnMappedDto_WhenProductExists()
    {
        // Arrange
        var product = new Product
        {
            ProductResourceId = Guid.NewGuid(),
            Name = "Product A",
            Stock = 5,
            Price = 100,
            Category = "Electronics",
            DiscountPercentage = 10
        };
        _productRepository.GetByIdAsync(product.ProductResourceId).Returns(product);

        // Act
        var result = await _productService.GetProductByIdAsync(product.ProductResourceId);

        // Assert
        result.ProductResourceId.Should().Be(product.ProductResourceId);
        result.Name.Should().Be(product.Name);
        result.Stock.Should().Be(product.Stock);
        result.Price.Should().Be(product.Price);
        result.Category.Should().Be(product.Category);
        result.DiscountPercentage.Should().Be(product.DiscountPercentage);
    }

    #endregion

    #region CreateProductAsync Tests

    [Fact]
    public async Task CreateProductAsync_ShouldThrowInvalidCategoryException_WhenCategoryIsWhitespace()
    {
        // Arrange
        var dto = new CreateProductDto { Name = "Product A", Stock = 1, Price = 10, Category = "   " };

        // Act
        Func<Task> act = async () => await _productService.CreateProductAsync(dto);

        // Assert
        await act.Should().ThrowAsync<InvalidCategoryException>();
    }

    [Fact]
    public async Task CreateProductAsync_ShouldThrowInvalidCategoryException_WhenCategoryDoesNotExistInCatalog()
    {
        // Arrange
        var dto = new CreateProductDto { Name = "Product A", Stock = 1, Price = 10, Category = "MadeUpCategory" };
        _categoryRepository.ExistsByNameAsync("MadeUpCategory").Returns(false);

        // Act
        Func<Task> act = async () => await _productService.CreateProductAsync(dto);

        // Assert
        await act.Should().ThrowAsync<InvalidCategoryException>();
    }

    [Fact]
    public async Task CreateProductAsync_ShouldPersistProvidedCategory_WhenCategoryExistsInCatalog()
    {
        // Arrange
        var dto = new CreateProductDto { Name = "Product A", Stock = 1, Price = 10, Category = "Electronics" };
        _categoryRepository.ExistsByNameAsync("Electronics").Returns(true);
        _productRepository.AddAsync(Arg.Any<Product>()).Returns(callInfo => callInfo.Arg<Product>());

        // Act
        var result = await _productService.CreateProductAsync(dto);

        // Assert
        result.Category.Should().Be("Electronics");
    }

    #endregion

    #region UpdateProductAsync Tests

    [Fact]
    public async Task UpdateProductAsync_ShouldThrowResourceNotFoundException_WhenProductDoesNotExist()
    {
        // Arrange
        var id = Guid.NewGuid();
        var dto = new UpdateProductDto { Name = "Updated", Stock = 1, Price = 10, Category = "General" };
        _productRepository.GetByIdAsync(id).Returns((Product?)null);

        // Act
        Func<Task> act = async () => await _productService.UpdateProductAsync(id, dto);

        // Assert
        await act.Should().ThrowAsync<ResourceNotFoundException>()
            .WithMessage("Product not found.");
    }

    [Fact]
    public async Task UpdateProductAsync_ShouldThrowInvalidCategoryException_WhenDtoCategoryIsWhitespace()
    {
        // Arrange
        var product = new Product
        {
            ProductResourceId = Guid.NewGuid(),
            Name = "Product A",
            Stock = 5,
            Price = 100,
            Category = "Electronics"
        };
        var dto = new UpdateProductDto { Name = "Product A Updated", Stock = 5, Price = 100, Category = "   " };
        _productRepository.GetByIdAsync(product.ProductResourceId).Returns(product);

        // Act
        Func<Task> act = async () => await _productService.UpdateProductAsync(product.ProductResourceId, dto);

        // Assert
        await act.Should().ThrowAsync<InvalidCategoryException>();
    }

    [Fact]
    public async Task UpdateProductAsync_ShouldThrowInvalidCategoryException_WhenCategoryDoesNotExistInCatalog()
    {
        // Arrange
        var product = new Product
        {
            ProductResourceId = Guid.NewGuid(),
            Name = "Product A",
            Stock = 5,
            Price = 100,
            Category = "Electronics"
        };
        var dto = new UpdateProductDto { Name = "Product A Updated", Stock = 5, Price = 100, Category = "MadeUpCategory" };
        _productRepository.GetByIdAsync(product.ProductResourceId).Returns(product);
        _categoryRepository.ExistsByNameAsync("MadeUpCategory").Returns(false);

        // Act
        Func<Task> act = async () => await _productService.UpdateProductAsync(product.ProductResourceId, dto);

        // Assert
        await act.Should().ThrowAsync<InvalidCategoryException>();
    }

    #endregion

    #region DeleteProductAsync Tests

    [Fact]
    public async Task DeleteProductAsync_ShouldThrowResourceNotFoundException_WhenProductDoesNotExist()
    {
        // Arrange
        var id = Guid.NewGuid();
        _productRepository.GetByIdAsync(id).Returns((Product?)null);

        // Act
        Func<Task> act = async () => await _productService.DeleteProductAsync(id);

        // Assert
        await act.Should().ThrowAsync<ResourceNotFoundException>()
            .WithMessage("Product not found.");
    }

    [Fact]
    public async Task DeleteProductAsync_ShouldSetIsActiveToFalse_InsteadOfRemoving()
    {
        // Arrange
        var product = new Product { ProductResourceId = Guid.NewGuid(), Name = "Product A", IsActive = true };
        _productRepository.GetByIdAsync(product.ProductResourceId).Returns(product);

        // Act
        await _productService.DeleteProductAsync(product.ProductResourceId);

        // Assert
        product.IsActive.Should().BeFalse();
        await _productRepository.Received(1).UpdateAsync(product);
        await _productRepository.DidNotReceive().DeleteAsync(Arg.Any<Product>());
    }

    #endregion
}
