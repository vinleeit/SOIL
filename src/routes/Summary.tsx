import { useNavigate, useLocation, Navigate } from "react-router-dom";
import SoilButton from "../components/SoilButton";
import SoilTextField from "../components/SoilTextField";
import { CartItem } from "../models/CartItem";
import CheckoutSection from "../components/CheckoutSection";
import { GetProductPrice } from "../models/Product";

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  if (!location.state) {
    return <Navigate to={"/"} />;
  }

  return (
    <section className="flex flex-col grow lg:w-2/3 px-10 py-20 lg:mx-auto space-y-8">
      <p className="text-3xl">Purchase Summary</p>
      <CheckoutSection title="Items">
        {(location.state.items as CartItem[]).map((e) => {
          return (
            <div className="flex flex-col lg:flex-row w-full p-5 rounded-md border justify-between">
              <p>{e.product.title}</p>
              <div className="flex justify-between lg:space-x-8">
                <p>
                  ${GetProductPrice(e.product).toFixed(2)} x {e.quantity}
                </p>
                <p className="font-bold">
                  ${(GetProductPrice(e.product) * e.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          );
        })}
        <div className="flex flex-row w-full p-5 rounded-md border justify-end space-x-8">
          <p>Total:</p>
          <p className="font-bold">
            ${(location.state.totalPrice as number).toFixed(2)}
          </p>
        </div>
      </CheckoutSection>

      <CheckoutSection title="Basic Details">
        <div className="flex flex-col space-y-2">
          <SoilTextField
            disabled
            value={location.state.name}
            label="Name"
          ></SoilTextField>
          <SoilTextField
            disabled
            value={location.state.phoneNumber}
            label="Phone Number"
          ></SoilTextField>
          <SoilTextField
            disabled
            value={location.state.email}
            label="Email"
          ></SoilTextField>
        </div>
      </CheckoutSection>

      <CheckoutSection title="Shipping">
        <div className="flex flex-col space-y-2">
          <SoilTextField
            disabled
            value={location.state.address1}
            label="Address 1"
          ></SoilTextField>
          <SoilTextField
            disabled
            value={location.state.address2}
            label="Address 2"
          ></SoilTextField>
          <div className="flex flex-col lg:flex-row lg:space-x-2 space-y-2 lg:space-y-0">
            <div className="flex space-x-2 grow">
              <SoilTextField
                disabled
                value={location.state.city}
                label="City"
              ></SoilTextField>
              <SoilTextField
                disabled
                value={location.state.state}
                label="State"
              ></SoilTextField>
            </div>
            <div className="flex space-x-2 grow">
              <SoilTextField
                disabled
                value={location.state.country}
                label="Country"
              ></SoilTextField>
              <SoilTextField
                disabled
                value={location.state.postcode}
                label="Postcode"
              ></SoilTextField>
            </div>
          </div>
        </div>
      </CheckoutSection>

      <div className="flex flex-col space-y-2">
        <SoilButton onClick={() => navigate("/")}>Home</SoilButton>
      </div>
    </section>
  );
}

