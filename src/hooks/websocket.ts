import useApiStore from '@/store/modules/api';
import { reactive } from 'vue';

export interface WebSocketConfig {
  url: string; // 地址
  onOpen: () => void;
  onClose: () => void;
  onMessage: (res: any) => void;
  onError: (res: any) => void;
}
export default function useWebSocket(cfg: WebSocketConfig) {
  return reactive({
    init: () => {
      const webSocket = new WebSocket(useApiStore().websocketApi + cfg.url);
      webSocket.onopen = cfg.onOpen;
      webSocket.onerror = cfg.onError;
      webSocket.onclose = cfg.onClose;
      webSocket.onmessage = cfg.onMessage;
      return webSocket;
    },
  });
}
