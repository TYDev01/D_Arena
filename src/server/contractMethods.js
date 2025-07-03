import { ethers } from "ethers";
import abi from "../contract/abi.json"  with { type: 'json' };
import dotenv from "dotenv";

dotenv.config();

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const RPC_URL = process.env.INFURIA_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!CONTRACT_ADDRESS || !RPC_URL || !PRIVATE_KEY) {
  throw new Error("Missing environment variables. Check .env file.");
}

const provider = new ethers.JsonRpcProvider("https://rpc.sepolia-api.lisk.com");
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

// Smart contract functions 
export async function declareDrawCon(gameCode) {
  try {
    console.log(`Declaring draw for game ${gameCode}...`);
    const tx = await contract.declareDraw(gameCode);
    await tx.wait();
    console.log(`Draw declared (tx: ${tx.hash})`);
    return tx.hash;
  } catch (err) {
    console.error(`Failed to declare draw for ${gameCode}:`, err);
    throw err;
  }
}

export async function declareWinnerCon(gameCode, winner) {
  try {
    console.log(`Declaring winner "${winner}" for game ${gameCode}...`);
    const tx = await contract.declareWinner(gameCode, winner);
    await tx.wait();
    console.log(`Winner declared (tx: ${tx.hash})`);
    return tx.hash;
  } catch (err) {
    console.error(`Failed to declare winner for ${gameCode}:`, err);
    throw err;
  }
}

export async function triggerTimeoutRefundCon(gameCode) {
  try {
    console.log(`Triggering timeout refund for game ${gameCode}...`);
    const tx = await contract.triggerTimeoutRefund(gameCode);
    await tx.wait();
    console.log(`Timeout refund triggered (tx: ${tx.hash})`);
    return tx.hash;
  } catch (err) {
    console.error(`Failed to trigger timeout refund for ${gameCode}:`, err);
    throw err;
  }
}
