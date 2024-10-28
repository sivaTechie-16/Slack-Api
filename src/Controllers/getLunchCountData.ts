import { getLunchCountData } from "../Services/getDataServices";

export const getLunchCountDataController = async (req, res) => {
  try {
    const lunchCounts = await getLunchCountData();
    res.status(200).json(lunchCounts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch lunch count data" });
  }
};
