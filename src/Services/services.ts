import { Request, Response } from "express";
import { App } from "@slack/bolt";
import dotenv from "dotenv";
import { AppDataSource } from "../dbConfig";
import { LunchCount } from "../Models/lunchCount";

dotenv.config();

export const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
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

app.action("yes_button", async ({ body, ack, say }) => {
  await ack();
  const userId = body.user.id;
  const userName = await getUserName(userId);
  const alreadyResponded = await checkIfUserResponded(userName);
  if (alreadyResponded) {
    await say(`${userName} have already responded, .`);
    return;
  }

  console.log(`${userName} responded 'Yes'`);
  await say(`${userName} has been counted for lunch!`);
  await saveResponseToDB(userName, "Yes");
});

app.action("no_button", async ({ body, ack, say }) => {
  await ack();
  const userId = body.user.id;
  const userName = await getUserName(userId);

  const alreadyResponded = await checkIfUserResponded(userName);
  if (alreadyResponded) {
    await say(`${userName} have already responded, .`);
    return;
  }

  console.log(`${userName} responded 'No'`);
  await say(`${userName} has not been counted for lunch.`);
  await saveResponseToDB(userName, "No");
});

const checkIfUserResponded = async (userName: string) => {
  const responseRepository = AppDataSource.getRepository(LunchCount);
  const today = new Date().toISOString().split('T')[0];
  const existingResponse = await responseRepository.findOne({
    where: {
      userName,
    },
  });

  if (existingResponse) {
    const responseDate = existingResponse.timestamp.toISOString().split('T')[0];
    if (responseDate === today) {
      return true; 
    }
  }

  return false; 
};


const getUserName = async (userId: string) => {
  try {
    const result = await app.client.users.info({
      user: userId,
    });

    if (result.ok && result.user) {
      return result.user.real_name || result.user.name;
    }
    return "Unknown user";
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw new Error("Unable to fetch user info");
  }
};



export const saveResponseToDB = async (userName: string, response: string) => {
  const responseRepository = AppDataSource.getRepository(LunchCount);

  const newResponse = responseRepository.create({
    userName,
    response,
    timestamp: new Date(),
  });

  await responseRepository.save(newResponse);
  console.log("Response saved to DB");
};

export const getLunchCountData = async (req: Request, res: Response) => {
  try {
    const responseRepository = AppDataSource.getRepository(LunchCount);
    const lunchCounts = await responseRepository.find();
    res.status(200).json(lunchCounts);
  } catch (error) {
    console.error("Error fetching lunch count data:", error);
    res.status(500).json({ error: "Failed to fetch lunch count data" });
  }
};
