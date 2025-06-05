import { Media } from '@/services/common/types';;
import { HelperFunctions } from "@/lib/helper_funcs";

export default async function getMediaWithPlatformIds() {
  try {
    const res = await fetch('http://localhost:3000/api/videos', {
      cache: "no-store"
    });
    
    if (!res.ok) {
      throw new Error(`Error: ${res.statusText}`);
    }
    
    const data = await res.json();
    const media = data.body;
    
    // Process media items to include platformId
    const processedMedia = media.map((media: Media) => {
      try {
        const platformId = HelperFunctions.getIdOfplatform(media);
        return {
          ...media,
          platformId
        };
      } catch (error) {
        console.error(`Error processing media ${media.id}:`, error);
        return {
          ...media,
          platformId: 0
        };
      }
    });
    
    return processedMedia;
  } catch (error) {
    console.error('Error fetching media:', error);
    return [];
  }
}

