using BusinessSystem.Dto;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

// Este archivo declara el contrato requerido para procesar transacciones comerciales y carritos.
namespace BusinessSystem.DomainService.Interfaces;

public interface IOrderService
{
    Task<CartDto> GetCartAsync(Guid userId);
    Task<CartDto> AddItemToCartAsync(Guid userId, AddToCartDto dto);
    Task<CartDto> CheckoutAsync(Guid userId);
    Task<IEnumerable<AdminOrderDto>> GetAllCompletedOrdersAsync();
    Task<IEnumerable<AdminOrderDto>> GetCustomerOrdersAsync(Guid userId);
}
