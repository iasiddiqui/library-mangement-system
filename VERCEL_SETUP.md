# Vercel Deployment Fix – Admin Login Not Working

## Why Admin Login Fails on Live (503 Error)

The API returns **"Database connecting. Please try again in a few seconds"** because MongoDB is not connecting in time on Vercel (or at all).

## Required Steps

### 1. Add Environment Variables in Vercel

1. Go to [vercel.com](https://vercel.com) → your project
2. **Settings** → **Environment Variables**
3. Add:

| Name         | Value                                                                 |
|--------------|-----------------------------------------------------------------------|
| `MONGODB_URI`| `mongodb+srv://blog-cms:YOUR_PASSWORD@cluster0.eic0d.mongodb.net/blog-cms?retryWrites=true&w=majority` |
| `JWT_SECRET` | A strong random string (e.g. generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`) |

> Use the same `MONGODB_URI` as in your `.env` file (your real password).

4. Save and redeploy (Deployments → ⋮ on latest → Redeploy).

### 2. MongoDB Atlas Network Access

1. Go to [MongoDB Atlas](https://cloud.mongodb.com) → your cluster
2. **Network Access** → **Add IP Address**
3. Add `0.0.0.0/0` (Allow access from anywhere)

Vercel uses changing IPs, so Atlas must allow all IPs.

### 3. Redeploy

After setting env vars and network access, redeploy the project. Admin login should work.
