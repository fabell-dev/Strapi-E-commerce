const { STRAPI_HOST, STRAPI_READ_TOKEN } = process.env;

export function queryRead(url: string) {
  return fetch(`${STRAPI_HOST}/api/${url}`, {
    headers: { Authorization: `Bearer ${STRAPI_READ_TOKEN}` },
  }).then((res) => res.json());
}
