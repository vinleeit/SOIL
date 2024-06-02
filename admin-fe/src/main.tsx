import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Error from "./pages/Users.tsx";

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
        element: <div>dashboard</div>,
      },
      {
        path: "/users/",
        element: <div>Users</div>,
      },
      {
        path: "/reviews/",
        element: <div>Users</div>,
      },
      {
        path: "/product/",
        element: <div>Users</div>,
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
