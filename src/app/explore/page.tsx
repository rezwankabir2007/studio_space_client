import ExploreStudiosClient from "@/components/ExploreStudiosClient";

async function getStudios() {
  try {
    const res = await fetch("http://localhost:8000/exploreStudios", {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`Fetch failed with status: ${res.status}`);
      return [];
    }

    const data = await res.json();
    // API response data array or object handle
    return Array.isArray(data) ? data : data.studios || [];
  } catch (error) {
    console.error("Error fetching studios from backend:", error);
    return [];
  }
}

export default async function Page() {
  const studios = await getStudios();

  return <ExploreStudiosClient studios={studios} />;
}