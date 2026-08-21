import axios from 'axios';

export interface PolledPost {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export const notificationsService = {
  fetchLatestPosts: async (): Promise<PolledPost[]> => {
    const response = await axios.get<PolledPost[]>('https://jsonplaceholder.typicode.com/posts?_limit=5');
    return response.data;
  },
};
