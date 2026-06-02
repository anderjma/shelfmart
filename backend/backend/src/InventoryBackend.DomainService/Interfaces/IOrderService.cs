using System;
using System.Threading.Tasks;
using InventoryBackend.Dto;

namespace InventoryBackend.DomainService.Interfaces;

public interface IOrderService
{
    Task<CartDto> GetCartAsync(Guid userId);
    Task<CartDto> AddItemToCartAsync(Guid userId, AddToCartDto dto);
}
