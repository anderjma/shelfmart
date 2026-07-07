using ShelfMart.Domain.Entities;
using System;
// This file dictates the rules governing the persistence of completed and in-progress orders.
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ShelfMart.DomainService.Interfaces;

public interface IOrderRepository
{
    Task<Order?> GetActiveCartByUserIdAsync(Guid userId);
    Task<IEnumerable<Order>> GetAllCompletedOrdersAsync();
    Task<Order> CreateOrderAsync(Order order);
    Task UpdateOrderAsync(Order order);
    Task<IEnumerable<Order>> GetOrdersByUserIdAsync(Guid userId);
}
