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
import { useLanguage } from "../../../lib/i18n-context";
import { translateProductName } from "../../../lib/translations";

// This component lists the selected items, calculates totals, and initiates the checkout process.
export default function Cart() {
    const { t, language } = useLanguage();
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
            toast.success(t("cart.removedToast", "Product removed from cart"));
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
            toast.success(t("cart.purchasedToast", "Purchase processed successfully!"));
            navigate("/");
        } catch (err) {
            toast.error(getErrorMessage(err, "Error processing the purchase."));
        } finally {
            setProcessing(false);
            setConfirmingCheckout(false);
        }
    };

    if (loading) return <div className="text-center p-8 text-ink-700">{t("cart.loading", "Loading cart...")}</div>;
    if (error) return <div className="text-center p-8 text-red-600" role="alert">{error}</div>;

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div className="text-center py-16 mx-4 sm:mx-0 bg-white rounded-2xl shadow-sm border border-sand-300">
                <SEO title={t("cart.title", "My Cart")} description={t("cart.empty", "Your cart is empty")} />
                <h2 className="text-2xl font-bold text-ink-900 mb-4">{t("cart.empty", "Your cart is empty")}</h2>
                <button onClick={() => navigate("/")} className="text-accent-500 font-medium hover:underline">
                    {t("cart.backToCatalog", "Back to catalog")}
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <SEO title={t("cart.title", "My Cart")} description="Review your selected products and complete your purchase securely." />
            <div className="px-4 sm:px-0">
                <h2 className="text-2xl font-bold text-ink-900">{t("cart.myCart", "My Shopping Cart")}</h2>
            </div>

            {/* Desktop table */}
            <div className="hidden sm:block bg-white dark:bg-slate-900 rounded-2xl shadow-xs overflow-hidden border border-sand-300 dark:border-slate-700" aria-live="polite">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-sand-300 dark:divide-slate-700" aria-label="Shopping cart contents">
                        <thead className="bg-cream-100 dark:bg-slate-800">
                            <tr>
                                <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-ink-700 dark:text-slate-300 uppercase tracking-wider">{t("cart.product", "Product")}</th>
                                <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-ink-700 dark:text-slate-300 uppercase tracking-wider">{t("cart.unitPrice", "Unit Price")}</th>
                                <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-ink-700 dark:text-slate-300 uppercase tracking-wider">{t("cart.quantity", "Quantity")}</th>
                                <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-ink-700 dark:text-slate-300 uppercase tracking-wider">{t("cart.subtotal", "Subtotal")}</th>
                                <th scope="col" className="px-6 py-3.5 text-right text-xs font-semibold text-ink-700 dark:text-slate-300 uppercase tracking-wider">{t("cart.actions", "Actions")}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-900 divide-y divide-sand-300 dark:divide-slate-700">
                            {cart.items.map((item) => {
                                const translatedName = translateProductName(item.productName, language);
                                return (
                                    <tr key={item.productId} className="hover:bg-cream-50 dark:hover:bg-slate-800/40 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-ink-900 dark:text-white">{translatedName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-700 dark:text-slate-300">{formatCurrency(item.unitPrice)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-700 dark:text-slate-300">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.productId, item.quantity, -1)}
                                                    className="p-1.5 rounded-lg bg-cream-100 dark:bg-slate-800 hover:bg-cream-200 dark:hover:bg-slate-700 text-ink-700 dark:text-slate-200 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
                                                    aria-label={t("cart.decreaseAria", `Decrease quantity of ${translatedName}`).replace("{name}", translatedName)}
                                                >
                                                    <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                                                </button>
                                                <span className="font-semibold text-ink-900 dark:text-white w-8 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.productId, item.quantity, 1)}
                                                    className="p-1.5 rounded-lg bg-cream-100 dark:bg-slate-800 hover:bg-cream-200 dark:hover:bg-slate-700 text-ink-700 dark:text-slate-200 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
                                                    aria-label={t("cart.increaseAria", `Increase quantity of ${translatedName}`).replace("{name}", translatedName)}
                                                >
                                                    <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-900 dark:text-white font-semibold">{formatCurrency(item.subTotal)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => setPendingRemoval(item.productId)}
                                                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors min-h-[36px] min-w-[36px] inline-flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                                                aria-label={t("cart.removeAria", `Remove ${translatedName} from cart`).replace("{name}", translatedName)}
                                            >
                                                <Trash2 className="w-4 h-4" aria-hidden="true" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile cards */}
            <div className="block sm:hidden space-y-4 px-4 sm:px-0" aria-live="polite">
                {cart.items.map((item) => {
                    const translatedName = translateProductName(item.productName, language);
                    return (
                        <div key={item.productId} className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-xs border border-sand-300 dark:border-slate-700 flex flex-col gap-3">
                            <div className="flex justify-between items-start gap-2">
                                <h3 className="font-semibold text-ink-900 dark:text-white text-base leading-tight">{translatedName}</h3>
                                <span className="text-base font-bold text-ink-900 dark:text-white whitespace-nowrap">{formatCurrency(item.subTotal)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-ink-700 dark:text-slate-300">{t("cart.price", "Price")}: {formatCurrency(item.unitPrice)}</span>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1.5 bg-cream-100 dark:bg-slate-800 border border-sand-300 dark:border-slate-700 rounded-xl px-2 py-1">
                                        <button
                                            onClick={() => handleUpdateQuantity(item.productId, item.quantity, -1)}
                                            className="p-1.5 text-ink-700 dark:text-slate-200 hover:text-ink-900 dark:hover:text-white min-h-[36px] min-w-[36px] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
                                            aria-label={t("cart.decreaseAria", `Decrease quantity of ${translatedName}`).replace("{name}", translatedName)}
                                        >
                                            <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                                        </button>
                                        <span className="font-semibold text-ink-900 dark:text-white text-xs w-6 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => handleUpdateQuantity(item.productId, item.quantity, 1)}
                                            className="p-1.5 text-ink-700 dark:text-slate-200 hover:text-ink-900 dark:hover:text-white min-h-[36px] min-w-[36px] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
                                            aria-label={t("cart.increaseAria", `Increase quantity of ${translatedName}`).replace("{name}", translatedName)}
                                        >
                                            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => setPendingRemoval(item.productId)}
                                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 min-h-[40px] min-w-[40px] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                                        aria-label={t("cart.removeAria", `Remove ${translatedName} from cart`).replace("{name}", translatedName)}
                                    >
                                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Cart summary */}
            <div className="bg-white dark:bg-slate-900 px-4 sm:px-6 py-5 sm:rounded-2xl sm:shadow-xs sm:border sm:border-sand-300 dark:sm:border-slate-700 border-y border-sand-300 dark:border-slate-700 sm:border-y-0">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="w-full sm:w-auto flex justify-between items-center sm:block">
                        <span className="text-ink-700 dark:text-slate-300 font-medium sm:hidden">{t("cart.totalDue", "Total due:")}</span>
                        <span className="text-xl font-bold text-ink-900 dark:text-white">
                            <span className="hidden sm:inline">{t("cart.total", "Total:")} </span>
                            {formatCurrency(cart.totalAmount)}
                        </span>
                    </div>
                    <button
                        onClick={() => setConfirmingCheckout(true)}
                        disabled={processing}
                        className="w-full sm:w-auto bg-accent-500 text-white px-8 py-3 rounded-xl font-medium hover:bg-accent-600 disabled:bg-accent-500/40 transition-colors text-center shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 min-h-[44px]"
                    >
                        {processing ? t("cart.processing", "Processing...") : t("cart.completePurchase", "Complete Purchase")}
                    </button>
                </div>
            </div>

            <ConfirmDialog
                isOpen={!!pendingRemoval}
                title={t("cart.removeItemTitle", "Remove Item")}
                message={t("cart.removeItemConfirm", "Do you want to remove this product from the cart?")}
                confirmLabel={t("cart.removeItem", "Remove")}
                confirmVariant="danger"
                onConfirm={handleConfirmRemoveItem}
                onCancel={() => setPendingRemoval(null)}
            />

            <ConfirmDialog
                isOpen={confirmingCheckout}
                title={t("cart.confirmPurchaseTitle", "Confirm Purchase")}
                message={t("cart.confirmPurchasePrompt", "Do you want to confirm your purchase? This action cannot be undone.")}
                confirmLabel={t("cart.confirmPurchase", "Confirm Purchase")}
                confirmVariant="primary"
                onConfirm={handleConfirmCheckout}
                onCancel={() => setConfirmingCheckout(false)}
            />
        </div>
    );
}
