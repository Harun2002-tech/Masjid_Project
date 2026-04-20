const API_BASE_URL = "http://localhost:5000/api";

/**
 * 1. ከ Backend የመስጂዱን የሶላት ሰዓት መረጃ ለማምጣት
 */
export async function fetchPrayerTimesFromBackend(masjidId) {
  try {
    const response = await fetch(`${API_BASE_URL}/masjids/${masjidId}/prayers`);
    const result = await response.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}

/**
 * 2. አጋዥ ተግባር፡ ሰዓት ላይ ደቂቃ ለመደመር (ለኢቃማ ሰዓት ማስያ)
 * ምሳሌ፡ "12:30" + 15 = "12:45"
 */
export function addMinutesToTime(timeString, minutes) {
  if (!timeString || typeof timeString !== 'string' || !timeString.includes(':')) return timeString;
  if (!minutes || isNaN(minutes)) return timeString;

  const [hours, mins] = timeString.split(":").map(Number);
  const totalMinutes = hours * 60 + mins + minutes;

  // ከ24 ሰዓት በላይ እንዳይዘል % 24 መጠቀም
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMins = totalMinutes % 60;

  return `${newHours.toString().padStart(2, "0")}:${newMins.toString().padStart(2, "0")}`;
}

/**
 * 3. ሰዓቱን ወደ 12 ወይም 24 ሰዓት ፎርማት ቀይሮ የሚያሳይ
 */
export function formatPrayerTime(time, use24Hour = false) {
  if (!time || typeof time !== 'string' || !time.includes(':')) return "--:--";

  try {
    const parts = time.split(":");
    const hours = parseInt(parts[0]);
    const minutes = parseInt(parts[1]);

    if (isNaN(hours) || isNaN(minutes)) return "--:--";

    if (use24Hour) {
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    }

    const period = hours >= 12 ? "PM" : "AM";
    const h12 = hours % 12 || 12;
    return `${h12}:${minutes.toString().padStart(2, "0")} ${period}`;
  } catch (e) {
    return "--:--";
  }
}

/**
 * 4. አጋዥ ተግባር፡ ሰዓቱን ከማንኛውም የዳታ አወቃቀር ውስጥ ፈልጎ ለማውጣት
 */
const getRawTime = (timings, prayer) => {
  if (!timings) return null;
  // ቅደም ተከተል፡ በእጅ የተሞላ ሰዓት -> የአዛን ሰዓት -> መደበኛ ሰዓት
  return timings.manualTimes?.[prayer] || timings[prayer]?.azan || timings[prayer];
};

/**
 * 5. አሁን የትኛው ሶላት ላይ እንዳለን ለማወቅ
 */
export function getCurrentPrayer(timings) {
  if (!timings) return "Fajr";
  const now = new Date();
  const current = now.getHours() * 60 + now.getMinutes();
  const prayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

  for (let i = prayers.length - 1; i >= 0; i--) {
    const p = prayers[i];
    const prayerTime = getRawTime(timings, p);
    
    if (typeof prayerTime !== "string" || !prayerTime.includes(':')) continue;

    const [h, m] = prayerTime.split(":").map(Number);
    if (current >= h * 60 + m) return p;
  }
  return "Isha";
}

/**
 * 6. ቀጣዩ ሶላት የትኛው እንደሆነ ለማወቅ
 */
export function getNextPrayer(timings) {
  if (!timings) return null;
  const now = new Date();
  const current = now.getHours() * 60 + now.getMinutes();
  const prayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

  for (const p of prayers) {
    const prayerTime = getRawTime(timings, p);
    if (typeof prayerTime !== "string" || !prayerTime.includes(':')) continue;

    const [h, m] = prayerTime.split(":").map(Number);
    if (h * 60 + m > current) {
      return { name: p, time: prayerTime };
    }
  }
  // ሁሉም ሶላቶች ካለፉ የነገውን ፈጅር ይሰጣል
  return { name: "Fajr", time: getRawTime(timings, "Fajr") };
}

/**
 * 7. ለቀጣዩ ሶላት የቀረውን ሰዓት ለመቁጠር
 */
export function getTimeUntilPrayer(prayerTime) {
  if (!prayerTime || typeof prayerTime !== 'string' || !prayerTime.includes(':')) return "0m";

  const now = new Date();
  const current = now.getHours() * 60 + now.getMinutes();
  const [h, m] = prayerTime.split(":").map(Number);
  let pMin = h * 60 + m;

  if (pMin < current) pMin += 1440; // ከእኩለ ሌሊት በኋላ ከሆነ 24 ሰዓት ይጨምራል
  const diff = pMin - current;

  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;

  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}