export async function getSettings() {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      
      if (!apiUrl) {
        console.warn('NEXT_PUBLIC_API_BASE_URL is not set');
        return null;
      }
      
      const res = await fetch(`${apiUrl}/settings`, {
        next: { revalidate: 60 }, // ISR (optional)
      });
      
      if (!res.ok) {
        console.warn('Failed to fetch settings:', res.status, res.statusText);
        return null;
      }
      
      const data = await res.json();
      return data;
    } catch (error) {
      console.warn('Error fetching settings during build:', error);
      return null;
    }
  }
  
