import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: { projectId: 'flt9h8js', dataset: 'production' },
  // Deployed Studio lives at https://heseven.sanity.studio
  studioHost: 'heseven',
  deployment: { appId: 'vdqkdzt3h33bjzt71e94njq7', autoUpdates: true },
});
