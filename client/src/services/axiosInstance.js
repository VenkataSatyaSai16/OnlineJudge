import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

const activeRequests = new Map();
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const originalGet = api.get;

api.get = function (url, config) {
    const key = url + (config ? JSON.stringify(config.params || {}) : "");
    
    const isCacheable = url.match(/^\/problems($|\/)|^\/leaderboard|^\/discussions|^\/profile/);
    
    if (isCacheable) {
        const cached = cache.get(key);
        if (cached && cached.expiry > Date.now()) {
            return Promise.resolve(cached.response);
        }
    }

    if (activeRequests.has(key)) {
        return activeRequests.get(key);
    }

    const requestPromise = originalGet.call(api, url, config)
        .then(response => {
            activeRequests.delete(key);
            if (isCacheable) {
                cache.set(key, { response, expiry: Date.now() + CACHE_TTL });
            }
            return response;
        })
        .catch(error => {
            activeRequests.delete(key);
            throw error;
        });

    activeRequests.set(key, requestPromise);
    return requestPromise;
};

// Export cache invalidation utility if needed
export const invalidateFrontendCache = (prefix) => {
    if (prefix) {
        for (const key of cache.keys()) {
            if (key.startsWith(prefix)) {
                cache.delete(key);
            }
        }
    } else {
        cache.clear();
    }
};

// Error handling standardisation
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // We will standardise toasts in components, but we can structure the error here.
        if (error.response && error.response.data && !error.response.data.message) {
             error.response.data.message = error.message;
        }
        return Promise.reject(error);
    }
);

export default api;