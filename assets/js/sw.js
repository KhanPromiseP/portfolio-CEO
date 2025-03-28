const CACHE_NAME = 'form-submissions-v1';
const API_ENDPOINT = 'https://formsubmit.co/your@email.com';
const MAX_RETENTION_DAYS = 1; // Auto-purge submissions older than 1 day

// Main sync handler
self.addEventListener('sync', event => {
    if (event.tag === 'failedFormSubmission') {
        event.waitUntil(
            handleFailedSubmissions().catch(err => {
                logAnalytics('sync-error', err.message);
            })
        );
    }
});

// Periodic cleanup (runs daily)
self.addEventListener('periodicsync', event => {
    if (event.tag === 'cleanup-submissions') {
        event.waitUntil(cleanOldSubmissions());
    }
});

// ======================
// CORE FUNCTIONS (ACTUALLY USED)
// ======================

async function handleFailedSubmissions() {
    const cache = await caches.open(CACHE_NAME);
    const requests = await cache.keys();

    const results = await Promise.allSettled(
        requests.map(async request => {
            try {
                const response = await fetch(API_ENDPOINT, {
                    method: 'POST',
                    body: await cache.match(request).then(res => res.json()),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    await cache.delete(request);
                    logAnalytics('sync-success', request.url);
                    return true;
                }
                throw new Error('Server error');
            } catch (error) {
                logAnalytics('sync-retry', error.message);
                return false;
            }
        })
    );

    return results.some(r => r.value);
}

async function cleanOldSubmissions() {
    const cache = await caches.open(CACHE_NAME);
    const requests = await cache.keys();
    const now = Date.now();
    const dayInMs = 86400000;

    const deletions = await Promise.all(
        requests.map(async request => {
            const cached = await cache.match(request);
            const timestamp = new Date(cached.headers.get('date')).getTime();

            if (now - timestamp > dayInMs * MAX_RETENTION_DAYS) {
                await cache.delete(request);
                logAnalytics('cache-purged', request.url);
                return true;
            }
            return false;
        })
    );

    return deletions.filter(Boolean).length;
}

function logAnalytics(eventType, detail = '') {
    // Actually send analytics
    fetch('/analytics', {
        method: 'POST',
        body: JSON.stringify({
            type: eventType,
            detail,
            timestamp: new Date().toISOString()
        }),
        keepalive: true
    }).catch(() => {
        // Fallback to console if analytics fail
        console.log(`Analytics: ${eventType}`, detail);
    });
}

// ======================
// SERVICE WORKER LIFECYCLE
// ======================

self.addEventListener('install', () => {
    self.skipWaiting(); // Force activate new SW
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                .map(key => caches.delete(key))
            )
        )
    );
});