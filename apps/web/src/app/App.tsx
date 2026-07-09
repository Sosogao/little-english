import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';

import { router } from '@/app/router';
import { appConfig } from '@/config/appConfig';
import { syncVersionBaseline } from '@/services/versionService';

export function App() {
  useEffect(() => {
    document.title = `${appConfig.productName} · ${appConfig.versionLabel}`;
    syncVersionBaseline();
  }, []);

  return <RouterProvider router={router} />;
}
