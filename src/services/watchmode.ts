import axios from "axios";

const WATCHMODE_API_KEY = import.meta.env.VITE_WATCHMODE_API_KEY;
const BASE_URL = "https://api.watchmode.com/v1";

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  params: {
    apiKey: WATCHMODE_API_KEY,
  },
});

export interface StreamingInfo {
  source_id: number;
  name: string;
  type: string;
  region: string;
  web_url: string;
  ios_url?: string;
  android_url?: string;
  format: string;
  price?: number;
  seasons?: number;
  episodes?: number;
}

export const watchmodeApi = {
  // Search for a title to get Watchmode ID
  searchTitle: async (title: string) => {
    try {
      const { data } = await axiosInstance.get('/search', {
        params: {
          search_field: 'name',
          search_value: title,
          types: 'movie',
        },
      });
      return data.title_results?.[0]?.id;
    } catch (error) {
      console.error('Error searching title:', error);
      return null;
    }
  },

  // Get streaming sources for a title
  getStreamingSources: async (titleId: string): Promise<StreamingInfo[]> => {
    try {
      const { data } = await axiosInstance.get(`/title/${titleId}/sources/`);
      // Filter to include only subscription and free services
      return data.filter((source: StreamingInfo) => 
        ['sub', 'free'].includes(source.type) &&
        ['Netflix', 'Hulu', 'Max', 'Prime Video', 'Disney+', 'Apple TV+'].includes(source.name)
      );
    } catch (error) {
      console.error('Error fetching streaming sources:', error);
      return [];
    }
  },

  // Combine search and sources into one convenient method
  getStreamingInfoForMovie: async (title: string, year?: string) => {
    const searchQuery = year ? `${title} ${year}` : title;
    const titleId = await watchmodeApi.searchTitle(searchQuery);
    if (!titleId) return [];
    return watchmodeApi.getStreamingSources(titleId);
  }
};
