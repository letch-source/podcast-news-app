# MongoDB Setup for Fetch News Backend

## Current Status
The backend is now configured to work with or without MongoDB. If MongoDB is not available, it will use a fallback in-memory authentication system for development/testing.

## Setting up MongoDB for Production

### Option 1: MongoDB Atlas (Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Set the `MONGODB_URI` environment variable in Render

### Option 2: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Set `MONGODB_URI=mongodb://localhost:27017/fetchnews` in your environment

## Environment Variables

Add this to your Render environment variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fetchnews?retryWrites=true&w=majority
```

## Fallback Mode

If `MONGODB_URI` is not set, the app will:
- ✅ Continue running without crashing
- ✅ Use in-memory authentication for testing
- ✅ Allow basic user registration/login
- ⚠️ Data will be lost on server restart
- ⚠️ Not suitable for production

## Testing Authentication

### With MongoDB:
- Full user account system
- Persistent data
- Real subscription tracking

### Without MongoDB (Fallback):
- Test user: `test@example.com` / `password123`
- In-memory storage only
- Good for development/testing

## Next Steps

1. **For Development**: The fallback system works fine
2. **For Production**: Set up MongoDB Atlas and add the connection string
3. **For Testing**: Use the fallback test account

The app will automatically detect if MongoDB is available and use the appropriate authentication system.
