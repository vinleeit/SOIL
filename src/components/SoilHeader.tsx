import React, { useState } from "react"
import SoilButton from "./SoilButton"
import SoilLogo from "../components/SoilLogo"
import Menu from "../assets/menu.svg"
import Cart from "../assets/cart.svg"
import { useLocation, useNavigate } from "react-router-dom"
import { useShoppingCart } from "./ShoppingCartProvider"


export default function SoilHeader() {
    const navigate = useNavigate()
    const location = useLocation()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isBackgroundVisible, setIsBackgroundVisible] = useState(false)

    /**
     * Closes the menu if it is open whenever the route changes.
     */
    React.useEffect(() => {
        if (isMenuOpen) {
            toggleMenu(false)
        }
    }, [location])

    /**
     * Toggle the menu opend/closed.
     * @param state true means the state menu is open.
     */
    function toggleMenu(state: boolean) {
        if (!state) {
            setTimeout(() => setIsBackgroundVisible(false), 200)
        } else {
            setIsBackgroundVisible(true)
        }
        setIsMenuOpen(state)
    }

    const login = () => navigate("/login")
    const shoppingCart = () => navigate("/cart")

    var shoppingCartContext = useShoppingCart()

    return (
        <header>
            <div className="h-16">
                <nav className="flex h-full items-center justify-between px-8 border-b-2 border-lime-500">
                    <SoilLogo />
                    <ul className="space-x-2 hidden md:flex">
                        <li>
                            <SoilButton outlined>
                                Special Deals
                            </SoilButton>
                        </li>
                        <li>
                            <SoilButton onClick={shoppingCart}>
                                <span className="absolute -right-2 -top-1 bg-red-500 rounded-full h-6 w-6 text-center text-white">
                                    {shoppingCartContext.cartQuantity}
                                </span>
                                <img src={Cart} alt="" className="" />
                            </SoilButton>
                        </li>
                        <li>
                            <SoilButton onClick={login} colour="secondary">
                                Login
                            </SoilButton>
                        </li>
                    </ul>
                    <ul className="flex space-x-2 md:hidden">
                        <li>
                            <SoilButton onClick={shoppingCart}>
                                <span className="absolute -right-2 -top-1 bg-red-500 rounded-full h-6 w-6 text-center text-white">
                                    {shoppingCartContext.cartQuantity}
                                </span>
                                <img src={Cart} alt="" className="" />
                            </SoilButton>
                        </li>
                        <li>
                            <SoilButton outlined onClick={() => toggleMenu(!isMenuOpen)} >
                                <img src={Menu} alt="" />
                            </SoilButton>
                        </li>
                    </ul>
                </nav>
            </div>
            <span className="h-8 bg-lime-400 flex items-center justify-center text-sm">
                Fresh and Organic Foods for Australians!
            </span>


            <div className={`fixed top-0 w-full h-full bg-black bg-opacity-50 flex md:hidden ${isBackgroundVisible ? "visible" : "invisible"}`}>
                <div className={`relative w-full p-12 bg-white mx-auto flex-col flex transition-transform duration-200 ease-in-out ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                    <SoilLogo size="medium" vertical onClick={() => toggleMenu(false)} />
                    <div className="flex flex-col h-full justify-between">
                        <ul className="my-7 space-y-3">
                            <li>
                                <SoilButton outlined fullWidth>
                                    Special Deals
                                </SoilButton>
                            </li>
                        </ul>
                        <ul className="space-y-3">
                            <li >
                                <SoilButton fullWidth onClick={login}>
                                    Login
                                </SoilButton>
                            </li>
                            <li>
                                <SoilButton colour="secondary" fullWidth onClick={() => toggleMenu(false)}>
                                    Close
                                </SoilButton>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </header>
    )
}