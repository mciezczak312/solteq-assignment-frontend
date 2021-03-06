import env from './.env';

export const environment = {
  production: true,
  version: env.npm_package_version,
  serverUrl: 'http://solteq-assignment.mciezczak.pl:9000/api',
  defaultLanguage: 'en-US',
  supportedLanguages: ['en-US', 'pl-PL']
};
