import { App } from "@slack/bolt";
import dotenv from "dotenv";
import {
  checkIfUserResponded,
  getUserName,
  saveUser,
} from "../Services/userServices";
import { saveResponseToDB } from "../Services/saveDataServices";

dotenv.config();

export const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
  port: 4000,
});

export const sendSlackMessage = async (channel: string, text: string) => {
  try {
    await app.client.chat.postMessage({
      channel,
      text,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "Do you want to be counted for hostel lunch? ",
          },
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "Yes",
              },
              value: "yes_response",
              action_id: "yes_button",
            },
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "No",
              },
              value: "no_response",
              action_id: "no_button",
            },
          ],
        },
      ],
    });
    console.log("Message sent successfully");
    return;
  } catch (error) {
    console.error("Error sending message:", error);
    throw new Error("Failed to send Slack message");
  }
};

const handleLunchResponse = async (responseType, userId, say) => {
  try {
    const userName = await getUserName(userId);
    const user = await saveUser(userId, userName);
    const alreadyResponded = await checkIfUserResponded(userName);

    if (alreadyResponded) {
      await app.client.chat.postMessage({
        channel: userId,
        text: `You have already responded for lunch count.`,
      });
      return;
    }
    console.log(`${userName} responded '${responseType}'`);
    const responseMessage =
      responseType === "Yes"
        ? `${userName} has been counted for lunch!`
        : `${userName} has not been counted for lunch.`;
    const countValue = responseType === "Yes" ? 100 : 0;

    await say(responseMessage);
    await saveResponseToDB(user, responseType, countValue);
  } catch (error) {
    console.error("Error handling lunch response:", error);
    await app.client.chat.postMessage({
      channel: userId,
      text: "There was an error processing your response. Please try again later.",
    });
  }
};

app.action("yes_button", async ({ body, ack, say }) => {
  await ack();
  await handleLunchResponse("Yes", body.user.id, say);
});

app.action("no_button", async ({ body, ack, say }) => {
  await ack();
  await handleLunchResponse("No", body.user.id, say);
});
