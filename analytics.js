/* =====================================
   VERCEL WEB ANALYTICS
   ===================================== */

import { inject } from 'https://cdn.jsdelivr.net/npm/@vercel/analytics@1/dist/index.mjs';

// Initialize Vercel Web Analytics
inject({
  mode: 'auto', // Automatically detects environment (production/development)
});
