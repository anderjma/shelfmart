// Este archivo define la estructura puente entre una factura y los productos específicos adquiridos.
using System;

namespace BusinessSystem.Domain.Entities;

// Esta clase representa la cantidad y costo exacto al momento de venta de un artículo individual dentro de un carrito de compras.
public class OrderItem
{
    public Guid OrderItemId { get; set; } = Guid.NewGuid();
    public Guid OrderId { get; set; }
    public Order Order { get; set; } = null!;
    public Guid ProductResourceId { get; set; }
    public Product Product { get; set; } = null!;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
}
