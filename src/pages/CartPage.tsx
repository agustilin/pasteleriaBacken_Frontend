import { useCart } from "../context/useCart";
import { CartItem } from "../components/cart/CartItem";
import { CartSummary } from "../components/cart/CartSummary";
import { EmptyCart } from "../components/cart/EmptyCart";

export const CartPage = () => {
    const { cart, updateQuantity, removeFromCart, applyPromoCode, removePromoCode } = useCart();

    if (cart.items.length === 0) {
        return <EmptyCart />;
    }

    return (
        <div className="py-8 px-4">
            <h1 className="text-center text-4xl font-bold mb-8">Tu Carrito</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {cart.items.map((item) => (
                        <CartItem
                            key={item.id}
                            item={item}
                            updateQuantity={updateQuantity}
                            removeFromCart={removeFromCart}
                        />
                    ))}
                </div>
                
                <div>
                    <CartSummary 
                        cart={cart} 
                        onApplyPromoCode={applyPromoCode}
                        onRemovePromoCode={removePromoCode}
                    />
                </div>
            </div>
        </div>
    );
};
