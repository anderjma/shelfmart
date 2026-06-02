using InventoryBackend.Domain.Entities;

namespace InventoryBackend.DomainService.Interfaces;

public interface IOrderRepository
{
    Task<Order?> GetActiveCartByUserIdAsync(Guid userId);
    Task<Order> CreateOrderAsync(Order order);
    Task UpdateOrderAsync(Order order);
}
