import SoilButton from "../components/SoilButton";
import { useNavigate } from "react-router-dom";
import { useShoppingCart } from "../context/ShoppingCartProvider";
import SoilCartCard from "../components/SoilCartCard";

export default function ShoppingCart() {
  const navigate = useNavigate();
  const {
    cartItems,
    totalPrice,
    getItemQuantity,
    addItem,
    reduceItem,
    deleteItem,
  } = useShoppingCart();
  return (
    <div className="flex flex-col grow items-center">
      <div
        className={`flex flex-col relative grow px-10 py-20 lg:w-2/3 ${cartItems.length == 0 ? "" : "space-y-8"}`}
      >
        <p className="text-3xl">Cart</p>
        {cartItems.length == 0 ? (
          <div className="flex flex-col justify-center grow items-center">
            <div className="border p-8 rounded-md">
              <p className="text-2xl">Wow, look at the emptiness!</p>
              <p>Start planting something into the cart</p>
              <div className="flex justify-end mt-5">
                <SoilButton outlined onClick={() => navigate("/")}>
                  Start Planting
                </SoilButton>
              </div>
            </div>
          </div>
        ) : (
          cartItems.map((e) => {
            const itemInCardQuantity = getItemQuantity(e.product);
            return (
              <SoilCartCard
                key={e.product.id}
                cartItem={e}
                itemInCardQuantity={itemInCardQuantity}
                onAddItem={addItem}
                onReduceItem={reduceItem}
                onDeleteItem={deleteItem}
              />
            );
          })
        )}
        <div className="flex float p-5 shadow-md border-t-2 rounded-md bg-white justify-between lg:justify-end items-center space-x-5">
          <p className="font-bold">Total: ${totalPrice.toFixed(2)}</p>
          <SoilButton
            disabled={cartItems.length == 0}
            onClick={
              cartItems.length == 0
                ? undefined
                : () => {
                  navigate("/checkout");
                }
            }
          >
            Checkout
          </SoilButton>
        </div>
      </div>
    </div>
  );
}
