import SoilButton from "../components/SoilButton";
import { Link, useNavigate } from "react-router-dom";
import { useShoppingCart } from "../components/ShoppingCartProvider";
import Trash from "../assets/trash.svg";

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
  // TODO: Remove commented lines
  // var cartItems: CartItem[] = [
  //     {
  //         product: GetProducts()[0],
  //         quantity: 1,
  //     }
  // ]
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
              <div className="flex shadow-md border-t-2">
                <img
                  src={e.product.photoUrl}
                  alt=""
                  className="w-24 object-cover"
                />
                <div className="flex flex-col p-5 space-y-3 grow">
                  <div className="flex flex-col space-y-1">
                    <div className="flex">
                      {e.product.isSpecial ? (
                        <p className="px-5 py-1 bg-red-100 text-red-800  rounded-md ">
                          Special
                        </p>
                      ) : (
                        <></>
                      )}
                    </div>
                    <p>{e.product.title}</p>
                    <p className="font-bold">
                      ${(e.product.price * e.quantity).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center w-full">
                    <div className="flex items-center space-x-3 grow">
                      <SoilButton
                        outlined
                        onClick={() => reduceItem(e.product)}
                      >
                        -
                      </SoilButton>
                      <p>{itemInCardQuantity}</p>
                      <SoilButton outlined onClick={() => addItem(e.product)}>
                        +
                      </SoilButton>
                    </div>
                    {itemInCardQuantity > 0 ? (
                      <div className="">
                        <Link
                          to={""}
                          onClick={() => deleteItem(e.product)}
                          className="text-red-600"
                        >
                          <img src={Trash} alt="" />
                        </Link>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
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

