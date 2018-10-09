import env from './.env';

export const environment = {
  production: false,
  version: env.npm_package_version + '-dev',
  serverUrl: 'http://localhost:5000/api',
  defaultLanguage: 'en-US',
  supportedLanguages: ['en-US', 'pl-PL']
};
