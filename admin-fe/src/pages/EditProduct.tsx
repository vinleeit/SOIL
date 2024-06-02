import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useLocation, useNavigate } from "react-router-dom";

const EDIT_PRODUCT = gql`
  mutation editProduct(
    $id: Int!
    $name: String!
    $desc: String!
    $price: Float!
    $url: String!
    $discount: Float!
  ) {
    editProduct(
      id: $id
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

const EditProduct = () => {
  const { state } = useLocation();
  const [name, setName] = useState(state.name);
  const [description, setDescription] = useState(state.description);
  const [price, setPrice] = useState(state.price);
  const [imageURL, setImageURL] = useState(state.imageURL);
  const [discountAmount, setDiscountAmount] = useState(state.discountAmount);
  const navigate = useNavigate();
  const [editProduct, { loading, error }] = useMutation(EDIT_PRODUCT);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await editProduct({
      variables: {
        id: state.id,
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
    <div className="flex justify-center items-center grow">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
            Name:
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 font-bold mb-2"
          >
            Description:
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="price" className="block text-gray-700 font-bold mb-2">
            Price:
          </label>
          <input
            type="number"
            id="price"
            step="1"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="imageURL"
            className="block text-gray-700 font-bold mb-2"
          >
            Image URL:
          </label>
          <input
            type="text"
            id="imageURL"
            value={imageURL}
            onChange={(e) => setImageURL(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="discountAmount"
            className="block text-gray-700 font-bold mb-2"
          >
            Discount Amount:
          </label>
          <input
            type="number"
            id="discountAmount"
            step="1"
            value={discountAmount}
            onChange={(e) => setDiscountAmount(parseFloat(e.target.value))}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {loading ? "Updating..." : "Update Product"}
        </button>
        {error && <p className="text-red-500 mt-2">Error: {error.message}</p>}
      </form>
    </div>
  );
};

export default EditProduct;
