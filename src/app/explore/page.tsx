import ExploreStudiosClient from "@/components/ExploreStudiosClient";

// বিল্ড টাইমে স্ট্যাটিক জেনারেট করা থেকে বিরত রাখতে এটি ব্যবহার করা হলো
export const dynamic = 'force-dynamic';

async function getStudios() {
  try {
    const res = await fetch("http://localhost:8000/exploreStudios", {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`Fetch failed: ${res.status}`);

      return {
        studios: [],
        fetchError: true,
      };
    }

    const data = await res.json();

    return {
      studios: Array.isArray(data) ? data : data.studios || [],
      fetchError: false,
    };
  } catch (error) {
    console.error("Error fetching studios:", error);

    return {
      studios: [],
      fetchError: true,
    };
  }
}

export default async function Page() {
  const { studios, fetchError } = await getStudios();

  return (
    <ExploreStudiosClient
      studios={studios}
      fetchError={fetchError}
    />
  );
}