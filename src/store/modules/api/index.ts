import { defineStore } from 'pinia';
import { ApiState } from '@/store/modules/api/types';

const baseUrl = 'http://175.24.198.241:8080';
const websocketUrl = 'ws://175.24.198.241:8080';

const useApiStore = defineStore('api', {
  state: (): ApiState => ({
    sqlApi: `${baseUrl}/druid/index.html`,
    baseApi: `${baseUrl}/api`,
    websocketApi: websocketUrl,
  }),
  getters: {
    apiInfo(state: ApiState): ApiState {
      return { ...state };
    },
  },
});

export default useApiStore;
