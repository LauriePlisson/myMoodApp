import { getMoodsByPeriodAPI } from "./moodAPI";

export const fetchYearMoods = async ({ year, token }) => {
  const start = new Date(year, 0, 1).toISOString().split("T")[0];
  const end = new Date(year + 1, 0, 1).toISOString().split("T")[0];

  const data = await getMoodsByPeriodAPI({
    userToken: token,
    start,
    end,
  });

  return data;
};
