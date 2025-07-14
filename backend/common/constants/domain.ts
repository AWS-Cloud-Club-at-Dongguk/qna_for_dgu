export const DOMAIN =
  process.env.NODE_ENV === "test"
    ? process.env.DOMAIN_DEV!
    : process.env.DOMAIN_PROD!;