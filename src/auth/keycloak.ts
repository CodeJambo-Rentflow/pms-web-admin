import Keycloak from 'keycloak-js';

export const keycloak = new Keycloak({
  url: 'http://localhost:8088',
  realm: 'pms-kenya',
  clientId: 'pms-web-admin',
});

let initialized = false;

export async function initKeycloak() {
  if (initialized) return keycloak.authenticated;

  const auth = await keycloak.init({
    onLoad: 'login-required',
    checkLoginIframe: false,
    pkceMethod: 'S256',
  });

  initialized = true;

  setInterval(() => {
    keycloak
      .updateToken(30)
      .catch(() => console.warn('Failed to refresh token'));
  }, 30000);

  return auth;
}
