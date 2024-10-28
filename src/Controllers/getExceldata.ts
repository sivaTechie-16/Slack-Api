import { generateLunchCountReport } from "../Services/reportServices";

export const getExceldataController = async (req, res) => {
  try {
    const { month } = req.body;
    const buffer = await generateLunchCountReport(month);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=lunch_count_report.csv"
    );
    return res.send(buffer);
  } catch (error) {
    console.error("Error generating report:", error);
    return res.status(500).json({ error: "Failed to generate report" });
  }
};
