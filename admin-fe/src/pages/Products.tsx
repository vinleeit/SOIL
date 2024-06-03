import { useQuery, gql, useMutation } from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";

const PRODUCT_QUERY = gql`
  {
    products {
      id
      name
      description
      price
      imageURL
      discountAmount
    }
  }
`;

const DELETE_QUERY = gql`
  mutation deleteProduct($id: Int!) {
    deleteProduct(id: $id)
  }
`;

type ProductData = {
  id: number;
  name: string;
  description: string;
  price: number;
  discountAmount: number;
  imageURL: string;
};

export default function Products() {
  const { data, loading, error, refetch } = useQuery(PRODUCT_QUERY, {
    fetchPolicy: "network-only",
  });
  const [deleteProduct] = useMutation(DELETE_QUERY);
  const navigate = useNavigate();

  if (loading)
    return (
      <div className="grow flex items-center justify-center">Loading...</div>
    );
  if (error) return <pre>{error.message}</pre>;

  const deleteProductCallback = async (id: number) => {
    await deleteProduct({ variables: { id: id } });
    refetch();
  };

  return (
    <div className="px-8 py-8 grow flex flex-col items-center">
      <div className="flex mb-4 justify-between w-full">
        <h1 className="text-2xl">Product Management</h1>
        <Link
          to="/products/add"
          className="font-medium text-white hover:underline px-4 py-2 bg-black"
        >
          Add Product
        </Link>
      </div>
      <div className="overflow-x-auto border w-full">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                ID
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
              <th scope="col" className="px-6 py-3">
                Description
              </th>
              <th scope="col" className="px-6 py-3">
                Product Type
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {data.products.map((product: ProductData) => (
              <tr key={product.id}>
                <td className="px-6 py-4">{product.id}</td>
                <td className="px-6 py-4">{product.name}</td>
                <td className="px-6 py-4">{product.price}</td>
                <td className="px-6 py-4">{product.description}</td>
                <td className="px-6 py-4">
                  {product.discountAmount > 0 ? (
                    <span className="text-red-500 font-bold">
                      Special ({product.discountAmount}% OFF)
                    </span>
                  ) : (
                    <span className="text-green-500 font-bold">Standard</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => deleteProductCallback(product.id)}
                    className="font-medium text-white hover:underline px-2 py-1 bg-black mr-2"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() =>
                      navigate("/products/edit", { state: product })
                    }
                    className="font-medium text-white hover:underline px-2 py-1 bg-black"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export type { ProductData };
