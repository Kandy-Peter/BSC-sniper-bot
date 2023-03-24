require("dotenv").config();
import { Telegraf } from "telegraf";

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply("Welcome"));

export const sendNotification = async (message: string) => {
    try {
        await bot.telegram.sendMessage(process.env.CHAT_ID, message);
    } catch (error) {
        console.log("Error sending notification", error);
    }
};

bot.launch();
