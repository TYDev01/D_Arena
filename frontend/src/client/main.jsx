import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  redirect,
} from "react-router-dom";

import { LoginPage } from "./routes/login"
import { loginAction } from "./routes/loginAction";
import ErrorPage from "./error-page";
import Browser from "./routes/browser";
import App from "./App";
import "./index.css";




const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    action: loginAction,
    loader: async () => {
      return null;
    }
  },
  {
    path: "/browser",
    element: <Browser />,
    loader: async () => {
      // console.log("Fetching data");
      const storedUsername = localStorage.getItem("username");
      if(storedUsername === ''){
        return redirect('/')
      }
      return {io: io()};
    },
  },
]);

import "./App.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
