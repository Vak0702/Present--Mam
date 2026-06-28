# Present Mam Deployment Notes

## Backend

Deploy the `backend` folder as a Node.js service.

- Install command: `npm install`
- Start command: `npm start`
- Health check path: `/api/health`
- Required environment variables:
  - `MONGO_URI`
  - `JWT_SECRET`
  - `CLIENT_URL`
  - `RESET_OTP_TTL_MINUTES`
  - `RESET_OTP_MAX_ATTEMPTS`
  - `RESET_OTP_RESEND_SECONDS`
  - `SMTP_HOST`
  - `SMTP_PORT`
  - `SMTP_SECURE`
  - `SMTP_USER`
  - `SMTP_PASS`
  - `SMTP_FROM`

Set `CLIENT_URL` to the deployed frontend origin, for example:

```text
https://your-frontend-site.netlify.app
```

Use a long random value for `JWT_SECRET`. Do not deploy the local `.env` file.

## Frontend

Deploy the `frontend` folder as a static site.

Before publishing, update `frontend/js/config.js` and replace:

```text
https://your-backend-url.example.com
```

with the deployed backend URL.

## Security Checklist

- Rotate any database password or JWT secret used during local development.
- Configure SMTP before production so password reset OTP emails are delivered.
- In MongoDB Atlas, allow network access from the deployed backend host.
- Keep `.env` files out of Git.
