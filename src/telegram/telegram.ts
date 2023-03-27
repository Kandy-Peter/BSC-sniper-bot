require("dotenv").config();
import { Telegraf } from "telegraf";
import { CHAT_IDS } from "../utils/constant";

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply("Welcome To Ka_sniper_bot"));

export const sendNotification = async (message: string) => {
    try {
        for (const chatId of CHAT_IDS) {
            await bot.telegram.sendMessage(chatId, message);
        }
    } catch (error) {
        console.log("Error sending notification", error);
    }
};

bot.launch();
