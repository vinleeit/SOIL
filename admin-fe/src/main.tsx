import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Error from "./pages/Users.tsx";
import Users from "./pages/Users.tsx";
import Reviews from "./pages/Reviews.tsx";
import Products from "./pages/Products.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import AddProduct from "./pages/AddProduct.tsx";
import EditProduct from "./pages/EditProduct.tsx";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",

  cache: new InMemoryCache(),
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/users/",
        element: <Users></Users>,
      },
      {
        path: "/reviews/",
        element: <Reviews />,
      },
      {
        path: "/products/",
        children: [
          {
            path: "",
            element: <Products />,
          },
          {
            path: "add",
            element: <AddProduct />,
          },
          {
            path: "edit",
            element: <EditProduct />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <RouterProvider router={router} />
    </ApolloProvider>
  </React.StrictMode>,
);
