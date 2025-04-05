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