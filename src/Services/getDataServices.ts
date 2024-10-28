import { AppDataSource } from "../dbConfig";
import { LunchCount } from "../Models/lunchCount";


export const getLunchCountData = async () => {
  try {
    const responseRepository = AppDataSource.getRepository(LunchCount);
    return await responseRepository.find();
  } catch (error) {
    console.error("Error fetching lunch count data:", error);
    throw new Error("Failed to fetch lunch count data");
  }
};
