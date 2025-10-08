export default () => ({
    port: parseInt(process.env.PORT || '3000', 10),
    database: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      user: process.env.DB_USER,
      pass: process.env.DB_PASS,
      name: process.env.DB_NAME,
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      refreshSecret: process.env.JWT_REFRESH_SECRET,
      accessExpiry: process.env.JWT_EXPIRATION || '15m',
      refreshExpiry: process.env.JWT_REFRESH_EXPIRATION || '7d',
    },
    waha: {
      base: process.env.WAHA_BASE,
      key: process.env.WAHA_API_KEY,
      webhookSecret: process.env.WAHA_WEBHOOK_SECRET,
    },
  });
  