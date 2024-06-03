import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Error from "./pages/Users.tsx";
import Users from "./pages/Users.tsx";
import Reviews from "./pages/Reviews.tsx";
import Products from "./pages/Products.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import AddProduct from "./pages/AddProduct.tsx";
import EditProduct from "./pages/EditProduct.tsx";
import {
  ApolloClient,
  InMemoryCache,
  split,
  HttpLink,
  ApolloProvider,
} from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";

const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql", // Replace with your GraphQL server URL
});

const wsLink = new WebSocketLink({
  uri: "ws://localhost:4000/graphql", // Replace with your GraphQL WebSocket URL
  options: {
    reconnect: true,
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link: splitLink,
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
