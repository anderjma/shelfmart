using BusinessSystem.Domain.Entities;
using System;
// Este archivo dicta las reglas que rigen la persistencia de los pedidos finalizados y en progreso.
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BusinessSystem.DomainService.Interfaces;

public interface IOrderRepository
{
    Task<Order?> GetActiveCartByUserIdAsync(Guid userId);
    Task<IEnumerable<Order>> GetAllCompletedOrdersAsync();
    Task<Order> CreateOrderAsync(Order order);
    Task UpdateOrderAsync(Order order);
    Task<IEnumerable<Order>> GetOrdersByUserIdAsync(Guid userId);
}
