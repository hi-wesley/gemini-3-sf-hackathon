import axios from "axios";

export async function generateAll(payload) {
  const response = await axios.post("/api/generate", payload);
  return response.data;
}

export async function reflectOnly(payload) {
  const response = await axios.post("/api/reflect", payload);
  return response.data;
}
