using FluentAssertions;
using ShelfMart.Domain.Entities;
using ShelfMart.Domain.Enums;
using System;
using Xunit;

namespace ShelfMart.UnitTests;

public class OrderEntityTests
{
    #region CreateCart Tests

    [Fact]
    public void CreateCart_ShouldReturnOrderWithCartStatus()
    {
        // Arrange
        var userId = Guid.NewGuid();

        // Act
        var order = Order.CreateCart(userId);

        // Assert
        order.UserResourceId.Should().Be(userId);
        order.Status.Should().Be(OrderStatus.Cart);
    }

    #endregion

    #region MarkAsPending Tests

    [Fact]
    public void MarkAsPending_ShouldSetStatusToPending_WhenOrderIsAnActiveCart()
    {
        // Arrange
        var order = Order.CreateCart(Guid.NewGuid());

        // Act
        order.MarkAsPending();

        // Assert
        order.Status.Should().Be(OrderStatus.Pending);
    }

    [Fact]
    public void MarkAsPending_ShouldThrowInvalidOperationException_WhenOrderIsNotAnActiveCart()
    {
        // Arrange
        var order = Order.CreateCart(Guid.NewGuid());
        order.MarkAsPending();

        // Act
        Action act = () => order.MarkAsPending();

        // Assert
        act.Should().Throw<InvalidOperationException>()
            .WithMessage("Only an active cart can be checked out.");
    }

    #endregion

    #region Cancel Tests

    [Fact]
    public void Cancel_ShouldSetStatusToCancelled_WhenOrderIsPending()
    {
        // Arrange
        var order = Order.CreateCart(Guid.NewGuid());
        order.MarkAsPending();

        // Act
        order.Cancel();

        // Assert
        order.Status.Should().Be(OrderStatus.Cancelled);
    }

    [Fact]
    public void Cancel_ShouldThrowInvalidOperationException_WhenOrderIsAlreadyDelivered()
    {
        // Arrange
        var order = Order.CreateCart(Guid.NewGuid());
        order.MarkAsPending();
        order.Status = OrderStatus.Delivered;

        // Act
        Action act = () => order.Cancel();

        // Assert
        act.Should().Throw<InvalidOperationException>()
            .WithMessage("Cannot cancel an order in Delivered status.");
    }

    [Fact]
    public void Cancel_ShouldThrowInvalidOperationException_WhenOrderIsAlreadyCancelled()
    {
        // Arrange
        var order = Order.CreateCart(Guid.NewGuid());
        order.MarkAsPending();
        order.Cancel();

        // Act
        Action act = () => order.Cancel();

        // Assert
        act.Should().Throw<InvalidOperationException>()
            .WithMessage("Cannot cancel an order in Cancelled status.");
    }

    #endregion
}
