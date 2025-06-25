import React from 'react';
import { useState, useEffect } from "react";
import { Form, Outlet, useLoaderData, useNavigate } from "react-router-dom";
import "./App.css";
import "./index.css";
import GameBoard from "./routes/gameboard";
import { Board, Token } from "../shared/GameModel"
import { Logo } from "./assets/components/logo";
import {
  Wallet, Play, Coins, Shield, Zap, Users
} from "lucide-react";
import { ConnectBtn } from "./assets/components/connectBtn";
import { CreateJoin } from "./routes/create-join/CreateJoin";
import CreateGameModal from "./routes/create-join/CreateGameModal";
import JoinGameModal from "./routes/create-join/JoinGameModal";
import { useLocation } from "react-router-dom";

import { connectWallet, getCurrentWallet } from '../contract/interact.js';

import socket from '../shared/socket'

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;

  // This handles "real" routes and modal routes
  const isModal = state?.modal;

  const [username, setUsername] = useState('');
  const [wallet, setWallet] = useState('');
  const [gameCode, setGameCode] = useState('');
  const [stakeAmt, setStakeAmt] = useState(0);
  const [isWalletConnected, setIsWalletConnected] = useState(false);  
  const [invalidUsernameMsg, setInvalidUsernameMsg] = useState('')


  const handleConnect = async () => {
    try {
      const selectedWallet = await connectWallet();
      setWallet(selectedWallet);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const currentWallet = await getCurrentWallet();
        setWallet(currentWallet);
      } catch (error) {
        console.error('Error in useEffect:', error);
      }
    };

    fetchWallet();
  }, [setWallet]);

  const handleUsernameInput = (e) => {
    const value = e.target.value;
    const usernamePattern = /^[a-z_][a-z0-9_]{2,14}$/i;

    setUsername(value);
    
    if (value.length >= 3 && !usernamePattern.test(value)) {
      setInvalidUsernameMsg("Username must start with a letter or _ and exclude special characters.");
    } else {
      setInvalidUsernameMsg("");
    }
  };

  useEffect(() => {
    socket.on('gameStarted', (player, gameCode) => {
      navigate(`/game/${encodeURIComponent(gameCode)}`, { state: { role: player } });
    });

    socket.on("gameJoinError", (gameCode, reason) => {
      alert(`Could not join game ${gameCode}. ${reason}`);

    });

    return () => socket.off('gameStarted');
  }, [socket]);

  return (
    <>
      <div className="min-h-screen gradient-bg text-white">
        {/* Subtle background pattern */}
        <div className="fixed inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8">
          {/* Navbar */}
          <header className="flex items-center justify-between mb-16">
            <Logo size="responsive" />
            {location.pathname === '/' ? <div></div> : <ConnectBtn wallet={wallet} handleClick={handleConnect} />}
          </header>


          <div className="max-w-6xl mx-auto">
            {!wallet ? (
              <div className="text-center space-y-8 animate-fade-in-up">
                {/* Hero Section */}
                <div className="space-y-4">
                  <h1 className="text-5xl md:text-7xl font-bold text-cyan-400 ">D_ARENA</h1>
                  <p className="text-sm md:text-xl text-gray-300 max-w-2xl mx-auto ">
                    Play the games you know. Win the rewards you deserve.<br />Powered by Web3.
                  </p>

                  <div className="flex flex-wrap justify-center gap-3 mt-6">
                    <span className="text-xs bg-slate-800/50 text-slate-300 border-slate-700/50 px-4 py-2 rounded-full inline-flex items-center gap-2">
                      <Shield size={16} /> Web3 Secured
                    </span>
                    <span className="text-xs bg-slate-800/50 text-slate-300 border-slate-700/50 px-4 py-2 rounded-full inline-flex items-center gap-2">
                      <Zap size={16} /> Instant Rewards
                    </span>
                  </div>
                </div>

                <div className="rounded-lg border bg-card text-card-foreground glass max-w-md mx-auto shadow-2xl">
                  <div className="flex flex-col space-y-1.5 p-6 text-center pb-4">
                    <h3 className="tracking-tight text-2xl font-semibold text-white flex items-center justify-center">
                      <Wallet className="lucide lucide-wallet w-6 h-6 mr-3 text-cyan-400" /> Get Started
                    </h3>
                    <p className="text-gray-400">Connect your wallet to begin gaming</p>
                  </div>

                  <div className="p-6 pt-0 space-y-6">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                        <Wallet className="w-10 h-10 text-cyan-400" />
                      </div>
                    </div>

                    <ConnectBtn wallet={wallet} handleClick={handleConnect} />

                    <div className="text-xs text-gray-500 text-center">
                      Supports Metamask only • Secure & encrypted
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="grid md:grid-cols-3 gap-6 mt-16">
                  <FeatureCard
                    icon={<Play size={36} className="lucide lucide-play w-6 h-6 text-cyan-400" />}
                    title="Competitive Gaming"
                    description="Challenge players in skill-based matches"
                  />
                  <FeatureCard
                    icon={<Coins size={36} className="lucide lucide-play w-6 h-6 text-green-400" />}
                    title="Stake & Earn"
                    description="Put your tokens on the line and earn rewards for winning"
                  />
                  <FeatureCard
                    icon={<Shield size={36} className="lucide lucide-play w-6 h-6 text-purple-400" />}
                    title="Secure Platform"
                    description="Built on blockchain technology for transparency and security"
                  />
                </div>
              </div>
            ) : (
              <CreateJoin />
            )}
          </div>
        </div>



      </div >
      {/* Conditionally render modal routes */}
      {wallet && isModal && location.pathname === "/create-game"
        &&
        <CreateGameModal wallet={wallet} username={username} setUsername={setUsername} 
          handleUsernameInput={handleUsernameInput} invalidUsernameMsg={invalidUsernameMsg} setInvalidUsernameMsg={setInvalidUsernameMsg}
          stakeAmt={stakeAmt} setStakeAmt={setStakeAmt}
          gameCode={gameCode} setGameCode={setGameCode}
        />}

      {wallet && isModal && location.pathname === "/join-game"
        &&
        <JoinGameModal wallet={wallet} username={username} setUsername={setUsername} 
          gameCode={gameCode} setGameCode={setGameCode}
          stakeAmt={stakeAmt} setStakeAmt={setStakeAmt}
        />}
    </>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="rounded-lg border bg-card text-card-foreground glass shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
    <div className="p-6 text-center">
      <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  </div>
);

export default App;

