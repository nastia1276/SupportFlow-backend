// telegramBot.js

const TelegramBot = require("node-telegram-bot-api");
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
const db = require("./config/db");

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  await bot.sendMessage(
    chatId,
    "Вітаю! Введіть ваш email для підключення Telegram-сповіщень:"
  );
  bot.once("message", async (msg) => {
    const email = msg.text;
    try {
      await db.query("UPDATE users SET telegram_id=? WHERE email=?", [
        chatId,
        email,
      ]);
      await bot.sendMessage(chatId, "Готово! Ви будете отримувати сповіщення.");
    } catch (err) {
      await bot.sendMessage(chatId, "Помилка. Спробуйте ще раз.");
    }
  });
});

async function notifyUser(telegramId, message) {
  if (telegramId) await bot.sendMessage(telegramId, message);
}

module.exports = { notifyUser };
