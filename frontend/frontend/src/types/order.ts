// Este archivo centraliza los tipos TypeScript para mantener el tipado estricto en los pedidos.
export interface CartItem {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    subTotal: number;
}

// Esta interfaz engloba el estado en progreso de una compra antes de ejecutar el checkout.
export interface Cart {
    orderId: string;
    totalAmount: number;
    items: CartItem[];
}

// Esta interfaz consolida la información técnica de un producto que será enviado hacia el servidor para añadirlo al carrito.
export interface AddToCartDto {
    productId: string;
    quantity: number;
}

// Esta interfaz enriquece los artículos de compra con su respectivo precio base para la vista de gerente.
export interface ManagerOrderItem {
    quantity: number;
    productName: string;
    unitPrice: number;
}

// Esta interfaz agrupa toda la telemetría sobre una orden necesaria para ser reportada en el dashboard de administrador.
export interface ManagerOrder {
    customerUsername: string;
    totalAmount: number;
    items: ManagerOrderItem[];
}
