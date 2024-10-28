import { AppDataSource } from "../dbConfig";
import { LunchCount } from "../Models/lunchCount";
import { User } from "../Models/User";

export const saveResponseToDB = async (
  user: User,
  response: string,
  amount: number
) => {
  try {
    const responseRepository = AppDataSource.getRepository(LunchCount);
    const newResponse = responseRepository.create({
      userName: user.userName,
      response,
      amount,
      timestamp: new Date(),
    });
    await responseRepository.save(newResponse);
    console.log("Response saved to DB");
  } catch (error) {
    console.error("Error saving response to DB:", error);
    throw new Error("Unable to save response to DB");
  }
};
