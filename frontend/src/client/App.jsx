import React from 'react';
import { useState, useEffect } from "react";
import "./App.css";
import GameBoard from "./routes/gameboard";
import { Board, Token } from "../shared/GameModel"
import { Logo } from "./assets/components/logo";
import {
  Wallet, Play, Coins, Shield, Zap
} from "lucide-react";

const App = () => {
  return (
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
          <Logo size="lg" />
          <button className="border border-cyan-400 text-cyan-400 px-4 py-1 rounded hover:bg-cyan-400 hover:text-black transition">
            CONNECT WALLET
          </button>
        </header>


        {/* Hero Section */}
        <section className="text-center mt-16">
          <h2 className="text-4xl font-bold">D_ARENA</h2>
          <p className="mt-4 text-lg text-gray-300">
            The future of competitive gaming. Stake, play, and earn in our next-generation platform.
          </p>

          <div className="flex justify-center gap-4 mt-4 text-sm">
            <span className="bg-[#1b223f] px-3 py-1 rounded-full inline-flex items-center gap-2">
              <Shield size={16} /> Web3 Secured
            </span>
            <span className="bg-[#1b223f] px-3 py-1 rounded-full inline-flex items-center gap-2">
              <Zap size={16} /> Instant Rewards
            </span>
          </div>

          <div className="bg-[#10172d] p-6 mt-10 rounded-xl shadow-lg max-w-sm mx-auto">
            <h3 className="font-bold text-lg flex items-center justify-center gap-2 mb-2">
              <Wallet size={20} /> Get Started
            </h3>
            <p className="text-sm text-gray-400 mb-4">Connect your wallet to begin your gaming journey</p>
            <div className="flex justify-center mb-4">
              <Wallet size={48} className="text-cyan-400" />
            </div>
            <button className="bg-cyan-500 hover:bg-cyan-400 text-black px-5 py-2 rounded transition">
              CONNECT WALLET
            </button>
            <p className="text-xs text-gray-500 mt-2">Supports all major wallets • Secure & encrypted</p>
          </div>
        </section>

        {/* Features */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 max-w-5xl w-full">
          <FeatureCard
            icon={<Play size={36} className="text-cyan-400" />}
            title="Competitive Gaming"
            description="Challenge players worldwide in skill-based matches"
          />
          <FeatureCard
            icon={<Coins size={36} className="text-green-400" />}
            title="Stake & Earn"
            description="Put your tokens on the line and earn rewards for winning"
          />
          <FeatureCard
            icon={<Shield size={36} className="text-purple-400" />}
            title="Secure Platform"
            description="Built on blockchain technology for transparency and security"
          />
        </section>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-[#10172d] p-6 rounded-xl text-center">
    <div className="mb-2">{icon}</div>
    <h4 className="font-bold mb-2">{title}</h4>
    <p className="text-sm text-gray-400">{description}</p>
  </div>
);

export default App;

