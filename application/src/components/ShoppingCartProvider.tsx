import { createContext, ReactNode, useContext, useState } from "react"
import { CartItem } from "../types/CartItem";
import { GetProductPrice, Product } from "../types/Product";

type ShoppingCartContext = {
    shoppingCart: { [productId: number]: CartItem }
    setShoppingCart: (shoppingCart: { [productId: number]: CartItem }) => void
}

type ShoppingCartProviderProp = {
    children: ReactNode
}

type ShoppingCartHookProp = {
    cartItems: CartItem[]
    cartQuantity: number
    totalPrice: number
    getItemQuantity: (product: Product) => number
    addItem: (product: Product) => void
    reduceItem: (product: Product) => boolean
    deleteItem: (product: Product) => boolean
    reset: () => void
}


const ShoppingCartContext = createContext({} as ShoppingCartContext)

/**
 * Cart custom hook.
 * @returns 
 */
export function useShoppingCart(): ShoppingCartHookProp {
    const { shoppingCart, setShoppingCart } = useContext(ShoppingCartContext)

    const cartItems = Object.values(shoppingCart)
    const cartQuantity = cartItems.reduce((quantity, item) => quantity + item.quantity, 0)
    const totalPrice = cartItems.reduce((price, item) => price + (GetProductPrice(item.product) * item.quantity), 0)

    /**
     * Get the number of item in the cart.
     * @param product 
     * @returns 
     */
    function getItemQuantity(product: Product): number {
        if (product.id in shoppingCart) {
            return shoppingCart[product.id].quantity
        }
        return 0
    }

    /**
     * Increase the item number by 1
     * @param product 
     */
    function addItem(product: Product) {
        const tempCartItems = { ...shoppingCart }
        if (product.id in tempCartItems) {
            tempCartItems[product.id].quantity++
        } else {
            tempCartItems[product.id] = {
                product: product,
                quantity: 1,
            }
        }
        setShoppingCart(tempCartItems)
    }

    /**
     * Decrease the item number by 1
     * @param product 
     * @returns 
     */
    function reduceItem(product: Product): boolean {
        if (product.id in shoppingCart) {
            const tempCartItems = { ...shoppingCart }
            const modifiedQuantity = --tempCartItems[product.id].quantity
            if (modifiedQuantity <= 0) {
                delete tempCartItems[product.id]
            }
            setShoppingCart(tempCartItems)
            return true
        }
        return false
    }

    /**
     * Remove the item from cart
     * @param product 
     * @returns 
     */
    function deleteItem(product: Product): boolean {
        if (product.id in shoppingCart) {
            const tempCartItems = { ...shoppingCart }
            delete tempCartItems[product.id]
            setShoppingCart(tempCartItems)
            return true
        }
        return false
    }

    /**
     * Clear the cart
     */
    function reset() {
        setShoppingCart({})
    }

    return {
        cartItems: cartItems,
        cartQuantity: cartQuantity,
        totalPrice: totalPrice,
        getItemQuantity: getItemQuantity,
        addItem: addItem,
        reduceItem: reduceItem,
        deleteItem: deleteItem,
        reset: reset,
    }
}

/**
 * Provider to for injecting shopping cart context to the children
 * components. Used in the entry point of the application.
 * @param param0 
 * @returns 
 */
export default function ShoppingCartProvider({
    children
}: ShoppingCartProviderProp) {
    const [shoppingCart, setShoppingCart] = useState<{ [productId: number]: CartItem }>({});

    return (
        <ShoppingCartContext.Provider value={{
            shoppingCart: shoppingCart,
            setShoppingCart: setShoppingCart
        }}>
            {children}
        </ShoppingCartContext.Provider>
    )
}