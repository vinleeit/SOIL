import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";

const ADD_PRODUCT = gql`
  mutation addProduct(
    $name: String!
    $desc: String!
    $price: Float!
    $url: String!
    $discount: Float!
  ) {
    addProduct(
      name: $name
      description: $desc
      price: $price
      imageURL: $url
      discountAmount: $discount
    ) {
      id
    }
  }
`;
const AddProduct = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [imageURL, setImageURL] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const navigate = useNavigate();
  const [addProduct, { loading, error }] = useMutation(ADD_PRODUCT);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addProduct({
      variables: {
        name,
        desc: description,
        price: parseFloat(price.toString()),
        url: imageURL,
        discount: parseFloat(discountAmount.toString()),
      },
    });
    navigate("/products");
  };

  return (
    <div className="px-8 py-8 grow flex flex-col items-center">
      <form onSubmit={handleSubmit} className="w-full max-w-lg">
        <h1 className="text-2xl py-8">Add Product</h1>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3 mb-6 md:mb-0">
            <label
              htmlFor="name"
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label
              htmlFor="description"
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            ></textarea>
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              htmlFor="price"
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            >
              Price
            </label>
            <input
              type="number"
              id="price"
              step="1"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
              required
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            />
          </div>
          <div className="w-full md:w-1/2 px-3">
            <label
              htmlFor="discountAmount"
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            >
              Discount Amount
            </label>
            <input
              type="number"
              id="discountAmount"
              step="1"
              value={discountAmount}
              onChange={(e) => setDiscountAmount(parseFloat(e.target.value))}
              required
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label
              htmlFor="imageURL"
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            >
              Image URL
            </label>
            <input
              type="text"
              id="imageURL"
              value={imageURL}
              onChange={(e) => setImageURL(e.target.value)}
              required
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </div>
        {error && <p className="text-red-500 mt-2">Error: {error.message}</p>}
      </form>
    </div>
  );
};

export default AddProduct;
