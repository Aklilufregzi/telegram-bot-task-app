import { Composer, Scenes } from "telegraf";
import { Task } from "../models/task.model";

const titleStep = new Composer<Scenes.WizardContext>();

const descriptionStep = new Composer();

const confirmStep = new Composer();

titleStep.on("text", (ctx: any) => {
  ctx.wizard.state.title = ctx.message.text;

  if (ctx.message.text.length < 5) {
    ctx.reply("please enter a valid title");
  } else {
    ctx.reply("Enter description");
    ctx.wizard.next();
  }
});

descriptionStep.on("text", (ctx: any) => {
  ctx.wizard.state.description = ctx.message.text;

  if (ctx.message.text.length < 5) {
    ctx.reply("please enter a valid description");
  } else {
    ctx.reply("Please confirm the new task");

    ctx.replyWithHTML(
      `<strong>Task title: </strong> ${ctx.wizard.state.title}\n<strong>Task Description: </strong> ${ctx.wizard.state.description}`,
      {
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
      }
    );
    ctx.wizard.next();
  }
});

confirmStep.action("confirm", (ctx: any) => {
  Task.create({
    title: ctx.wizard.state.title,
    description: ctx.wizard.state.description,
  }).then((res) => {
    ctx.reply("TASK ADDED SUCCESSFULLY");
    ctx.scene.leave();
  });
});
confirmStep.action("discard", (ctx: any) => {
  ctx.reply("task not added");
  ctx.scene.leave();
});

export const taskWizard = new Scenes.WizardScene(
  "task-wizard",
  titleStep,
  descriptionStep,
  confirmStep
);

taskWizard.enter((ctx) => {
  ctx.reply("Enter title for the task");
});
