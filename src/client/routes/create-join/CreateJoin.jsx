import {
    Wallet, Play, Coins, Shield, Zap, Users
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export function CreateJoin() {
    const navigate = useNavigate();

    return (
        <div className="relative space-y-8 animate-fade-in-up">
            <div className="text-center space-y-4">
                <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                    Choose Your Game
                </h2>
                <p className="text-gray-300 text-lg">Select a game mode and start playing</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Checkers Game Card */}
                <div className="rounded-lg border bg-card text-card-foreground glass shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 hover:scale-105 pulse-glow">
                    <div className="p-8">
                        <div className="text-center space-y-6">
                            <div className="w-20 h-20 mx-auto flex items-center justify-center">
                                <div className="text-4xl text-green-400">⛀⛁</div>
                            </div>

                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">Checkers</h3>
                                <p className="text-gray-400 max-sm:text-sm ">Classic strategy game for two players</p>
                                {/* <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-primary hover:bg-primary/80 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border-yellow-500/30 mt-3">
                          <Coins className="lucide lucide-coins w-3 h-3 mr-1" />
                          Min 5 $ARENA
                        </div> */}
                            </div>

                            <div className="space-y-3">
                                <button 
                                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-primary hover:bg-primary/90 h-10 px-4 w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                                    onClick={() => navigate("/create-game", { state: { modal: true } })}
                                >
                                    <Play className="w-5 h-5 mr-2" />
                                    Create Game
                                </button>

                                <button 
                                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border bg-background hover:text-accent-foreground h-10 px-4 w-full border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 py-3 transition-all duration-300"
                                    onClick={() => navigate("/join-game", { state: { modal: true } })} 
                                >
                                    <Users className="w-5 h-5 mr-2" />
                                    Join Game
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border bg-card text-card-foreground glass shadow-2xl">
                    <div className="flex flex-col space-y-1.5 p-6">
                        <h3 className="tracking-tight text-xl font-semibold text-center text-white">Platform Stats</h3>
                    </div>
                    <div className="p-6 pt-0 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                                <div className="text-xl md:text-2xl font-bold text-green-400">847</div>
                                <div className="text-sm text-gray-400">Active Players</div>
                            </div>
                            <div className="text-center p-4 rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
                                <div className="text-xl md:text-2xl font-bold text-yellow-400">12.5K</div>
                                <div className="text-sm text-gray-400">ETH Staked</div>
                            </div>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                            <div className="text-xl md:text-2xl font-bold text-purple-400">2.8K</div>
                            <div className="text-sm text-gray-400">Games Played Today</div>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
                            <div className="text-xl md:text-2xl font-bold text-cyan-400">98.5%</div>
                            <div className="text-sm text-gray-400">Uptime</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}