using InventoryBackend.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace InventoryBackend.DomainService.Interfaces;

public interface IOrderRepository
{
    Task<Order?> GetActiveCartByUserIdAsync(Guid userId);
    Task<IEnumerable<Order>> GetAllCompletedOrdersAsync();
    Task<Order> CreateOrderAsync(Order order);
    Task UpdateOrderAsync(Order order);
    Task<IEnumerable<Order>> GetOrdersByUserIdAsync(Guid userId);
}
