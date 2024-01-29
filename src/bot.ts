import mongoose from "mongoose";
import { Scenes, Telegraf, session } from "telegraf";
import { taskWizard } from "./scenes/task.scene";
import { mainMenu } from "./menu/main.menu";
import { Task } from "./models/task.model";
import { configDotenv } from "dotenv";
configDotenv();
const bot = new Telegraf<Scenes.WizardContext>(
  "6939994509:AAFtvIrYIbQTmG-5RH-E1QssghwhEZ52AVU"
);

const stage = new Scenes.Stage<Scenes.WizardContext>([taskWizard]);

bot.use(session());
bot.use(stage.middleware());

bot.start((ctx) => {
  ctx.reply("welcome", mainMenu.reply());
});

bot.hears("Add Task", (ctx) => {
  ctx.scene.enter("task-wizard");
});

bot.hears("List Tasks", (ctx) => {
  Task.find({}).then((res) => {
    res.forEach((task) => {
      ctx.reply(`Title: ${task.title}\nDescription: ${task.description}`, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Mark As Done",
                callback_data: `done_${task.id}`,
              },
              {
                text: "Delete",
                callback_data: `delete_${task.id}`,
              },
            ],
          ],
        },
      });
    });
  });
});

bot.action(/delete_/, (ctx: any) => {
  const taskId = ctx.update.callback_query.data.split("_")[1];
  Task.findByIdAndDelete(taskId).then((res) => {
    ctx.reply("Task Deleted Successfully");
  });
});

bot.action(/done_/, (ctx: any) => {
  const taskId = ctx.update.callback_query.data.split("_")[1];
  Task.findOneAndUpdate({ _id: taskId }, { isComplete: true }).then((res) => {
    ctx.reply("Task Marked As Done");
  });
});
mongoose.connect("mongodb://localhost:27017/telegram-samples").then((res) => {
  console.log("Connected to MongoDB");
});

bot.launch();
