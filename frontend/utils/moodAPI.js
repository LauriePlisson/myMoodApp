export async function saveMoodAPI({
  userToken,
  existingMood = null,
  moodValue,
  note,
  date = null,
}) {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const body = { moodValue, note };
  if (date) {
    body.date = date;
  }

  const url = existingMood
    ? `${API_URL}/moods/${existingMood._id}`
    : `${API_URL}/moods/`;
  const method = existingMood ? "PUT" : "POST";

  const res = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userToken}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return { mood: data.mood, success: data.result, message: data.message };
}
