/* =====================================
   VERCEL WEB ANALYTICS
   ===================================== */

import { inject } from '@vercel/analytics';

// Initialize Vercel Web Analytics
inject({
  mode: 'auto', // Automatically detects environment (production/development)
});
