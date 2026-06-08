export interface CartItem {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    subTotal: number;
}

export interface Cart {
    orderId: string;
    totalAmount: number;
    items: CartItem[];
}

export interface AddToCartDto {
    productId: string;
    quantity: number;
}

export interface ManagerOrderItem {
    quantity: number;
    productName: string;
    unitPrice: number;
}

export interface ManagerOrder {
    customerUsername: string;
    totalAmount: number;
    items: ManagerOrderItem[];
}
