"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const telegraf_1 = require("telegraf");
const task_scene_1 = require("./scenes/task.scene");
const main_menu_1 = require("./menu/main.menu");
const task_model_1 = require("./models/task.model");
const dotenv_1 = require("dotenv");
(0, dotenv_1.configDotenv)();
const bot = new telegraf_1.Telegraf("6939994509:AAFtvIrYIbQTmG-5RH-E1QssghwhEZ52AVU");
const stage = new telegraf_1.Scenes.Stage([task_scene_1.taskWizard]);
bot.use((0, telegraf_1.session)());
bot.use(stage.middleware());
bot.start((ctx) => {
    ctx.reply("welcome", main_menu_1.mainMenu.reply());
});
bot.hears("Add Task", (ctx) => {
    ctx.scene.enter("task-wizard");
});
bot.hears("List Tasks", (ctx) => {
    task_model_1.Task.find({}).then((res) => {
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
bot.action(/delete_/, (ctx) => {
    const taskId = ctx.update.callback_query.data.split("_")[1];
    task_model_1.Task.findByIdAndDelete(taskId).then((res) => {
        ctx.reply("Task Deleted Successfully");
    });
});
bot.action(/done_/, (ctx) => {
    const taskId = ctx.update.callback_query.data.split("_")[1];
    task_model_1.Task.findOneAndUpdate({ _id: taskId }, { isComplete: true }).then((res) => {
        ctx.reply("Task Marked As Done");
    });
});
mongoose_1.default.connect("mongodb://localhost:27017/telegram-samples").then((res) => {
    console.log("Connected to MongoDB");
});
bot.launch();
