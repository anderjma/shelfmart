using InventoryBackend.Domain.Entities;
using InventoryBackend.DomainService.Interfaces;
using InventoryBackend.Dto;
using InventoryBackend.Exceptions;
using System;
using System.Linq;
using System.Threading.Tasks;

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
        // 1. Buscamos el producto
        var product = await _productRepository.GetByIdAsync(dto.ProductId);
        if (product == null) throw new NotFoundResponseException("Producto no encontrado.");

        // 2. Buscamos el carrito activo
        var cart = await _orderRepository.GetActiveCartByUserIdAsync(userId);
        bool isNewCart = false;
        
        // 3. Si no existe, lo inicializamos solo en memoria (SIN GUARDAR AÚN)
        if (cart == null)
        {
            cart = new Order { UserResourceId = userId };
            isNewCart = true;
        }

        // 4. Agregamos el producto a la lista en memoria
        var existingItem = cart.OrderItems.FirstOrDefault(i => i.ProductResourceId == product.ProductResourceId);
        if (existingItem != null)
        {
            existingItem.Quantity += dto.Quantity;
        }
        else
        {
            cart.OrderItems.Add(new OrderItem
            {
                ProductResourceId = product.ProductResourceId,
                Product = product,
                Quantity = dto.Quantity,
                UnitPrice = product.Price
            });
        }

        // 5. Calculamos el nuevo total
        cart.TotalAmount = cart.OrderItems.Sum(i => i.Quantity * i.UnitPrice);

        // 6. GUARDADO ATÓMICO: Una única transacción final a la base de datos
        if (isNewCart)
        {
            await _orderRepository.CreateOrderAsync(cart); // Guarda carrito e ítems
        }
        else
        {
            await _orderRepository.UpdateOrderAsync(cart); // Actualiza carrito e ítems nuevos
        }

        return MapToCartDto(cart);
    }

    public async Task<CartDto> CheckoutAsync(Guid userId)
    {
        var cart = await _orderRepository.GetActiveCartByUserIdAsync(userId);
        
        if (cart == null || !cart.OrderItems.Any())
        {
            throw new BadRequestResponseException("El carrito está vacío. Agregue productos antes de procesar la compra.");
        }

        foreach (var item in cart.OrderItems)
        {
            var product = await _productRepository.GetByIdAsync(item.ProductResourceId);
            if (product == null) throw new NotFoundResponseException($"El producto asociado a este ítem ya no existe.");

            if (product.Stock < item.Quantity)
            {
                throw new BadRequestResponseException($"Stock insuficiente para el producto: {product.Name}. Disponibles: {product.Stock}");
            }

            product.Stock -= item.Quantity;
            await _productRepository.UpdateAsync(product);
        }

        cart.Status = "Completed";
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
