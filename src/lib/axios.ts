import axios from 'axios';

// --- Cold start state ---
// Simple pub/sub so any component can react to waking up state
type WakeListener = (waking: boolean) => void;
const listeners = new Set<WakeListener>();
let _isWakingUp = false;

export const coldStart = {
  get isWakingUp() {
    return _isWakingUp;
  },
  set(val: boolean) {
    if (_isWakingUp === val) return;
    _isWakingUp = val;
    listeners.forEach((fn) => fn(val));
  },
  subscribe(fn: WakeListener) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};

// --- Axios instance ---
const api = axios.create({
  baseURL: '/backend',
  withCredentials: true,
  timeout: 70_000, // 70s to survive Render cold starts
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    // Any successful response means server is awake
    coldStart.set(false);
    return response;
  },
  (error) => {
    const isNetworkError = !error.response;
    const isTimeout = error.code === 'ECONNABORTED';

    if (isNetworkError || isTimeout) {
      coldStart.set(true);
    }

    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
