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
    <div className="px-8 py-8 grow flex flex-col items-center ">
      <div className="flex justify-between w-full items-center">
        <h1 className="mb-4 text-2xl">Products</h1>
        <Link to={"/products/add"}>Add Product</Link>
      </div>
      <table className="table-auto w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 font-bold uppercase border border-gray-300">
              ID
            </th>
            <th className="px-4 py-2 font-bold uppercase border border-gray-300">
              Name
            </th>
            <th className="px-4 py-2 font-bold uppercase border border-gray-300">
              Price
            </th>
            <th className="px-4 py-2 font-bold uppercase border border-gray-300">
              Description
            </th>
            <th className="px-4 py-2 font-bold uppercase border border-gray-300">
              Product Type
            </th>
            <th className="px-4 py-2 font-bold uppercase border border-gray-300">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {data.products.map((u: ProductData) => (
            <tr key={u.id} className="hover:bg-gray-100">
              <td className="px-4 py-2 border border-gray-300">{u.id}</td>
              <td className="px-4 py-2 border border-gray-300">{u.name}</td>
              <td className="px-4 py-2 border border-gray-300">{u.price}</td>
              <td className="px-4 py-2 border border-gray-300">
                {u.description}
              </td>
              <td className="px-4 py-2 border border-gray-300">
                {u.discountAmount > 0 ? (
                  <span className="text-red-500 font-bold">
                    Special ({u.discountAmount}% OFF)
                  </span>
                ) : (
                  <span className="text-green-500 font-bold">Standard</span>
                )}
              </td>
              <td className="px-4 py-2 border border-gray-300">
                <button
                  className="px-3 py-1 rounded border-2"
                  onClick={() => deleteProductCallback(u.id)}
                >
                  Delete
                </button>
                <button
                  className="px-3 py-1 rounded border-2"
                  onClick={() => navigate("/products/edit", { state: u })}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export type { ProductData };
