import axios from 'axios';

// Define your Discord webhook URL here (replace with your actual one)
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1385134109197733928/qLrKjPykw2eIDjmSJHbGhnXz-fb16dlM1g-g8KvmIIbQ5_PnQy93w7Cb7VX3tGwoH0Ym';

/**
 * Sends a game link notification to a Discord channel.
 *
 * @param {string|number} stake - The player's wallet address.
 * @param {string|number} gameCode - The game code.
 * @param {string} inviteLink
 */
export async function notifyDiscord(gameCode, stake, inviteLink) {
  // Customize your message format here
  const message = `📢 New game created!\n\n❯❯❯❯ Game Code: ${gameCode}\n❯❯❯❯ Stake: ${stake} LSK\n\🔗 Click here to join: ${inviteLink}\n\n This is a test`;

  try {
    await axios.post(DISCORD_WEBHOOK_URL, {
      content: message,
      username: 'Game Notifier',
      avatar_url: 'https://i.imgur.com/H1Mb649.png',
    });

    console.log(`✅ Sent game info to Discord for gameCode: ${gameCode}`);
  } catch (error) {
    console.error('❌ Error sending message to Discord:', error.response?.data || error.message);
  }
}