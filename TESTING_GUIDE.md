# Testing Guide - Free Access to Premium Features

## 🎯 Multiple Ways to Test Premium Features

### **Method 1: Fallback Test Account (Easiest)**
- **Email**: `test@example.com`
- **Password**: `password123`
- **Status**: Free user (1 summary per day)
- **Perfect for**: Testing free tier limits and basic functionality

### **Method 2: iOS App Testing Button (Debug Only)**
1. **Build in Debug mode** (not Release)
2. **Go to Settings** in the app
3. **Scroll to Account section**
4. **Tap "Set Premium (Testing)"** button
5. **Instantly become premium** for testing
6. **Tap "Set Free (Testing)"** to go back to free

### **Method 3: Backend Admin Endpoint**
Send a POST request to your backend:

```bash
# Make user premium
curl -X POST https://your-backend-url.com/api/auth/admin/set-premium \
  -H "Content-Type: application/json" \
  -d '{"email": "your-email@example.com", "isPremium": true}'

# Make user free
curl -X POST https://your-backend-url.com/api/auth/admin/set-premium \
  -H "Content-Type: application/json" \
  -d '{"email": "your-email@example.com", "isPremium": false}'
```

### **Method 4: Direct Database (When MongoDB is set up)**
```javascript
// In MongoDB shell or admin interface
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { isPremium: true } }
)
```

## 🧪 Testing Scenarios

### **Free User Testing:**
1. **Register new account** or use test account
2. **Create 1 summary** → Should work
3. **Try to create 2nd summary** → Should show subscription screen
4. **Check usage indicator** → Should show "0 summaries left today"

### **Premium User Testing:**
1. **Use testing button** to set premium
2. **Create unlimited summaries** → Should work
3. **Check usage indicator** → Should show "Premium - Unlimited"
4. **No subscription prompts** → Should not appear

### **Subscription Flow Testing:**
1. **Hit daily limit** as free user
2. **Tap subscription screen** → Should show paywall
3. **Use testing button** to become premium
4. **Continue using app** → Should work normally

## 🔧 Development vs Production

### **Development (Current):**
- ✅ All testing methods work
- ✅ No real payments required
- ✅ Easy to switch between free/premium
- ✅ Perfect for development and testing

### **Production (Future):**
- 🔒 Remove testing buttons
- 🔒 Remove admin endpoint
- 🔒 Implement real StoreKit integration
- 🔒 Add receipt validation

## 📱 Quick Test Checklist

- [ ] **Register/Login** works
- [ ] **Free user** gets 1 summary per day
- [ ] **Daily limit** shows subscription screen
- [ ] **Testing button** switches premium status
- [ ] **Premium user** gets unlimited summaries
- [ ] **Usage indicators** update correctly
- [ ] **Settings** show correct status

## 🚀 Ready to Test!

You now have multiple ways to test all premium features without paying anything. The testing buttons will only appear in debug builds, so they won't show up in the App Store version.
