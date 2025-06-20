import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from '../../assets/components/logo'
import {
  Wallet, Play, Coins, Shield, Zap, Users, ArrowLeft, Copy, Search
} from "lucide-react";
import socket from '../../../shared/socket'

export default function JoinGameModal({wallet}) {
  const navigate = useNavigate();
  const [gameCode, setGameCode] = useState("");
  const [username, setUsername] = useState('');
  const [isSearching, setIsSearching] = useState(false)
  const [gameFound, setGameFound] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const [gameInfo, setGameInfo] = useState({
    stake: "",
    host: "",
  })

  const searchGame = () => {
    if (!gameId.trim()) return

    setIsSearching(true)
    setTimeout(() => {
      setGameFound(true)
      setIsSearching(false)
    }, 1500)
  }

  const searchGameEmit = () => {
    setIsSearching(true);
    socket.emit('verifyGameCode', gameCode);
  };
  const joinGame = async () => {
    setIsJoining(true)

    try {
      // const response = await joinGameCon(code, stake);

      // if (!response) return alert('Error while processing')

      socket.emit("joinGame", gameCode, username, gameInfo.stake, wallet);
    } catch (err) {
      console.error(err)
    } finally {
      setIsSearching(false);
      setIsJoining(false);
    }
  }

  useEffect( ()=> {
    if(!wallet) return navigate('/')
  }, [])

  useEffect(() => {
    socket.on('opponent', (opp, oppStake) => {
      console.log("Opp details:", opp, oppStake);
      const updateGameInfo = (opp, oppStake) => {
        setGameInfo({ stake: oppStake, host: opp });
        console.log("gameInfo:", gameInfo)
      }
      updateGameInfo(opp, oppStake);
      
      setGameFound(true);
      setIsJoining(false);
    });

    socket.on('validGameCode', (valCode, status) => {
      // console.log('validGameCode:', valCode, 'status:', status);
      if (!status) return alert('Invalid Game code!');
      console.log(valCode)
      socket.emit('getOpp', valCode);
    });

    return () => {
      socket.off('opponent');
      socket.off('validGameCode');
    };
  }, [])

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

        {!gameFound ? (
          <div className="rounded-lg border text-card-foreground shadow-sm bg-[#090910] border-gray-700">
            <div className="flex flex-col space-y-1.5 p-6 text-center">
              <h3 className="text-2xl font-semibold leading-none tracking-tight text-cyan-400">JOIN GAME</h3>
              <p className="text-gray-400 text-sm">Enter game ID to join</p>
            </div>
            <div className="p-6 pt-0 space-y-6">
              <div>
                
                <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-cyan-400">
                  GAME CODE
                </div>
                <input
                  value={gameCode}
                  onChange={(e) => setGameCode(e.target.value)}
                  placeholder="ABC123"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent 
                            file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring 
                            focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-gray-800 border-gray-600 text-green-400 text-center text-lg tracking-widest mt-2"
                />
                {/* <p className="text-xs text-gray-400 mt-1">6-character game ID</p> */}
              </div>

              {isSearching && (
                <div className="text-center py-4">
                  <div className="w-8 h-8 mx-auto mb-2 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-cyan-400 text-sm">Searching...</p>
                </div>
              )}

              <button
                onClick={searchGameEmit}
                disabled={!gameCode || isSearching}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary hover:bg-primary/90 h-10 px-4
                            w-full bg-gradient-to-r from-green-500 to-emerald-600 text-black 
                            font-bold py-3 disabled:opacity-50"
              >
                <Search className="lucide lucide-search w-4 h-4 mr-2" />
                FIND GAME
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm bg-[#090910] border-green-500/50">
            <div className="flex flex-col space-y-1.5 p-6 text-center">
              <h3 className="text-2xl font-semibold leading-none tracking-tight text-green-400">
                ⛀⛁ GAME FOUND!
              </h3>
            </div>
            <div className="p-6 pt-0 space-y-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400 mb-2">{gameCode}</div>
                <p className="text-gray-400 text-sm">Host: {gameInfo.host}</p>
              </div>

              <div className="bg-gradient-to-r from-green-500/20 to-cyan-500/20 p-4 rounded border border-green-500/30 text-center">
                <div className="text-sm text-gray-400 mb-1">Host Stake</div>
                <div className="text-2xl font-bold text-green-400 flex items-center justify-center mb-2">
                  <Coins className="lucide lucide-coins w-6 h-6 mr-2" />
                  {gameInfo.stake} LSK
                </div>

                {/* <div className="text-sm text-yellow-400">
                  Winner gets {(Number(gameInfo.stake) * 2 * 0.95).toFixed(1)} LSK
                </div> */}
              </div>

              {isJoining && (
                <div className="text-center py-4">
                  <div className="w-8 h-8 mx-auto mb-2 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-cyan-400 text-sm">Joining game...</p>
                </div>
              )}

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
                    className="flex h-10 w-full rounded-md border px-3 py-2 mb-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed
                                disabled:opacity-50 bg-gray-800 border-gray-600 text-green-400"
                  />
                </div>

              <button
                onClick={joinGame}
                disabled={isJoining}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary hover:bg-primary/90 h-10 px-4 
                w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-black font-bold py-3 disabled:opacity-50"
              >
                {isJoining ? (
                  <>
                    <div className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2
                                    w-4 h-4 mr-2 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    JOINING...
                  </>
                ) : (
                  <>
                    <Zap className="lucide lucide-zap w-4 h-4 mr-2" />
                    STAKE & JOIN
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}