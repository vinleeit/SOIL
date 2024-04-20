import { createContext, ReactNode, useContext, useState } from "react"
import { CartItem } from "../models/CartItem";
import { Product } from "../models/Product";

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

export function useShoppingCart(): ShoppingCartHookProp {
    var { shoppingCart, setShoppingCart } = useContext(ShoppingCartContext)

    var cartItems = Object.values(shoppingCart)
    var cartQuantity = cartItems.reduce((quantity, item) => quantity + item.quantity, 0)
    var totalPrice = cartItems.reduce((price, item) => price + (item.product.price * item.quantity), 0)

    function getItemQuantity(product: Product): number {
        if (product.id in shoppingCart) {
            return shoppingCart[product.id].quantity
        }
        return 0
    }

    function addItem(product: Product) {
        var tempCartItems = { ...shoppingCart }
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

    function reduceItem(product: Product): boolean {
        if (product.id in shoppingCart) {
            var tempCartItems = { ...shoppingCart }
            var modifiedQuantity = --tempCartItems[product.id].quantity
            if (modifiedQuantity <= 0) {
                delete tempCartItems[product.id]
            }
            setShoppingCart(tempCartItems)
            return true
        }
        return false
    }

    function deleteItem(product: Product): boolean {
        if (product.id in shoppingCart) {
            var tempCartItems = { ...shoppingCart }
            delete tempCartItems[product.id]
            setShoppingCart(tempCartItems)
            return true
        }
        return false
    }

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