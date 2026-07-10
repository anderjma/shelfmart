// This file handles the shopping cart view and the order confirmation flow.
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCart, checkout, updateCartItemQuantity, removeFromCart } from "../api/orderService";
import toast from "react-hot-toast";
import type { Cart as CartType } from "../types";
import { Trash2, Plus, Minus } from "lucide-react";
import SEO from "../../../shared/components/SEO";
import ConfirmDialog from "../../../shared/components/ConfirmDialog";
import { getErrorMessage } from "../../../lib/http-error";
import { formatCurrency } from "../../../shared/utils/formatCurrency";

// This component lists the selected items, calculates totals, and initiates the checkout process.
export default function Cart() {
    const [cart, setCart] = useState<CartType | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState("");
    const [pendingRemoval, setPendingRemoval] = useState<string | null>(null);
    const [confirmingCheckout, setConfirmingCheckout] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const data = await getCart();
                setCart(data);
            } catch {
                setError("Error loading the cart.");
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, []);

    const handleUpdateQuantity = async (productId: string, currentQty: number, change: number) => {
        const newQty = currentQty + change;
        if (newQty < 1) {
            setPendingRemoval(productId);
            return;
        }

        try {
            const updatedCart = await updateCartItemQuantity(productId, newQty);
            setCart(updatedCart);
        } catch (err) {
            toast.error(getErrorMessage(err, "Error updating the quantity."));
        }
    };

    const handleConfirmRemoveItem = async () => {
        if (!pendingRemoval) return;

        try {
            const updatedCart = await removeFromCart(pendingRemoval);
            setCart(updatedCart);
            toast.success("Product removed from cart");
        } catch (err) {
            toast.error(getErrorMessage(err, "Error removing the product."));
        } finally {
            setPendingRemoval(null);
        }
    };

    const handleConfirmCheckout = async () => {
        setProcessing(true);
        try {
            await checkout();
            toast.success("Purchase processed successfully!");
            navigate("/");
        } catch (err) {
            toast.error(getErrorMessage(err, "Error processing the purchase."));
        } finally {
            setProcessing(false);
            setConfirmingCheckout(false);
        }
    };

    if (loading) return <div className="text-center p-8 text-ink-700">Loading cart...</div>;
    if (error) return <div className="text-center p-8 text-red-600" role="alert">{error}</div>;

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div className="text-center py-16 mx-4 sm:mx-0 bg-white rounded-2xl shadow-sm border border-sand-300">
                <SEO title="My Cart" description="Your shopping cart is empty." />
                <h2 className="text-2xl font-bold text-ink-900 mb-4">Your cart is empty</h2>
                <button onClick={() => navigate("/")} className="text-accent-500 font-medium hover:underline">
                    Back to catalog
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <SEO title="My Cart" description="Review your selected products and complete your purchase securely." />
            <div className="px-4 sm:px-0">
                <h2 className="text-2xl font-bold text-ink-900">My Shopping Cart</h2>
            </div>

            {/* Desktop table */}
            <div className="hidden sm:block bg-white rounded-2xl shadow-sm overflow-hidden border border-sand-300">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-sand-300">
                        <thead className="bg-cream-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-ink-700 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-ink-700 uppercase tracking-wider">Unit Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-ink-700 uppercase tracking-wider">Quantity</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-ink-700 uppercase tracking-wider">Subtotal</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-ink-700 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-sand-300">
                            {cart.items.map((item) => (
                                <tr key={item.productId}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-ink-900">{item.productName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-700">{formatCurrency(item.unitPrice)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-700">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleUpdateQuantity(item.productId, item.quantity, -1)}
                                                className="p-1 rounded-lg bg-cream-100 hover:bg-cream-200 text-ink-700 transition-colors"
                                                aria-label={`Decrease quantity of ${item.productName}`}
                                            >
                                                <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                                            </button>
                                            <span className="font-semibold text-ink-900 w-8 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => handleUpdateQuantity(item.productId, item.quantity, 1)}
                                                className="p-1 rounded-lg bg-cream-100 hover:bg-cream-200 text-ink-700 transition-colors"
                                                aria-label={`Increase quantity of ${item.productName}`}
                                            >
                                                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-900 font-medium">{formatCurrency(item.subTotal)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => setPendingRemoval(item.productId)}
                                            className="text-red-600 hover:text-red-800 p-1.5 rounded-full hover:bg-red-50 transition-colors"
                                            aria-label={`Remove ${item.productName} from cart`}
                                        >
                                            <Trash2 className="w-4 h-4" aria-hidden="true" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile cards */}
            <div className="block sm:hidden space-y-4 px-4 sm:px-0">
                {cart.items.map((item) => (
                    <div key={item.productId} className="bg-white p-4 rounded-2xl shadow-sm border border-sand-300 flex flex-col gap-3">
                        <div className="flex justify-between items-start gap-2">
                            <h3 className="font-bold text-ink-900 text-base leading-tight">{item.productName}</h3>
                            <span className="text-base font-bold text-ink-900 whitespace-nowrap">{formatCurrency(item.subTotal)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-ink-700">Price: {formatCurrency(item.unitPrice)}</span>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5 bg-cream-100 border border-sand-300 rounded-lg px-1.5 py-0.5">
                                    <button
                                        onClick={() => handleUpdateQuantity(item.productId, item.quantity, -1)}
                                        className="p-0.5 text-ink-700 hover:text-ink-900"
                                        aria-label={`Decrease quantity of ${item.productName}`}
                                    >
                                        <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                                    </button>
                                    <span className="font-semibold text-ink-900 text-xs w-6 text-center">{item.quantity}</span>
                                    <button
                                        onClick={() => handleUpdateQuantity(item.productId, item.quantity, 1)}
                                        className="p-0.5 text-ink-700 hover:text-ink-900"
                                        aria-label={`Increase quantity of ${item.productName}`}
                                    >
                                        <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                                    </button>
                                </div>
                                <button
                                    onClick={() => setPendingRemoval(item.productId)}
                                    className="text-red-600 hover:text-red-800 p-1 rounded-lg hover:bg-red-50"
                                    aria-label={`Remove ${item.productName} from cart`}
                                >
                                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Cart summary */}
            <div className="bg-white px-4 sm:px-6 py-5 sm:rounded-2xl sm:shadow-sm sm:border sm:border-sand-300 border-y border-sand-300 sm:border-y-0">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="w-full sm:w-auto flex justify-between items-center sm:block">
                        <span className="text-ink-700 font-medium sm:hidden">Total due:</span>
                        <span className="text-xl font-bold text-ink-900">
                            <span className="hidden sm:inline">Total: </span>
                            {formatCurrency(cart.totalAmount)}
                        </span>
                    </div>
                    <button
                        onClick={() => setConfirmingCheckout(true)}
                        disabled={processing}
                        className="w-full sm:w-auto bg-accent-500 text-white px-8 py-3 rounded-xl font-medium hover:bg-accent-600 disabled:bg-accent-500/40 transition-colors text-center shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2"
                    >
                        {processing ? "Processing..." : "Complete Purchase"}
                    </button>
                </div>
            </div>

            <ConfirmDialog
                isOpen={!!pendingRemoval}
                title="Remove Item"
                message="Do you want to remove this product from the cart?"
                confirmLabel="Remove"
                confirmVariant="danger"
                onConfirm={handleConfirmRemoveItem}
                onCancel={() => setPendingRemoval(null)}
            />

            <ConfirmDialog
                isOpen={confirmingCheckout}
                title="Confirm Purchase"
                message="Do you want to confirm your purchase? This action cannot be undone."
                confirmLabel="Confirm Purchase"
                confirmVariant="primary"
                onConfirm={handleConfirmCheckout}
                onCancel={() => setConfirmingCheckout(false)}
            />
        </div>
    );
}
