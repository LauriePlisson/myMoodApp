const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Création / mise à jour de mood
export async function saveMoodAPI({
  userToken,
  existingMood = null,
  moodValue,
  note,
  date = null,
}) {
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

// Récupérer le mood du jour
export async function getMoodTodayAPI(userToken, logOut) {
  const res = await fetch(`${API_URL}/moods/today`, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  if (res.status === 401) {
    console.warn("Token expiré ou invalide. Déconnexion automatique.");
    logOut(); // <-- ici on appelle la fonction passée depuis le composant
    alert("Votre session a expiré. Veuillez vous reconnecter.");
    return;
  }
  return res.json();
}

// Récupérer les moods pour une période donnée
export async function getMoodsByPeriodAPI({ userToken, start, end }) {
  const res = await fetch(`${API_URL}/moods/period?start=${start}&end=${end}`, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  return res.json();
}
