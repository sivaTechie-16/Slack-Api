import { AppDataSource } from "../dbConfig";
import { LunchCount } from "../Models/lunchCount";
import { User } from "../Models/User";
import { app } from "../utils/sendSlackMessage";

export const saveUser = async (slackUserId: string, userName: string) => {
  const userRepository = AppDataSource.getRepository(User);

  let user = await userRepository.findOne({ where: { slackId: slackUserId } });
  if (!user) {
    user = userRepository.create({
      slackId: slackUserId,
      userName,
    });
    await userRepository.save(user);
    console.log(`User ${userName} saved to DB`);
  }

  return user;
};

export const checkIfUserResponded = async (userName: string) => {
  try {
    const responseRepository = AppDataSource.getRepository(LunchCount);
    const today = new Date().toISOString().split("T")[0];
    const existingResponse = await responseRepository
      .createQueryBuilder("exist")
      .where("exist.userName = :userName", { userName })
      .andWhere("DATE(exist.timestamp) = :today", { today })
      .getOne();

    if (existingResponse) {
      const responseDate = existingResponse.timestamp
        .toISOString()
        .split("T")[0];
      if (responseDate === today) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw new Error("Unable to fetch user info");
  }
};

export const getUserName = async (userId: string) => {
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
