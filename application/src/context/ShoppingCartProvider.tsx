import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { CartItem } from "../types/CartItem"
import { GetProductPrice, Product } from "../types/Product"
import { AuthContext, AuthContextValue } from "./AuthContext"
import { serviceAddCartProduct, serviceDeleteCartProduct, serviceGetCart, serviceUpdateCartProduct } from "../shared/services/StoreService"

// TODO(cart): add error and loading
// ALERT(cart): cart will not reload on refresh, only when website is opened for the first time and when auth change
type ShoppingCartContext = {
    shoppingCart: Map<number, CartItem>
    setShoppingCart: (shoppingCart: Map<number, CartItem>) => void
}

type ShoppingCartProviderProp = {
    children: ReactNode
}

type ShoppingCartHookProp = {
    cartItems: CartItem[]
    cartQuantity: number
    totalPrice: number
    getItemQuantity: (product: Product) => number
    addItem: (product: Product) => Promise<string | null>
    reduceItem: (product: Product) => Promise<string | null>
    deleteItem: (product: Product) => Promise<string | null>
    reset: () => void
}


const ShoppingCartContext = createContext({} as ShoppingCartContext)

/**
 * Cart custom hook.
 * @returns 
 */
export function useShoppingCart(): ShoppingCartHookProp {
    const { shoppingCart, setShoppingCart } = useContext(ShoppingCartContext)

    const cartItems = [...shoppingCart.values()]
    const cartQuantity = cartItems.reduce((quantity, item) => quantity + item.quantity, 0)
    const totalPrice = cartItems.reduce((price, item) => price + (GetProductPrice(item.product) * item.quantity), 0)

    const { token } = useContext(
        AuthContext,
    ) as AuthContextValue

    /**
     * Get the number of item in the cart.
     * @param product 
     * @returns 
     */
    function getItemQuantity(product: Product): number {
        if (shoppingCart.has(product.id)) {
            return shoppingCart.get(product.id)!.quantity
        }
        return 0
    }

    /**
     * Increase the item number by 1
     * @param product 
     */
    async function addItem(
        product: Product,
    ): Promise<string | null> {
        const tempCartItems = new Map(shoppingCart)

        if (token) {
            const error = await serviceAddCartProduct(
                token,
                {
                    productId: product.id,
                    quantity: 1,
                }
            )
            if (error) {
                return error
            }
        }

        if (tempCartItems.has(product.id)) {
            tempCartItems.get(product.id)!.quantity++
        } else {
            tempCartItems.set(product.id, {
                id: 0,
                userId: 0,
                quantity: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
                productId: product.id,
                product: product,
            })
        }
        setShoppingCart(tempCartItems)
        return null
    }

    /**
     * Decrease the item number by 1
     * @param product 
     * @returns 
     */
    async function reduceItem(product: Product): Promise<string | null> {
        if (shoppingCart.has(product.id)) {
            if (token) {
                const error = await serviceAddCartProduct(
                    token,
                    {
                        productId: product.id,
                        quantity: -1,
                    }
                )
                if (error) {
                    return error
                }
            }
            const tempCartItems = new Map(shoppingCart)
            const modifiedQuantity = --tempCartItems.get(product.id)!.quantity
            if (modifiedQuantity <= 0) {
                tempCartItems.delete(product.id)
            }
            setShoppingCart(tempCartItems)
        }
        return null
    }

    /**
     * Remove the item from cart
     * @param product 
     * @returns 
     */
    async function deleteItem(product: Product): Promise<string | null> {
        if (shoppingCart.has(product.id)) {
            if (token) {
                const error = await serviceDeleteCartProduct(
                    token,
                    product.id,
                )
                if (error) {
                    return error
                }
            }
            const tempCartItems = new Map(shoppingCart)
            tempCartItems.delete(product.id)
            setShoppingCart(tempCartItems)
        }
        return null
    }

    /**
     * Clear the cart
     */
    async function reset(): Promise<string | null> {
        if (token) {
            const deletedProductIds: number[] = []
            for (const productId of shoppingCart.keys()) {
                const error = await serviceDeleteCartProduct(
                    token,
                    productId,
                )
                if (error) {
                    const tempCartItems = new Map(shoppingCart)
                    deletedProductIds.forEach((e) => tempCartItems.delete(e))
                    setShoppingCart(tempCartItems)
                    return error
                } else {
                    deletedProductIds.push(productId)
                }
            }
        }
        setShoppingCart(new Map())
        return null
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
    const [shoppingCart, setShoppingCart] = useState<Map<number, CartItem>>(new Map())

    const { token } = useContext(
        AuthContext,
    ) as AuthContextValue

    useEffect(() => {
        const fetchCart = async () => {
            if (token) {
                const [cart, _] = await serviceGetCart(token)
                if (cart) {
                    const tempCart = new Map(shoppingCart)
                    tempCart.forEach((v, k) => {
                        if (cart.has(k)) {
                            if (cart.get(k)?.quantity != v.quantity) {
                                // Remote cart has item but quantity is not the same
                                // Remote cart will follow local quantity
                                // It is expected that the local quantity is the newest desired
                                serviceUpdateCartProduct(
                                    token,
                                    k,
                                    { quantity: v.quantity }
                                )
                            }
                        } else {
                            // Remote cart does not have item
                            // Item will be added to remote
                            // It is assumed that new item is intended
                            serviceAddCartProduct(token, { productId: k, quantity: v.quantity })
                        }
                    })

                    cart.forEach((v, k) => {
                        if (!tempCart.has(k)) {
                            // Add every remote item to local if not exists
                            tempCart.set(k, v)
                        }
                    })
                    setShoppingCart(tempCart)
                }
            } else {
                setShoppingCart(new Map())
            }
        }

        fetchCart()
    }, [token])

    return (
        <ShoppingCartContext.Provider value={{
            shoppingCart: shoppingCart,
            setShoppingCart: setShoppingCart
        }}>
            {children}
        </ShoppingCartContext.Provider>
    )
}