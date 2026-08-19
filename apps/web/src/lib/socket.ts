import { io } from 'socket.io-client';

const API_ORIGIN =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '') || 'http://localhost:3001';

export const policiesSocket = io(`${API_ORIGIN}/policies`, {
  autoConnect: false,
  withCredentials: true,
  transports: ['websocket', 'polling'],
});