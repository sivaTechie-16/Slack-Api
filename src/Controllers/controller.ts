
import dotenv from "dotenv";
import {   getLunchCountData, sendSlackMessage} from "../Services/services";
dotenv.config();

export const sendMessageController = async (req,res) => {
  try {
    const channel = process.env.SLACK_CHANNEL ;
    const text = "";

    await sendSlackMessage(channel, text);
    console.log("Controller: Message sent successfully");
    return res.sendStatus(200);

  } catch (error) {
    console.error("Controller: Error in sending message", error);
  }
};



