using InventoryBackend.Domain.Entities;
using InventoryBackend.DomainService.Interfaces;
using InventoryBackend.Dto;
using InventoryBackend.Exceptions;

namespace InventoryBackend.DomainService;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepository;
    private readonly IProductRepository _productRepository;

    public OrderService(IOrderRepository orderRepository, IProductRepository productRepository)
    {
        _orderRepository = orderRepository;
        _productRepository = productRepository;
    }

    public async Task<CartDto> GetCartAsync(Guid userId)
    {
        var cart = await _orderRepository.GetActiveCartByUserIdAsync(userId);
        if (cart == null) return new CartDto();

        return MapToCartDto(cart);
    }

    public async Task<CartDto> AddItemToCartAsync(Guid userId, AddToCartDto dto)
    {
        var product = await _productRepository.GetByIdAsync(dto.ProductId);
        if (product == null) throw new NotFoundResponseException("Producto no encontrado.");

        var cart = await _orderRepository.GetActiveCartByUserIdAsync(userId);
        
        if (cart == null)
        {
            cart = new Order { UserResourceId = userId };
            cart = await _orderRepository.CreateOrderAsync(cart);
        }

        var existingItem = cart.OrderItems.FirstOrDefault(i => i.ProductResourceId == dto.ProductId);
        if (existingItem != null)
        {
            existingItem.Quantity += dto.Quantity;
        }
        else
        {
            cart.OrderItems.Add(new OrderItem
            {
                OrderId = cart.OrderId,
                ProductResourceId = product.ProductResourceId,
                Quantity = dto.Quantity,
                UnitPrice = product.Price
            });
        }

        cart.TotalAmount = cart.OrderItems.Sum(i => i.Quantity * i.UnitPrice);
        await _orderRepository.UpdateOrderAsync(cart);

        return MapToCartDto(cart);
    }

    private CartDto MapToCartDto(Order order)
    {
        return new CartDto
        {
            OrderId = order.OrderId,
            TotalAmount = order.TotalAmount,
            Items = order.OrderItems.Select(i => new CartItemDto
            {
                ProductId = i.ProductResourceId,
                ProductName = i.Product?.Name ?? "Desconocido",
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice
            }).ToList()
        };
    }
}
