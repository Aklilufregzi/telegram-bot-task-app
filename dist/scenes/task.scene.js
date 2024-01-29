"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskWizard = void 0;
const telegraf_1 = require("telegraf");
const task_model_1 = require("../models/task.model");
const titleStep = new telegraf_1.Composer();
const descriptionStep = new telegraf_1.Composer();
const confirmStep = new telegraf_1.Composer();
titleStep.on("text", (ctx) => {
    ctx.wizard.state.title = ctx.message.text;
    if (ctx.message.text.length < 5) {
        ctx.reply("please enter a valid title");
    }
    else {
        ctx.reply("Enter description");
        ctx.wizard.next();
    }
});
descriptionStep.on("text", (ctx) => {
    ctx.wizard.state.description = ctx.message.text;
    if (ctx.message.text.length < 5) {
        ctx.reply("please enter a valid description");
    }
    else {
        ctx.reply("Please confirm the new task");
        ctx.replyWithHTML(`<strong>Task title: </strong> ${ctx.wizard.state.title}\n<strong>Task Description: </strong> ${ctx.wizard.state.description}`, {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "Confirm",
                            callback_data: "confirm",
                        },
                        {
                            text: "Discard",
                            callback_data: "discard",
                        },
                    ],
                ],
            },
        });
        ctx.wizard.next();
    }
});
confirmStep.action("confirm", (ctx) => {
    task_model_1.Task.create({
        title: ctx.wizard.state.title,
        description: ctx.wizard.state.description,
    }).then((res) => {
        ctx.reply("TASK ADDED SUCCESSFULLY");
        ctx.scene.leave();
    });
});
confirmStep.action("discard", (ctx) => {
    ctx.reply("task not added");
    ctx.scene.leave();
});
exports.taskWizard = new telegraf_1.Scenes.WizardScene("task-wizard", titleStep, descriptionStep, confirmStep);
exports.taskWizard.enter((ctx) => {
    ctx.reply("Enter title for the task");
});
