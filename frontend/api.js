// filepath: c:\Users\swami\OneDrive\Desktop\HackByte\frontend\src\pages\Organizations.tsx
import { fetchOrganizations } from "../../api";

export async function fetchOrganizations() {
  try {
    const response = await fetch("http://localhost:5000/api/organizations");
    if (!response.ok) {
      throw new Error("Error fetching organizations");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}