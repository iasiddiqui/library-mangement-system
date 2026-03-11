# Production Readiness Checklist

## Completed Fixes

- [x] Fixed `.env` typo (removed stray "g")
- [x] Fixed `req.path` undefined crash (use `req.url` on Vercel)
- [x] Added try-catch wrapper in API handler to prevent crashes
- [x] DB connection wait for cold starts

---

## Required: Vercel Environment Variables

Add these in **Vercel Dashboard → Project → Settings → Environment Variables**:

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Yes | Strong random string (e.g. 32+ chars). **Never use default in production.** |

> Set both for **Production** (and Preview if you use branch deploys).

---

## MongoDB Atlas Setup

1. **Network Access** → Add IP Address → `0.0.0.0/0` (allow all, needed for Vercel)
2. **Database Access** → User has read/write permission
3. Connection string uses correct database name (e.g. `blog-cms` or `library_management`)

---

## Optional: Security Hardening

- [ ] Change JWT_SECRET from default to a strong random value (run: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- [ ] Restrict CORS in production (update `app.js` to allow only your domain)
- [ ] Use `helmet` for security headers

---

## Deploy Steps

1. Set env vars in Vercel
2. Push to Git and deploy (or `vercel --prod`)
3. Test: visit `/books.html` and verify books load
