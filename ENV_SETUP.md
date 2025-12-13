# Environment Variables Setup

## Required Environment Variables

### For Render Deployment

Set these in your Render dashboard under "Environment":

```
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=30d
```

## JWT_EXPIRE Format

The `JWT_EXPIRE` variable accepts time spans with the following units:
- `s` = seconds (e.g., `60s` = 60 seconds)
- `m` = minutes (e.g., `30m` = 30 minutes)
- `h` = hours (e.g., `24h` = 24 hours)
- `d` = days (e.g., `7d` = 7 days)

### Recommended Values:
- **Development**: `7d` (7 days)
- **Production**: `30d` (30 days)
- **Short-lived**: `24h` (24 hours)

### ❌ Invalid Values (will cause instant expiration):
- Empty string
- `0`
- `1` (without unit)
- Invalid format

## How to Update on Render:

1. Go to your Render dashboard
2. Select your service
3. Click "Environment" in the left sidebar
4. Find or add `JWT_EXPIRE`
5. Set value to: `30d`
6. Click "Save Changes"
7. Your service will automatically redeploy

## Verify Token Expiration

After deploying, check your logs. You should see:

```
🔑 [TOKEN] Generating token with expiration: 30d
⏰ [TOKEN] Token will expire at: 2025-01-12T09:34:49.000Z
⏳ [TOKEN] Time until expiration: 43200 minutes
```

If you see a very short expiration time (like 0 minutes), your `JWT_EXPIRE` is set incorrectly.
