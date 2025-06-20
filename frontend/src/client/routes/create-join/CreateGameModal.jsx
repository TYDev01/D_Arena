import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from '../../assets/components/logo'
import {
    Wallet, Play, Coins, Shield, Zap, Users, ArrowLeft, Copy
} from "lucide-react";
import socket from '../../../shared/socket'

export default function CreateGameModal({ wallet, username, setUsername, stakeAmt, setStakeAmt, gameCode, setGameCode }) {
    const [isCreating, setIsCreating] = useState(false);
    const [gameCreated, setGameCreated] = useState(false)
    const [inviteLink, setInviteLink] = useState("")

    const navigate = useNavigate();

    const createGameEmit = () => {
        if (!stakeAmt || stakeAmt <= 0 || isNaN(stakeAmt) || username === '') return alert("Enter valid stake to proceed");

        setIsCreating(true);
        socket.emit("createGame", username, stakeAmt);
        // console.log('createGameEmit localUsername:', username)
    }
    const createGame = (code, stake, username) => {

        try {
            // const response = await createGameCon(code, stake);

            // if (!response) return console.error('Error while processing')

            // console.log('createGame localUsername:', username)
            socket.emit("joinGame", code, username, stake, wallet);
        } catch (err) {
            console.error(err);
        } finally {
            const newInviteLink = `${window.location.origin}/join/${encodeURIComponent(code)}`
            setInviteLink(newInviteLink)

            setGameCreated(true)
            setIsCreating(false);
            // console.log('Game Created!');
        }
    }

    const copyLink = () => {
        navigator.clipboard.writeText(inviteLink)
    }

    useEffect(() => {
        if (!wallet) return navigate('/')
    }, [])

    useEffect(() => {
        socket.on('sendGameData', (code, stake, username) => {
            const updateData = (code, stake) => {
                setUsername(username);
                setGameCode(code);
                setStakeAmt(stake);
                // console.log("gameCode:", code, "stakeAmt", stake);
            }

            updateData(code, stake);
            createGame(code, stake, username);
        })

        return () => {
            socket.off('sendGameData')
        };
    }, [socket])

    if (gameCreated) {
        return (
            <div className="fixed inset-0 z-50 bg-black/80 text-green-400 font-mono flex items-center justify-center">
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

                <div className="relative z-10 w-full max-w-md mx-auto px-4 animate-fade-in-up">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background 
                                    transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                                    disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border
                                    bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 border-cyan-500 text-cyan-400"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            BACK
                        </button>
                        <Logo size="md" />
                        <div></div>
                    </div>

                    <div className="rounded-lg border text-card-foreground shadow-sm bg-[#090910] border-green-500/50">
                        <div className="flex flex-col space-y-1.5 p-6 text-center">
                            <h3 className="font-semibold tracking-tight text-green-400 text-2xl">⛀⛁ GAME CREATED!</h3>
                        </div>
                        <div className="p-6 pt-0 space-y-6">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-cyan-400 mb-2">{gameCode}</div>
                                <p className="text-gray-400">Game ID</p>
                            </div>

                            <div className="bg-gradient-to-r from-green-500/20 to-cyan-500/20 p-4 rounded border border-green-500/30 text-center">
                                <div className="text-2xl font-bold text-green-400 flex items-center justify-center mb-1">
                                    <Coins className="lucide lucide-coins w-6 h-6 mr-2" />
                                    {stakeAmt} LSK
                                </div>
                                <div className="text-xs text-gray-400">STAKED</div>
                                {/* <div className="text-sm text-yellow-400 mt-2">
                            Winner gets {(Number(stakeAmt) * 2 * 0.95).toFixed(1)} LSK
                        </div> */}
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-cyan-400">
                                    INVITE LINK
                                </label>
                                <div className="flex gap-2">
                                    <input value={inviteLink} readOnly
                                        className="flex h-10 w-full rounded-md border px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium 
                                            file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring 
                                            focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-gray-800 border-gray-600 text-green-400 text-xs"
                                    />
                                    <button onClick={copyLink}
                                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors 
                                                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none 
                                                disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 border-cyan-500 text-cyan-400"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="text-center py-4">
                                <div className="w-8 h-8 mx-auto mb-2 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-cyan-400 text-sm">Waiting for opponent...</p>
                            </div>

                            {/* <button
                                onClick={startGame}
                                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 
                                    focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary 
                                    hover:bg-primary/90 h-10 px-4 py-2 w-full bg-gradient-to-r from-green-500 to-emerald-600 text-black font-bold"
                            >
                                <Zap className="lucide lucide-zap w-4 h-4 mr-2" />
                                START GAME
                            </button> */}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/80 text-green-400 font-mono flex items-center justify-center">
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

            <div className="relative z-10 w-full max-w-md mx-auto px-4 animate-fade-in-up">
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
                    <Logo size="md" className="flex items-center space-x-3 group" />
                    <div></div>
                </div>

                <div className="rounded-lg border text-card-foreground shadow-sm bg-[#090910] border-gray-700">
                    <div className="flex flex-col space-y-1.5 p-6 text-center">
                        <h3 className="font-semibold tracking-tight text-cyan-400 text-2xl">CREATE GAME</h3>
                        <p className="text-gray-400 text-sm">Stake tokens and wait for opponent</p>
                    </div>
                    <div className="p-6 pt-0 space-y-6">
                        <div className="text-center">
                            <div className="text-4xl mb-2">⛀⛁</div>
                            <h3 className="text-xl font-bold text-cyan-400">CHECKERS</h3>
                            <p className="text-gray-400 text-sm">2 players • Strategy game</p>
                        </div>

                        <div>
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed
                 peer-disabled:opacity-70 text-cyan-400">
                                USERNAME
                            </label>
                            <div className="flex items-center gap-2 mt-2">
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder='John Doe'
                                    className="flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed
                                disabled:opacity-50 bg-gray-800 border-gray-600 text-green-400"
                                />
                            </div>

                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed
                 peer-disabled:opacity-70 text-cyan-400">
                                STAKE AMOUNT
                            </label>
                            <div className="flex items-center gap-2 mt-2">
                                <input
                                    type="number"
                                    value={stakeAmt}
                                    onChange={(e) => setStakeAmt(e.target.value)}
                                    className="flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed
                              disabled:opacity-50 bg-gray-800 border-gray-600 text-green-400"
                                />
                                <span className="text-gray-400">LSK</span>
                            </div>
                            {/* <p className="text-xs text-gray-400 mt-1">Minimum: 5 LSK</p> */}
                        </div>

                        {/* <div className="bg-gray-800/50 p-4 rounded border border-gray-700 text-center">
                    <div className="text-sm text-gray-400 mb-1">WINNER GETS</div>
                    <div className="text-2xl font-bold text-yellow-400">
                        {(Number(stakeAmt) * 2 * 0.95).toFixed(1)} LSK
                    </div>
                    <div className="text-xs text-gray-400">Total pool minus 5% fee</div>
                </div> */}

                        <button
                            onClick={createGameEmit}
                            disabled={isCreating}
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:size-4 
                            [&_svg]:shrink-0 bg-primary hover:bg-primary/90 h-10 px-4 w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-black font-bold py-3 disabled:opacity-50"
                        >
                            {isCreating ? (
                                <>
                                    <div className="w-4 h-4 mr-2 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                    CREATING...
                                </>
                            ) : (
                                <>
                                    <Coins className="lucide lucide-coins w-4 h-4 mr-2" />
                                    STAKE & CREATE
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
