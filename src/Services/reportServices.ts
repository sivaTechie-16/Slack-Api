import { AppDataSource } from "../dbConfig";
import { LunchCount } from "../Models/lunchCount";
import ExcelJS from "exceljs";

export const generateLunchCountReport = async (month: number) => {
  try {
    const responseRepository = AppDataSource.getRepository(LunchCount);
    const year = new Date().getFullYear();
    const lunchCounts = await responseRepository.find();

    const filteredCounts = lunchCounts.filter((item) => {
      const itemDate = new Date(item.timestamp);
      return (
        itemDate.getMonth() === month - 1 && itemDate.getFullYear() === year
      );
    });

    const sortedCounts = filteredCounts.sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
    );

    const dataByDate: Record<string, Record<string, string>> = {};
    const userTotals: Record<
      string,
      { totalAmount: number; yesCount: number }
    > = {};
    const userNames = [...new Set(filteredCounts.map((item) => item.userName))];

    userNames.forEach((user) => {
      userTotals[user] = { totalAmount: 0, yesCount: 0 };
    });

    sortedCounts.forEach((item) => {
      const itemDate = new Date(item.timestamp).toLocaleDateString();
      if (!dataByDate[itemDate]) {
        dataByDate[itemDate] = {};
      }

      dataByDate[itemDate][item.userName] = item.response;
      userTotals[item.userName].totalAmount += item.amount;
      if (item.response === "Yes") {
        userTotals[item.userName].yesCount++;
      }
    });

    const headers = ["Date", ...userNames];
    const output: (string | number)[][] = [];

    for (const date in dataByDate) {
      const row = [date];
      userNames.forEach((user) => {
        row.push(dataByDate[date][user] || "-");
      });
      output.push(row);
    }

    output.push([
      "Total Amount",
      ...userNames.map((user) => userTotals[user].totalAmount),
    ]);
    output.push([
      "Yes Responses",
      ...userNames.map((user) => userTotals[user].yesCount),
    ]);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Lunch Count Report");

    worksheet.addRow(headers);
    output.forEach((row) => worksheet.addRow(row));

    return await workbook.csv.writeBuffer();
  } catch (error) {
    console.error("Error fetching lunch count data:", error);
    throw new Error("Failed to fetch lunch count data");
  }
};
