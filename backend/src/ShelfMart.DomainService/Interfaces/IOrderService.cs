using ShelfMart.Dto;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

// This file declares the contract required to process commercial transactions and carts.
namespace ShelfMart.DomainService.Interfaces;

public interface IOrderService
{
    Task<CartDto> GetCartAsync(Guid userId);
    Task<CartDto> AddItemToCartAsync(Guid userId, AddToCartDto dto);
    Task<CartDto> UpdateItemQuantityAsync(Guid userId, Guid productId, int quantity);
    Task<CartDto> RemoveItemFromCartAsync(Guid userId, Guid productId);
    Task<CartDto> CheckoutAsync(Guid userId);
    Task<IEnumerable<AdminOrderDto>> GetAllCompletedOrdersAsync();
    Task<IEnumerable<AdminOrderDto>> GetCustomerOrdersAsync(Guid userId);
}
