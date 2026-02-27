const { STRAPI_HOST, STRAPI_READ_TOKEN, STRAPI_FULLACCESS_TOKEN } = process.env;

export function queryRead(url: string) {
  return fetch(`${STRAPI_HOST}/api/${url}`, {
    headers: { Authorization: `Bearer ${STRAPI_READ_TOKEN}` },
  }).then((res) => res.json());
}

export function queryFullControl(url: string) {
  return fetch(`${STRAPI_HOST}/api/${url}`, {
    headers: { Authorization: `Bearer ${STRAPI_FULLACCESS_TOKEN}` },
  }).then((res) => res.json());
}
