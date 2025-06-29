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
import Game from './routes/game';
import App from "./App";
import "./index.css";

import CreateGameModal from "./routes/create-join/CreateGameModal";
import JoinGameModal from "./routes/create-join/JoinGameModal";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    action: loginAction,
    children: [
      // { index: true, element: <App /> },
      { path: "create-game", element: <CreateGameModal /> }, // Modal-style route
      { path: "join-game", element: <JoinGameModal /> },     // Modal-style route
      { path: "join-game/:id", element: <JoinGameModal /> }, // Deep link with ID
    ],
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
  {
    path: "/game/:id",
    element: <Game />,
    loader: async () => {
      return null;
    },
  },
]);

import "./App.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
