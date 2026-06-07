using FluentAssertions;
using BusinessSystem.Domain.Entities;
using BusinessSystem.DomainService;
using BusinessSystem.DomainService.Interfaces;
using BusinessSystem.Dto;
using BusinessSystem.Exceptions;
using NSubstitute;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace BusinessSystem.UnitTests;

public class OrderServiceTests
{
    private readonly IOrderRepository _orderRepository;
    private readonly IProductRepository _productRepository;
    private readonly OrderService _orderService;

    public OrderServiceTests()
    {
        _orderRepository = Substitute.For<IOrderRepository>();
        _productRepository = Substitute.For<IProductRepository>();
        _orderService = new OrderService(_orderRepository, _productRepository);
    }

    #region AddItemToCartAsync Tests

    [Fact]
    public async Task AddItemToCartAsync_ShouldThrowNotFoundResponseException_WhenProductDoesNotExist()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var dto = new AddToCartDto { ProductId = Guid.NewGuid(), Quantity = 2 };
        _productRepository.GetByIdAsync(dto.ProductId).Returns((Product?)null);

        // Act
        Func<Task> act = async () => await _orderService.AddItemToCartAsync(userId, dto);

        // Assert
        await act.Should().ThrowAsync<NotFoundResponseException>()
            .WithMessage("Producto no encontrado.");
    }

    [Fact]
    public async Task AddItemToCartAsync_ShouldCreateNewCart_WhenNoActiveCartExists()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var product = new Product
        {
            ProductResourceId = Guid.NewGuid(),
            Name = "Producto A",
            Price = 100,
            Stock = 10
        };
        var dto = new AddToCartDto { ProductId = product.ProductResourceId, Quantity = 2 };

        _productRepository.GetByIdAsync(product.ProductResourceId).Returns(product);
        _orderRepository.GetActiveCartByUserIdAsync(userId).Returns((Order?)null);

        // Act
        var result = await _orderService.AddItemToCartAsync(userId, dto);

        // Assert
        result.Should().NotBeNull();
        result.TotalAmount.Should().Be(200);
        result.Items.Should().HaveCount(1);
        result.Items[0].ProductId.Should().Be(product.ProductResourceId);
        result.Items[0].Quantity.Should().Be(2);

        await _orderRepository.Received(1).CreateOrderAsync(Arg.Is<Order>(o =>
            o.UserResourceId == userId &&
            o.TotalAmount == 200 &&
            o.OrderItems.Count == 1 &&
            o.OrderItems.First().ProductResourceId == product.ProductResourceId &&
            o.OrderItems.First().Quantity == 2
        ));
    }

    [Fact]
    public async Task AddItemToCartAsync_ShouldUpdateQuantity_WhenActiveCartExistsAndItemIsAdded()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var product = new Product
        {
            ProductResourceId = Guid.NewGuid(),
            Name = "Producto A",
            Price = 100,
            Stock = 10
        };
        var dto = new AddToCartDto { ProductId = product.ProductResourceId, Quantity = 3 };

        var existingCart = new Order
        {
            UserResourceId = userId,
            OrderItems = new List<OrderItem>
            {
                new OrderItem
                {
                    ProductResourceId = product.ProductResourceId,
                    Product = product,
                    Quantity = 2,
                    UnitPrice = 100
                }
            },
            TotalAmount = 200
        };

        _productRepository.GetByIdAsync(product.ProductResourceId).Returns(product);
        _orderRepository.GetActiveCartByUserIdAsync(userId).Returns(existingCart);

        // Act
        var result = await _orderService.AddItemToCartAsync(userId, dto);

        // Assert
        result.Should().NotBeNull();
        result.TotalAmount.Should().Be(500); // (2 + 3) * 100
        result.Items.Should().HaveCount(1);
        result.Items[0].Quantity.Should().Be(5);

        await _orderRepository.Received(1).UpdateOrderAsync(existingCart);
    }

    #endregion

    #region CheckoutAsync Tests

    [Fact]
    public async Task CheckoutAsync_ShouldThrowBadRequestResponseException_WhenCartIsEmptyOrNull()
    {
        // Arrange
        var userId = Guid.NewGuid();
        _orderRepository.GetActiveCartByUserIdAsync(userId).Returns((Order?)null);

        // Act
        Func<Task> act = async () => await _orderService.CheckoutAsync(userId);

        // Assert
        await act.Should().ThrowAsync<BadRequestResponseException>()
            .WithMessage("El carrito está vacío.");
    }

    [Fact]
    public async Task CheckoutAsync_ShouldThrowNotFoundResponseException_WhenProductInCartDoesNotExist()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var productId = Guid.NewGuid();
        var cart = new Order
        {
            UserResourceId = userId,
            OrderItems = new List<OrderItem>
            {
                new OrderItem { ProductResourceId = productId, Quantity = 2 }
            }
        };

        _orderRepository.GetActiveCartByUserIdAsync(userId).Returns(cart);
        _productRepository.GetByIdAsync(productId).Returns((Product?)null);

        // Act
        Func<Task> act = async () => await _orderService.CheckoutAsync(userId);

        // Assert
        await act.Should().ThrowAsync<NotFoundResponseException>()
            .WithMessage("Producto no existe.");
    }

    [Fact]
    public async Task CheckoutAsync_ShouldThrowBadRequestResponseException_WhenStockIsInsufficient()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var product = new Product
        {
            ProductResourceId = Guid.NewGuid(),
            Name = "Producto A",
            Price = 100,
            Stock = 1 // Solo 1 disponible
        };
        var cart = new Order
        {
            UserResourceId = userId,
            OrderItems = new List<OrderItem>
            {
                new OrderItem
                {
                    ProductResourceId = product.ProductResourceId,
                    Quantity = 2, // Solicita 2
                    UnitPrice = 100
                }
            }
        };

        _orderRepository.GetActiveCartByUserIdAsync(userId).Returns(cart);
        _productRepository.GetByIdAsync(product.ProductResourceId).Returns(product);

        // Act
        Func<Task> act = async () => await _orderService.CheckoutAsync(userId);

        // Assert
        await act.Should().ThrowAsync<BadRequestResponseException>()
            .WithMessage("Stock insuficiente.");
    }

    [Fact]
    public async Task CheckoutAsync_ShouldCompleteCheckout_WhenStockIsSufficient()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var product = new Product
        {
            ProductResourceId = Guid.NewGuid(),
            Name = "Producto A",
            Price = 100,
            Stock = 10
        };
        var cart = new Order
        {
            UserResourceId = userId,
            OrderItems = new List<OrderItem>
            {
                new OrderItem
                {
                    ProductResourceId = product.ProductResourceId,
                    Quantity = 3,
                    UnitPrice = 100
                }
            },
            TotalAmount = 300,
            Status = "Cart"
        };

        _orderRepository.GetActiveCartByUserIdAsync(userId).Returns(cart);
        _productRepository.GetByIdAsync(product.ProductResourceId).Returns(product);

        // Act
        var result = await _orderService.CheckoutAsync(userId);

        // Assert
        result.Should().NotBeNull();
        product.Stock.Should().Be(7); // Reducido de 10 a 7
        cart.Status.Should().Be("Completed");
        cart.CreatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(5));

        await _orderRepository.Received(1).UpdateOrderAsync(cart);
    }

    #endregion
}
