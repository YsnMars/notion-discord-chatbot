import "dotenv/config";
import { Client, IntentsBitField } from "discord.js";
import { chat } from "./utils/chat.js";

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on("ready", () => {
  console.log("Ready!");
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.content.startsWith("!")) return;
  if (!message.mentions.has(client.user)) return;

  await message.channel.sendTyping();

  try {
    // Extract chat history and the last user message
    const { question, chat_history } = await extractChatHistory(message);

    // Call the chain
    const response = await chat(question, chat_history);
    console.log(response);

    message.reply(response.text);
  } catch (error) {
    console.log(error);
  }
});

client.login(process.env.DISCORD_TOKEN);

async function extractChatHistory(message) {
  const userMessages = [];
  const assistantMessages = [];
  const chatHistory = [];
  let lastUserMessage = "";
  const mentionRegex = new RegExp(`<@!?${client.user.id}>`, "g");

  // Fetch message history
  let messages = await message.channel.messages.fetch({ limit: 5 });
  messages.reverse();

  // Iterate through the message history and extract user and bot messages
  for (const [, msg] of messages) {
    if (msg.author.id === message.author.id && msg.mentions.has(client.user)) {
      // userMessages.push(msg);
      chatHistory.push(`USER: ${msg.content.replace(mentionRegex, "").trim()}`);
    } else if (msg.author.id === client.user.id) {
      // assistantMessages.push(msg);
      chatHistory.push(`ASSISTANT: ${msg.content}`);
    }
  }

  // Get the last user message
  lastUserMessage = message.content.replace(mentionRegex, "").trim();

  console.log("chatHistory", chatHistory);
  return {
    question: lastUserMessage,
    chat_history: chatHistory,
  };
}
