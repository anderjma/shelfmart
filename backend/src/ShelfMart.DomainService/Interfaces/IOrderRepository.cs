using ShelfMart.Domain.Entities;
using System;
// This file dictates the rules governing the persistence of completed and in-progress orders.
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ShelfMart.DomainService.Interfaces;

public interface IOrderRepository
{
    Task<Order?> GetActiveCartByUserIdAsync(Guid userId);
    Task<Order?> GetByIdAsync(Guid orderId);
    Task<IEnumerable<Order>> GetAllCompletedOrdersAsync();
    Task<Order> CreateOrderAsync(Order order);
    Task UpdateOrderAsync(Order order);
    Task<IEnumerable<Order>> GetOrdersByUserIdAsync(Guid userId);

    // Executes the given operation within an explicit database transaction, committing on success and rolling back on failure.
    Task<T> ExecuteInTransactionAsync<T>(Func<Task<T>> operation);
}
