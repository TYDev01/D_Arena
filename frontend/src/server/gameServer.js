// import { app, io, server } from "./main"
import {
  indexToPosition,
  positionToIndex,
  isLegalMove,
  tokenAt,
  makeMove,
} from "../shared/GameController.js";
import { Token, Board } from "../shared/GameModel.js";
import {
  joinGameCon,
  createGameCon,
  declareDrawCon,
  triggerTimeoutRefundCon,
  declareWinnerCon,
} from "../contract/interact.js";
import {notifyDiscord} from "./notifyDiscord.js"

import Decimal from "decimal.js";

function joinGame(gameCode, socket, username, games, io) {
  if (!(username || gameCode) || username.trim() === ("" || undefined)) {
    return socket.emit("gameJoinError", gameCode, "Incomplete input");
  }
  socket.username = username;
  console.log("Joining Game:", gameCode, "username:", username);

  if (!games[gameCode]) {
    console.log("Game does not exist", gameCode);
    socket.emit("gameJoinError", gameCode, "Game does not exist");
    return;
  }
  // if less than two players, join game
  if (games[gameCode].players.length < games[gameCode].maxPlayers) {
    console.log("player0:", username, " joining game:", gameCode);
    if (games[gameCode].players[0] === username) {
      console.log("already in game");
      socket.emit("alreadyInGame");
      return;
    }
    games[gameCode].players.push(username);
    // console.log(games[gameCode].players)
    socket.gameCode = gameCode; // legal?

    // tell user they successfully joined
    socket.join(gameCode);
    socket.emit("gameJoined", gameCode);

    // Start the game if it is full!
    if (games[gameCode].players.length == games[gameCode].maxPlayers) {
      console.log("Starting game", gameCode);
      // Tell the other player they are red
      socket.to(gameCode).emit("gameStarted", "r", gameCode);
      socket.emit("gameStarted", "b", gameCode);
    }
  } else {
    // tell user the game is full
    socket.join(gameCode);
    socket.emit("gameJoined", gameCode);
    socket.emit("gameStarted", "s");
    socket.emit(
      "board",
      games[gameCode].board.boardState,
      games[gameCode].board.currentPlayer,
      games[gameCode].board.onlyMove
    );
  }
}

