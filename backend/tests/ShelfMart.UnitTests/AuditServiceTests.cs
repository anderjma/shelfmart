using FluentAssertions;
using ShelfMart.Domain.Entities;
using ShelfMart.DomainService;
using ShelfMart.DomainService.Interfaces;
using NSubstitute;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace ShelfMart.UnitTests;

public class AuditServiceTests
{
    private readonly IAuditRepository _auditRepository;
    private readonly AuditService _auditService;

    public AuditServiceTests()
    {
        _auditRepository = Substitute.For<IAuditRepository>();
        _auditService = new AuditService(_auditRepository);
    }

    #region GetDashboardStatsAsync Tests

    [Fact]
    public async Task GetDashboardStatsAsync_ShouldReturnTypedDashboardStatsDto()
    {
        // Arrange
        _auditRepository.GetTotalRevenueAsync().Returns(1500m);
        _auditRepository.GetTotalCompletedOrdersAsync().Returns(12);
        _auditRepository.GetLowStockProductsCountAsync().Returns(3);
        _auditRepository.GetTotalCustomersCountAsync().Returns(7);
        _auditRepository.GetOrdersFromLastDaysAsync(5).Returns(new List<Order>());

        // Act
        var result = await _auditService.GetDashboardStatsAsync();

        // Assert
        result.Revenue.Should().Be(1500m);
        result.Orders.Should().Be(12);
        result.LowStock.Should().Be(3);
        result.TotalCustomers.Should().Be(7);
        result.SalesChart.Should().HaveCount(5);
    }

    #endregion

    #region GetAuditLogsAsync Tests

    [Fact]
    public async Task GetAuditLogsAsync_ShouldReturnPaginatedResult_WithCorrectPageAndPageSize()
    {
        // Arrange
        var logs = new List<AuditLog>
        {
            new AuditLog { AuditLogId = Guid.NewGuid(), Username = "admin", Action = "Did X", Timestamp = DateTime.UtcNow }
        };
        _auditRepository.GetPaginatedAuditLogsAsync(2, 10).Returns((logs, 25));

        // Act
        var result = await _auditService.GetAuditLogsAsync(2, 10);

        // Assert
        result.Page.Should().Be(2);
        result.PageSize.Should().Be(10);
        result.TotalCount.Should().Be(25);
        result.Items.Should().ContainSingle();
    }

    [Fact]
    public async Task GetAuditLogsAsync_ShouldMapEntriesToTypedAuditLogDto()
    {
        // Arrange
        var logId = Guid.NewGuid();
        var timestamp = DateTime.UtcNow;
        var logs = new List<AuditLog>
        {
            new AuditLog { AuditLogId = logId, Username = "admin", Action = "Deleted product", Timestamp = timestamp }
        };
        _auditRepository.GetPaginatedAuditLogsAsync(1, 20).Returns((logs, 1));

        // Act
        var result = await _auditService.GetAuditLogsAsync(1, 20);
        var entry = result.Items.Should().ContainSingle().Subject;

        // Assert
        entry.AuditLogId.Should().Be(logId);
        entry.User.Should().Be("admin");
        entry.Action.Should().Be("Deleted product");
        entry.Timestamp.Should().Be(timestamp);
    }

    #endregion

    #region LogActionAsync Tests

    [Fact]
    public async Task LogActionAsync_ShouldPersistAuditLogWithProvidedUsernameAndAction()
    {
        // Act
        await _auditService.LogActionAsync("admin", "Deleted product X");

        // Assert
        await _auditRepository.Received(1).LogActionAsync(Arg.Is<AuditLog>(l =>
            l.Username == "admin" && l.Action == "Deleted product X"));
    }

    #endregion
}
