import { appConfig } from '@/config/appConfig';
import { loadText, saveText, storageKeys } from '@/services/storageService';

export function syncVersionBaseline() {
  const savedBaseline = loadText(storageKeys.versionBaseline);

  if (!savedBaseline) {
    saveText(storageKeys.versionBaseline, appConfig.baselineVersion);
  }

  saveText(storageKeys.appVersion, appConfig.version);
}
