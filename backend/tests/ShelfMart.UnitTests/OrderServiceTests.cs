using FluentAssertions;
using ShelfMart.Domain.Entities;
using ShelfMart.Domain.Enums;
using ShelfMart.DomainService;
using ShelfMart.DomainService.Interfaces;
using ShelfMart.Dto;
using ShelfMart.Exceptions;
using NSubstitute;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace ShelfMart.UnitTests;

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

        // CheckoutAsync wraps its body in ExecuteInTransactionAsync; the substitute must invoke
        // the delegate it receives so tests exercise the real logic instead of getting a default value.
        _orderRepository.ExecuteInTransactionAsync(Arg.Any<Func<Task<CartDto>>>())
            .Returns(callInfo => callInfo.Arg<Func<Task<CartDto>>>()());
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
            .WithMessage("Product not found.");
    }

    [Fact]
    public async Task AddItemToCartAsync_ShouldCreateNewCart_WhenNoActiveCartExists()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var product = new Product
        {
            ProductResourceId = Guid.NewGuid(),
            Name = "Product A",
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
            Name = "Product A",
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

    #region UpdateItemQuantityAsync Tests

    [Fact]
    public async Task UpdateItemQuantityAsync_ShouldThrowInsufficientStockException_WhenStockIsInsufficient()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var product = new Product { ProductResourceId = Guid.NewGuid(), Name = "Product A", Price = 100, Stock = 2 };
        var cart = new Order
        {
            UserResourceId = userId,
            OrderItems = new List<OrderItem>
            {
                new OrderItem { ProductResourceId = product.ProductResourceId, Quantity = 1, UnitPrice = 100 }
            }
        };

        _orderRepository.GetActiveCartByUserIdAsync(userId).Returns(cart);
        _productRepository.GetByIdAsync(product.ProductResourceId).Returns(product);

        // Act
        Func<Task> act = async () => await _orderService.UpdateItemQuantityAsync(userId, product.ProductResourceId, 5);

        // Assert
        await act.Should().ThrowAsync<InsufficientStockException>()
            .WithMessage("Insufficient stock. Available stock: 2");
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
            .WithMessage("The cart is empty.");
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
            .WithMessage("Product does not exist.");
    }

    [Fact]
    public async Task CheckoutAsync_ShouldThrowInsufficientStockException_WhenStockIsInsufficient()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var product = new Product
        {
            ProductResourceId = Guid.NewGuid(),
            Name = "Product A",
            Price = 100,
            Stock = 1 // Only 1 available
        };
        var cart = new Order
        {
            UserResourceId = userId,
            OrderItems = new List<OrderItem>
            {
                new OrderItem
                {
                    ProductResourceId = product.ProductResourceId,
                    Quantity = 2, // Requests 2
                    UnitPrice = 100
                }
            }
        };

        _orderRepository.GetActiveCartByUserIdAsync(userId).Returns(cart);
        _productRepository.GetByIdAsync(product.ProductResourceId).Returns(product);

        // Act
        Func<Task> act = async () => await _orderService.CheckoutAsync(userId);

        // Assert
        await act.Should().ThrowAsync<InsufficientStockException>()
            .WithMessage("Insufficient stock.");
    }

    [Fact]
    public async Task CheckoutAsync_ShouldCompleteCheckout_WhenStockIsSufficient()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var product = new Product
        {
            ProductResourceId = Guid.NewGuid(),
            Name = "Product A",
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
            Status = OrderStatus.Cart
        };

        _orderRepository.GetActiveCartByUserIdAsync(userId).Returns(cart);
        _productRepository.GetByIdAsync(product.ProductResourceId).Returns(product);

        // Act
        var result = await _orderService.CheckoutAsync(userId);

        // Assert
        result.Should().NotBeNull();
        product.Stock.Should().Be(7); // Reduced from 10 to 7
        cart.Status.Should().Be(OrderStatus.Pending);
        cart.CreatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(5));

        await _orderRepository.Received(1).UpdateOrderAsync(cart);
    }

    [Fact]
    public async Task CheckoutAsync_ShouldWrapOperationInExecuteInTransactionAsync()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var product = new Product { ProductResourceId = Guid.NewGuid(), Name = "Product A", Price = 100, Stock = 10 };
        var cart = new Order
        {
            UserResourceId = userId,
            OrderItems = new List<OrderItem>
            {
                new OrderItem { ProductResourceId = product.ProductResourceId, Quantity = 3, UnitPrice = 100 }
            },
            TotalAmount = 300,
            Status = OrderStatus.Cart
        };

        _orderRepository.GetActiveCartByUserIdAsync(userId).Returns(cart);
        _productRepository.GetByIdAsync(product.ProductResourceId).Returns(product);

        // Act
        await _orderService.CheckoutAsync(userId);

        // Assert
        // Ensures concurrent checkouts cannot both pass stock validation for the same product:
        // the whole validate-and-deduct flow must run inside a single explicit transaction.
        await _orderRepository.Received(1).ExecuteInTransactionAsync(Arg.Any<Func<Task<CartDto>>>());
    }

    #endregion
}
