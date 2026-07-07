// This file centralizes the TypeScript types to maintain strict typing for orders.
export interface CartItem {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    subTotal: number;
}

// This interface encapsulates the in-progress state of a purchase before checkout is executed.
export interface Cart {
    orderId: string;
    totalAmount: number;
    items: CartItem[];
}

// This interface consolidates the technical information of a product that will be sent to the server to add it to the cart.
export interface AddToCartDto {
    productId: string;
    quantity: number;
}

