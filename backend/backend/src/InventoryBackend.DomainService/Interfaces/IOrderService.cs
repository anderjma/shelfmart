using InventoryBackend.Dto;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace InventoryBackend.DomainService.Interfaces;

public interface IOrderService
{
    Task<CartDto> GetCartAsync(Guid userId);
    Task<CartDto> AddItemToCartAsync(Guid userId, AddToCartDto dto);
    Task<CartDto> CheckoutAsync(Guid userId);
    Task<IEnumerable<AdminOrderDto>> GetAllCompletedOrdersAsync();
    Task<IEnumerable<AdminOrderDto>> GetCustomerOrdersAsync(Guid userId);
}
