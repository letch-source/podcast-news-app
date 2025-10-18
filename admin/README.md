# FetchNews Admin Dashboard

A comprehensive admin dashboard for managing your FetchNews app with analytics, user management, and subscription tracking.

## Features

- **Dashboard Overview**: Real-time statistics and charts
- **User Management**: View, manage, and delete users
- **Analytics**: Popular topics, usage patterns, and growth metrics
- **Subscription Management**: Track premium users and revenue
- **Secure Access**: Token-based authentication

## Setup

### 1. Set Admin Token

Add this to your backend `.env` file:

```bash
ADMIN_SECRET_TOKEN=your-secure-admin-token-here
```

**Important**: Use a strong, random token. You can generate one with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Access the Dashboard

Once your backend is running, visit:

```
http://localhost:3001/admin
```

Or if deployed:

```
https://your-backend-url.com/admin
```

### 3. Login

Use the admin token you set in step 1 to log in.

## Dashboard Sections

### Overview
- Total users and premium users
- Daily summary generation
- Revenue tracking
- User growth charts
- Daily usage charts

### Users
- View all users in a table
- Search and filter users
- Toggle premium status
- Delete users
- View user details

### Analytics
- Popular topics chart
- Summary length preferences
- Usage patterns

### Subscriptions
- Active subscription count
- Monthly revenue
- Conversion rates

### Settings
- Update admin token
- System configuration

## Security

- All admin endpoints require the admin token
- Tokens are verified on every request
- Admin actions are logged
- No hardcoded admin access

## API Endpoints

The admin dashboard uses these API endpoints:

- `POST /api/admin/verify` - Verify admin token
- `GET /api/admin/overview` - Get dashboard overview
- `GET /api/admin/users` - Get all users
- `GET /api/admin/analytics` - Get analytics data
- `GET /api/admin/subscriptions` - Get subscription data
- `POST /api/admin/set-premium` - Set user premium status
- `DELETE /api/admin/delete-user` - Delete user
- `POST /api/admin/update-token` - Update admin token

## Customization

You can customize the dashboard by:

1. **Modifying `admin.js`** - Add new features or change existing ones
2. **Updating `index.html`** - Change the UI layout or styling
3. **Adding new API endpoints** - Extend the backend functionality

## Troubleshooting

### Can't access the dashboard
- Check that your backend is running
- Verify the admin token is set correctly
- Check browser console for errors

### Charts not loading
- Ensure Chart.js is loading properly
- Check that API endpoints are returning data
- Verify admin token is valid

### Users not showing
- Check database connection
- Verify fallback authentication is working
- Check server logs for errors

## Production Deployment

For production:

1. **Use HTTPS** - Never use HTTP for admin access
2. **Strong admin token** - Use a cryptographically secure token
3. **Regular backups** - Backup your database regularly
4. **Monitor logs** - Keep an eye on admin actions
5. **Update regularly** - Keep dependencies updated

## Support

If you need help:

1. Check the server logs for errors
2. Verify all environment variables are set
3. Test API endpoints directly
4. Check browser developer tools for client-side errors
