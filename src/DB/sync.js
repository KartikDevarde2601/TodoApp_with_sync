import {synchronize} from '@nozbe/watermelondb/sync';
import database from './db';
import axios from 'axios';

export default async function mySync() {
  await synchronize({
    database,
    pullChanges: async ({lastPulledAt}) => {
      const response = await axios.get('http://10.2.135.231:3000/sync/push', {
        params: {
          lastPulledAt,
        },
      });
      if (response.status !== 200) {
        throw new Error(response.statusText);
      }
      console.log(response.data);
      return response.data;
    },
    pushChanges: async ({changes, lastPulledAt}) => {
      try {
        const response = await axios.post(
          'http://10.2.135.231:3000/sync/pull',
          {changes, lastPulledAt},
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    },
  });
}
