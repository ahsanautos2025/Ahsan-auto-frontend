export async function getSettings() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/settings`, {
      next: { revalidate: 60 }, // ISR (optional)
    });
    const data = await res.json();
    return data;
  }
  