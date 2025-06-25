import { useEffect } from "react";
import socket from "../../../shared/socket";
import { Board, Token } from "../../../shared/GameModel";

const useGameSession = ({ setGameCode, setPlayer, setBoard, setGameStarted, setGameHydrated }) => {
  const restoreSession = () => {
    const username = localStorage.getItem("username");
    const gameCode = localStorage.getItem("gameCode");

    if (username && gameCode) {
      console.log("🌱 Attempting rejoin...");
      setGameHydrated(true); // Block UI until rejoin finishes
      socket.emit("rejoinGame", { username, gameCode });
    }
  };

  useEffect(() => {
    if (socket.connected) {
      restoreSession();
    } else {
      socket.on("connect", restoreSession);
    }

    socket.on("gameResumed", (data) => {
      console.log("Game resumed:", data);
      setGameCode(data.gameCode);
      setPlayer(data.color);
      setBoard(new Board(data.boardState));
      setGameStarted(false);
      setGameHydrated(false);

      socket.emit("requestBoardState", data.gameCode);
    });

    socket.on("rejoinFailed", (msg) => {
      console.warn("Rejoin failed:", msg);
      localStorage.removeItem("username");
      localStorage.removeItem("gameCode");
      setGameHydrated(false);
    });

    return () => {
      socket.off("connect", restoreSession);
      socket.off("gameResumed");
      socket.off("rejoinFailed");
    };
  }, []);
};


export default useGameSession;
