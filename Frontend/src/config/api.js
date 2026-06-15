const isDev = import.meta.env.DEV;
const BASE = isDev ? "http://localhost:5000" : "https://api.ruhamaislamiccenter.com";

export const BASE_URL = BASE;
export const API_URL = `${BASE}/api`;
export const COURSE_URL = `${BASE}/api/courses`;
export const EVENT_URL = `${BASE}/api/events`;