export default function ioHandler(io) {
  const games = {}; // hold all our games
  io.on("connection", (socket) => {
    console.log("A user connected to the socket");

    // Game Joining
    socket.on("createGame", (username, stakeAmt) => {
      let gameCode =
        "#CHECKERS-" + Math.round(Math.random() * 99998 + 1).toString();
      console.log(
        "Creating game request from id",
        socket.id,
        "and game code",
        gameCode,
        " username ",
        username,
        "stakeAmt ",
        stakeAmt
      );
      socket.username = username;
      if (games[gameCode]) {
        socket.emit(
          "gameJoinError",
          gameCode,
          "You rolled the one in a million and that game already exists. Try again."
        );
        return;
      }

      // Create the game
      games[gameCode] = {
        players: [],
        playersData: {},
        maxPlayers: 2,
        board: new Board(),
        sockets: [],
        disconnected: null,
        disconnectTimeout: null,
      };

      socket.emit("sendGameData", gameCode, stakeAmt, username);
      notifyDiscord(gameCode, stakeAmt)
      // joinGame(gameCode, socket, username, games, io);
    });

    socket.on("verifyGameCode", (gameCode) => {
      console.log("Verifying Code:", gameCode);
      if (games[gameCode]) {
        socket.emit("validGameCode", gameCode, true);
      } else {
        socket.emit("validGameCode", gameCode, false);
      }
    });

    socket.on("joinGame", (gameCode, username, stakeAmt, addr) => {
      if (!(gameCode && username && stakeAmt && addr))
        return console.log("Send complete data");
      console.log("got join game request", username, gameCode);
      if (gameCode == 69420 && !games[gameCode]) {
        games[gameCode] = {
          players: [],
          playersData: {},
          maxPlayers: 2,
          board: new Board(69420),
        };
      }

      games[gameCode].playersData[username] = { addr, stake: stakeAmt };

      joinGame(gameCode, socket, username, games, io);
    });

    socket.on("getOpp", (gameCode) => {
      // console.log(games[gameCode]);

      const players = games[gameCode].players;
      const opp = players[0];
      const oppStake = games[gameCode].playersData[opp].stake;

      console.log("players:", players, "oppStake:", oppStake, "opp:", opp);
      socket.emit("opponent", opp, oppStake);
    });

    socket.on("getTotalStake", (gameCode) => {
      console.log("gameCode:", gameCode);

      if (!games[gameCode]?.players) {
        return socket.emit("gameJoinError", gameCode, "Expired Game");
      }

      let total = new Decimal(0);
      const list = games[gameCode].players;
      const allData = games[gameCode].playersData;

      for (let player of list) {
        const stake = new Decimal(allData[player]?.stake || 0);
        total = total.plus(stake);
      }

      // Format if needed (e.g., to 6 decimal places)
      const formattedTotal = total.toFixed(6); // You can adjust precision here

      socket.emit("setTotalStake", total);
    });

    socket.on("requestBoardState", (gameCode) => {
      const game = games[gameCode];
      if (!game) return;

      const boardState = game.board.boardState.map(
        (token) => token && token.toObject()
      );
      const currentPlayer = game.board.currentPlayer;
      const onlyMove = game.board.onlyMove;
      const captCount = game.board.captureCount;

      socket.emit("board", boardState, currentPlayer, onlyMove, captCount);
    });

    // Rebrodcast count update to relevant sockets (except the one it came from)
    socket.on("count", (gameCode, count) => {
      socket.to(gameCode).emit("count", count);
    });

    socket.on("getPlayersDict", (gameCode) => {
      if (!games[gameCode]?.players) {
        return socket.emit("gameJoinError", gameCode, "Invalid game code");
      }
      const players = games[gameCode].players;

      const usernameDict = {
        b: players[0],
        r: players[1],
      };
      socket.emit("setUsernameDict", usernameDict);
    });

    // socket.on("disconnect", () => {
    //   let gameCode = socket.gameCode;
    //   console.log("Handling disconnect, gameCode", gameCode);
    //   if (gameCode && games[gameCode]) {
    //     const index = games[gameCode].players.indexOf(socket.username);
    //     if (index > -1) {
    //       socket.leave(gameCode);
    //       io.to(gameCode).emit("gameOver", "Other user disconnected");
    //       delete games[gameCode];
    //       console.log("Player left game ", gameCode);
    //     } else {
    //       console.log(
    //         "Player id",
    //         socket.id,
    //         "attempted to leave game they were not in ",
    //         gameCode
    //       );
    //     }
    //   }
    // });

    socket.on("disconnect", () => {
      const gameCode = socket.gameCode;
      const username = socket.username;

      if (
        !gameCode ||
        games[gameCode] ||
        !username ||
        gameCode === "" ||
        username === ""
      ) {
        return socket.emit("gameJoinError", gameCode, "Something went wrong");
      }

      console.log("Disconnected:", username, gameCode);

      games[gameCode].disconnected = username;

      // Start grace period
      const timeout = setTimeout(() => {
        console.log("Grace period expired. Deleting game", gameCode);
        delete games[gameCode];
        io.to(gameCode).emit("gameOver", "player did not reconnect in time.");
      }, 60000);

      games[gameCode].disconnectTimeout = timeout;
    });

    socket.on("rejoinGame", ({ username, gameCode }) => {
      console.log("Rejoin request:", username, gameCode);

      const game = games[gameCode];
      // console.log(game);

      // Check if game exists and username was a participant
      if (!game || !game.players.includes(username)) {
        socket.emit(
          "rejoinFailed",
          "Game not found or username not part of game."
        );
        return;
      }

      // Reassociate this new socket with the game
      console.log("disconnectTimeout:", game.disconnectTimeout);
      clearTimeout(game.disconnectTimeout);
      socket.username = username;
      socket.gameCode = gameCode;
      socket.join(gameCode);

      // Determine player color
      const color = game.players[0] === username ? "b" : "r";
      console.log("player:", username, "gameCode:", gameCode, "color:", color);

      // Send game state back to the reconnecting player
      socket.emit("gameResumed", {
        gameCode,
        color,
        boardState: game.board.boardState,
        currentPlayer: game.board.currentPlayer,
        onlyMove: game.board.onlyMove,
        players: game.players,
      });
      console.log(
        "Details:",
        gameCode,
        color,
        // game.board.boardState,
        game.board.currentPlayer,
        game.board.onlyMove,
        game.players
      );

      console.log(`Player ${username} resumed game ${gameCode}`);
    });

    socket.on("gameboard", () => {
      // Send full game board on request
      let gameCode = socket.gameCode;
      socket.emit(
        "board",
        games[gameCode].board.boardState,
        games[gameCode].board.currentPlayer
      );
    });

    socket.on("makemove", async (msg) => {
      let gameCode = socket.gameCode;
      if (!games[gameCode]) {
        console.log("Invalid game code:", gameCode);
        return;
      }
      console.log("got makemove", msg);
      // When sent a move, update the board and send new board accordingly
      const token = tokenAt(games[gameCode].board, msg.oldRow, msg.oldCol);
      if (token) {
        games[gameCode].board = makeMove(games[gameCode].board, token, [
          msg.newRow,
          msg.newCol,
        ]);
      } else {
        console.log("Move selected an invalid piece");
      }

      console.log(
        "Sending board for game ",
        gameCode,
        "only move ",
        games[gameCode].board.onlyMove
      );
      io.to(gameCode).emit(
        "board",
        games[gameCode].board.boardState,
        games[gameCode].board.currentPlayer,
        games[gameCode].board.onlyMove,
        games[gameCode].board.captureCount
      );

      if (games[gameCode].board.winner) {
        const result = games[gameCode].board.winner;

        if (result === "draw") {
          declareDrawCon(gameCode);
          io.to(gameCode).emit("gameOver", "Game Over: It's a draw!");
        } else {
          const winner = socket.username;
          const loser = games[gameCode].players.find(
            (player) => player !== winner
          );

          declareWinnerCon(gameCode, games[gameCode].playersData[winner].addr);
          socket.emit("gameOver", "You win!");
          socket.to(gameCode).emit("gameOver", "You lose!");
        }

        delete games[gameCode];
      }

      // OR, for lazy impl
      // io.to(gameCode).emit(msg)
    });
  });
}
