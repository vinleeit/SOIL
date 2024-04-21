import { Navigate, useNavigate } from "react-router-dom";
import { useShoppingCart } from "../components/ShoppingCartProvider";
import SoilButton from "../components/SoilButton";
import SoilTextField from "../components/SoilTextField";
import { FormEvent, useState } from "react";

export default function Checkout() {
  const { cartItems, totalPrice, reset } = useShoppingCart();

  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [address1, setAddress1] = useState("");
  const [address1Error, setAddress1Error] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [cityError, setCityError] = useState("");
  const [state, setState] = useState("");
  const [stateError, setStateError] = useState("");
  const [country, setCountry] = useState("");
  const [countryError, setCountryError] = useState("");
  const [postcode, setPostCode] = useState("");
  const [postcodeError, setPostCodeError] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardNumberError, setCardNumberError] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardExpiryError, setCardExpiryError] = useState("");
  const [cvc, setCvc] = useState("");
  const [cvcError, setCvcError] = useState("");

  if (cartItems.length == 0) {
    return <Navigate to={"/"} />;
  }

  function isValidCreditCardNumber(cardNumber: string): boolean {
    const nums = [0, ...cardNumber.split("").map((e) => Number.parseInt(e))];
    let isEven = true;
    const result = nums.reduce((sum, num) => {
      if (isEven) {
        num *= 2;
        if (num >= 10) {
          let tempSum = 0;
          while (num) {
            tempSum += num % 10;
            num = Math.floor(num / 10);
          }
          num = tempSum;
        }
      }
      isEven = !isEven;
      return sum + num;
    });
    return result % 10 == 0;
  }

  function submitPurchase(event: FormEvent<HTMLFormElement>): void {
    event?.preventDefault();
    let isValid = true;
    if (name.length == 0) {
      setNameError("Name is required");
      isValid = false;
    } else if (nameError.length > 0) {
      setNameError("");
    }

    if (phoneNumber.length == 0) {
      setPhoneNumberError("Phone number is required");
      isValid = false;
    } else if (phoneNumber.length > 0) {
      setPhoneNumberError("");
    }

    if (email.length == 0) {
      setEmailError("Email is required");
      isValid = false;
    } else if (email.length > 0) {
      setEmailError("");
    }

    if (address1.length == 0) {
      setAddress1Error("Address 1 is required");
      isValid = false;
    } else if (address1.length > 0) {
      setAddress1Error("");
    }

    if (city.length == 0) {
      setCityError("City is required");
      isValid = false;
    } else if (cityError.length > 0) {
      setCityError("");
    }

    if (state.length == 0) {
      setStateError("State is required");
      isValid = false;
    } else if (stateError.length > 0) {
      setStateError("");
    }

    if (country.length == 0) {
      setCountryError("Country is required");
      isValid = false;
    } else if (countryError.length > 0) {
      setCountryError("");
    }

    if (postcode.length == 0) {
      setPostCodeError("Postcode is required");
      isValid = false;
    } else if (postcodeError.length > 0) {
      setPostCodeError("");
    }

    if (cardNumber.length == 0) {
      setCardNumberError("Card number is required");
      isValid = false;
    } else if (!isValidCreditCardNumber(cardNumber)) {
      setCardNumberError("Invalid card number");
      isValid = false;
    } else if (cardNumberError.length > 0) {
      setCardNumberError("");
    }

    if (cardExpiry.length == 0) {
      setCardExpiryError("Card expiry is required");
      isValid = false;
    } else if (!cardExpiry.match(/^\d{1,2}\/\d{1,2}$/g)) {
      setCardExpiryError("Invalid expiry format");
      isValid = false;
    } else {
      const dt = cardExpiry.split("/").map((e) => Number.parseInt(e));
      const date = new Date(
        dt[1] >= 75 ? 1900 + dt[1] : 2000 + dt[1],
        dt[0] - 1,
      );
      if (Date.now() > date.setHours(0, 0, 0, 0)) {
        setCardExpiryError("Expired card");
        isValid = false;
      } else if (cardExpiry.length > 0) {
        setCardExpiryError("");
      }
    }

    if (cvc.length == 0) {
      setCvcError("CVC is required");
      isValid = false;
    } else if (cvcError.length > 0) {
      setCvcError("");
    }

    if (isValid) {
      navigate("/summary", {
        state: {
          name: name,
          phoneNumber: phoneNumber,
          email: email,
          address1: address1,
          address2: address2,
          city: city,
          state: state,
          country: country,
          postcode: postcode,
          cardNumber: cardNumber,
          items: cartItems,
          totalPrice: totalPrice,
        },
      });
      reset();
    }
  }

  return (
    <section>
      <form
        onSubmit={submitPurchase}
        className="flex flex-col grow lg:w-2/3 px-10 py-20 lg:mx-auto space-y-8"
      >
        <p className="text-3xl">Checkout</p>
        <div className="flex flex-col shadow-md rounded-lg border p-3 lg:p-5 space-y-5">
          <p className="text-2xl">Items</p>
          {cartItems.map((e) => {
            return (
              <div
                key={e.product.id}
                className="flex flex-col lg:flex-row w-full p-5 rounded-md border justify-between"
              >
                <p>{e.product.title}</p>
                <div className="flex justify-between lg:space-x-8">
                  <p>
                    ${e.product.price} x {e.quantity}
                  </p>
                  <p className="font-bold">
                    ${(e.product.price * e.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            );
          })}
          <div className="flex flex-row w-full p-5 rounded-md border justify-end space-x-8">
            <p>Total:</p>
            <p className="font-bold">${totalPrice.toFixed(2)}</p>
          </div>
        </div>

        <div className="flex flex-col border shadow-md rounded-md p-3 lg:p-5 space-y-5">
          <p className="text-2xl">Basic Details</p>
          <div className="flex flex-col space-y-2">
            <SoilTextField
              value={name}
              label="Name"
              placeholder="Soil"
              onChange={(e) => setName(e.target.value)}
              errMsg={nameError}
            ></SoilTextField>
            <SoilTextField
              value={phoneNumber}
              label="Phone Number"
              placeholder="+0000000000"
              onChange={(e) => {
                const value = e.target.value;
                if (value.match(/^\+{0,1}(\d{0,})$/g)) {
                  setPhoneNumber(value);
                }
              }}
              errMsg={phoneNumberError}
            ></SoilTextField>
            <SoilTextField
              value={email}
              label="Email"
              placeholder="example@soil.com"
              onChange={(e) => setEmail(e.target.value)}
              errMsg={emailError}
            ></SoilTextField>
          </div>
        </div>

        <div className="flex flex-col border shadow-md rounded-md p-3 lg:p-5 space-y-5">
          <p className="text-2xl">Shipping</p>
          <div className="flex flex-col space-y-2">
            <SoilTextField
              value={address1}
              label="Address 1"
              placeholder="Address 1"
              onChange={(e) => setAddress1(e.target.value)}
              errMsg={address1Error}
            ></SoilTextField>
            <SoilTextField
              value={address2}
              label="Address 2"
              placeholder="Address 2"
              onChange={(e) => setAddress2(e.target.value)}
            ></SoilTextField>
            <div className="flex flex-col lg:flex-row lg:space-x-2 space-y-2 lg:space-y-0">
              <div className="flex space-x-2 grow">
                <SoilTextField
                  value={city}
                  label="City"
                  placeholder="City"
                  onChange={(e) => setCity(e.target.value)}
                  errMsg={cityError}
                ></SoilTextField>
                <SoilTextField
                  value={state}
                  label="State"
                  placeholder="State"
                  onChange={(e) => setState(e.target.value)}
                  errMsg={stateError}
                ></SoilTextField>
              </div>
              <div className="flex space-x-2 grow">
                <SoilTextField
                  value={country}
                  label="Country"
                  placeholder="Country"
                  onChange={(e) => setCountry(e.target.value)}
                  errMsg={countryError}
                ></SoilTextField>
                <SoilTextField
                  value={postcode}
                  label="Postcode"
                  placeholder="0000"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.match(/\d*/g)) {
                      setPostCode(value);
                    }
                  }}
                  errMsg={postcodeError}
                ></SoilTextField>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col border shadow-md rounded-md p-3 lg:p-5 space-y-5">
          <p className="text-2xl">Payment</p>
          <div className="flex flex-col space-y-2">
            <SoilTextField
              value={cardNumber}
              label="Credit/Debit Card Number"
              placeholder="0000 0000 0000 0000"
              onChange={(e) => {
                const value = e.target.value;
                if (value.match(/^\d*$/g)) {
                  setCardNumber(value);
                }
              }}
              errMsg={cardNumberError}
            ></SoilTextField>
            <div className="flex items-center space-x-2">
              <SoilTextField
                value={cardExpiry}
                label="Card Expiry"
                placeholder="mm/yy"
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.match(/^((\d{0,2}\/\d{0,2}){0,1}|(\d{0,2}))$/g)) {
                    setCardExpiry(value.replace(/(^\d{2}$)/g, "$1/"));
                  }
                }}
                errMsg={cardExpiryError}
              ></SoilTextField>
              <SoilTextField
                value={cvc}
                label="CVC"
                placeholder="000"
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.match(/^\d{0,4}$/g)) {
                    setCvc(value);
                  }
                }}
                errMsg={cvcError}
              ></SoilTextField>
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <SoilButton>Complete Purchase</SoilButton>
          <SoilButton colour="secondary" onClick={() => navigate("/cart")}>
            Cancel
          </SoilButton>
        </div>
      </form>
    </section>
  );
}
