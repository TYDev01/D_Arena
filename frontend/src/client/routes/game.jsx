import { useEffect, useState } from "react"
import { Form, Outlet, useLoaderData, useNavigate, useLocation, useParams } from "react-router-dom"
import GameBoard from "./gameboard";
import { Board, Token } from "../../shared/GameModel";
import {
    Wallet, Play, Coins, Shield, Zap, Users, ArrowLeft, Copy, Trophy
} from "lucide-react";
import { Logo } from "../assets/components/logo";
import './browser.css';
import useGameSession from "../assets/hooks/useGameSession";


import socket from '../../shared/socket'

export default function Game() {
    const [gameCode, setGameCode] = useState("");
    const [gameStarted, setGameStarted] = useState(false);
    const [gameJoined, setGameJoined] = useState(true);
    const [gameOverReason, setGameOverReason] = useState("");
    const [board, setBoard] = useState(new Board());
    const [player, setPlayer] = useState("");
    const [selected, setSelected] = useState({});

    const [usernameObj, setUsernameObj] = useState({});

    const [totalStake, setTotalStake] = useState(0)
    const [captureCount, setCaptureCount] = useState(0);

    const [gameHydrated, setGameHydrated] = useState(false);

    const navigate = useNavigate();

    const { id } = useParams();
    const location = useLocation();
    const role = location.state?.role;

    useGameSession({ setGameCode, setPlayer, setBoard, setGameStarted, setGameHydrated });

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = ''; // Standard for most browsers
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    useEffect(() => {
        if (id) setGameCode(id);
        if (role) setPlayer(role);
        
        socket.emit("getPlayersDict", id)
    }, [id, role]);

    useEffect(() => {
        socket.emit('getTotalStake', id);

        return () => {
            socket.off('getTotalStake');
        }
    }, []);

    useEffect(() => {
        socket.on('setTotalStake', (total) => {
            setTotalStake(total);
        });

        socket.on("gameJoinError", (gameCode, reason) => {
            alert(`Could not join game ${gameCode}. ${reason}`);
            return navigate('/')
        });

        socket.on("setUsernameDict", (dict) => {
            console.log('dict:', dict)
            const setPlayers = () => setUsernameObj(dict);
            setPlayers();
        });

        socket.on("alreadyInGame", () => {
            alert("You are already in this game!");
        })

        socket.on("gameOver", (reason) => {
            localStorage.removeItem("username");
            localStorage.removeItem("gameCode");
            setGameOverReason(reason);
            setGameStarted(false);
        });

        // socket.on("board", (boardState, currentPlayer, onlyMoveData, captCount) => {
        //     // 1. Rebuild board state with new tokens
        //     const newBoardState = boardState.map(token =>
        //         token ? new Token(token.index, token.isMonarch, token.color) : null
        //     );

        //     // Recreate onlyMove reference if exists
        //     const newOnlyMove = onlyMoveData ?
        //         newBoardState[onlyMoveData.index] :
        //         null;

        //     // Update board immutably
        //     const newBoard = board.copy();
        //     newBoard.boardState = newBoardState;
        //     newBoard.currentPlayer = currentPlayer;
        //     newBoard.onlyMove = newOnlyMove; // Use the new reference


        //     // Auto-select if onlyMove applies to current player
        //     if (newOnlyMove && currentPlayer === player) {
        //         const pos = indexToPosition(newOnlyMove.index);
        //         setSelected({ row: pos[0], col: pos[1] });
        //     }

        //     setBoard(newBoard);
        //     setCaptureCount(captCount)
        // });

        socket.on("board", (boardState, currentPlayer, onlyMoveData, captCount) => {
            const newBoard = new Board(); // ✅ NEW board instance
            newBoard.boardState = boardState.map(token =>
                token ? new Token(token.index, token.isMonarch, token.color) : null
            );
            newBoard.currentPlayer = currentPlayer;

            if (onlyMoveData) {
                newBoard.onlyMove = newBoard.boardState[onlyMoveData.index];
            }

            // Auto-select if onlyMove applies to current player
            if (newBoard.onlyMove && currentPlayer === player) {
                const pos = indexToPosition(newBoard.onlyMove.index);
                setSelected({ row: pos[0], col: pos[1] });
            }

            setBoard(newBoard);
            setCaptureCount(captCount);
        });


        return () => {
            socket.off('setTotalStake');
            socket.off('board');
            socket.off('sendGameData')
            socket.off('opponent');
            socket.off('validGameCode');
            socket.off("gameJoined");
            socket.off("gameFull");
            socket.off("gameOver");
            // socket.off("gameStarted");
            socket.off("alreadyInGame");
            socket.off("gameJoinError");
        };
    }, [socket]);


    if (!gameHydrated) {
        return (
            <div className="min-h-screen bg-black text-green-400 font-mono">
                <div className="fixed inset-0 opacity-10">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `
                                            linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
                                            linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)
                                        `,
                            backgroundSize: "50px 50px",
                        }}
                    />
                </div>

                <div className="relative z-10 p-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <button
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring 
                                            focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border bg-background hover:bg-accent hover:text-accent-foreground 
                                            h-9 rounded-md px-3 border-cyan-500 text-cyan-400"
                            onClick={() => navigate(-1)}
                        >
                            <ArrowLeft className="lucide lucide-arrow-left w-4 h-4 mr-2" />
                            BACK
                        </button>
                        <div className="text-center">
                            <Logo size="sm" className="flex items-center space-x-3 group" />
                            {gameCode && <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-primary/80 bg-cyan-500/20 text-cyan-400 border-cyan-500/30 mt-2">
                                {gameCode}
                            </div>}
                        </div>
                        <div></div>
                    </div>

                    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Game Info */}
                        <div className="space-y-4">
                            {/* Stake Info */}
                            <div className="rounded-lg border bg-card text-card-foreground shadow-sm bg-gray-900/50 border-gray-700">
                                <div className="p-4">
                                    <div className="text-center">
                                        <div className="text-sm text-gray-400 mb-1">TOTAL POOL</div>
                                        <div className="text-2xl font-bold text-green-400 flex items-center justify-center">
                                            <Coins className="lucide lucide-coins w-5 h-5 mr-2" />
                                            {totalStake}
                                        </div>
                                        <div className="text-xs text-gray-400">LSK</div>
                                    </div>
                                </div>
                            </div>

                            {/* Current Turn */}
                            {!gameOverReason && (
                                <div className="rounded-lg border bg-card text-card-foreground shadow-sm bg-gray-900/50 border-gray-700">
                                    <div className="p-4 text-center">
                                        <div className="text-sm text-gray-400 mb-2">{player === board.currentPlayer ? "YOUR TURN" : "Waiting for opponent..."}</div>
                                        <div className="flex items-center justify-center space-x-2">
                                            <div
                                                className={`w-6 h-6 rounded-full ${player === "r" ? "bg-red-500" : "bg-gray-800 border border-gray-600"
                                                    }`}
                                            />
                                            <span className="font-bold">{player === "r" ? "RED" : "BLACK"}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Game Over */}
                            {gameOverReason && (
                                <div className="rounded-lg border bg-card text-card-foreground shadow-sm bg-gradient-to-r from-yellow-500/20 to-green-500/20 border-yellow-500/50">
                                    <div className="p-4 text-center">
                                        <Trophy className="lucide lucide-trophy w-8 h-8 mx-auto mb-2 text-yellow-400" />
                                        {/* <div className="text-xl font-bold text-yellow-400 mb-2">{gameWinner.toUpperCase()} WINS!</div> */}
                                        {/* <div className="text-green-400 mb-4">Earned {(Number(stakeAmount) * 2 * 0.95).toFixed(1)} $ARENA</div> */}
                                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring 
                                            focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border bg-background hover:bg-accent hover:text-accent-foreground 
                                            h-9 rounded-md px-3 
                                            bg-gradient-to-r from-green-500 to-cyan-600 text-black font-bold">
                                            <Zap className="lucide lucide-zap w-4 h-4 mr-2" />
                                            CLAIM REWARDS
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Captures */}
                            <div className="rounded-lg border bg-card text-card-foreground shadow-sm bg-gray-900/50 border-gray-700">
                                <div className="p-4">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-4 h-4 bg-red-500 rounded-full" />
                                                <span className="text-sm">{usernameObj?.r || "Red"}</span>
                                            </div>
                                            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-primary/80 bg-red-500/20 text-red-400">
                                                {captureCount?.r || 0}
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-4 h-4 bg-gray-800 border border-gray-600 rounded-full" />
                                                <span className="text-sm">{usernameObj?.b || 'Black'}</span>
                                            </div>
                                            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-primary/80 bg-gray-500/20 text-gray-400">
                                                {captureCount?.b || 0}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <GameBoard board={board} socket={socket} setBoard={setBoard} player={player} selected={selected} setSelected={setSelected} />
                    </div>
                </div>
            </div>
        )
    }
}