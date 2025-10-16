# Fetch News - Payment Processing Setup Guide

This guide will walk you through setting up real payment processing for the Fetch News app using Apple's StoreKit 2 and App Store Connect.

## Prerequisites

- Apple Developer Account ($99/year)
- App Store Connect access
- Xcode 14+ with StoreKit 2 support
- Backend deployed on Render (or similar service)

## Step 1: App Store Connect Setup

### 1.1 Create App Record
1. Go to [App Store Connect](https://appstoreconnect.apple.com/)
2. Click **"My Apps"** → **"+"** → **"New App"**
3. Fill in app details:
   - **Platform**: iOS
   - **Name**: Fetch News
   - **Primary Language**: English
   - **Bundle ID**: `com.yourcompany.fetchnews` (must match Xcode)
   - **SKU**: `fetchnews-ios-001`

### 1.2 Create Subscription Group
1. In your app, go to **"Features"** → **"In-App Purchases"**
2. Click **"+"** → **"Auto-Renewable Subscriptions"**
3. Create subscription group:
   - **Reference Name**: "Premium Features"
   - **App Store Display Name**: "Premium Features"

### 1.3 Create Subscription Product
1. In the subscription group, click **"+"** → **"Subscription"**
2. Fill in details:
   - **Product ID**: `com.fetchnews.premium.monthly`
   - **Reference Name**: "Premium Monthly"
   - **Subscription Duration**: 1 Month
   - **Price**: $3.99 (or your preferred price)
   - **Display Name**: "Premium Monthly"
   - **Description**: "Unlimited news summaries, all voices, priority processing"

### 1.4 Configure Subscription Settings
1. **Subscription Group Level**:
   - **Display Name**: "Premium Features"
   - **App Store Display Name**: "Premium Features"
2. **Subscription Level**:
   - **Free Trial**: None (or add if desired)
   - **Introductory Price**: None (or add if desired)
   - **Promotional Offers**: None (or add if desired)

## Step 2: Xcode Configuration

### 2.1 Update Bundle Identifier
1. Open your project in Xcode
2. Select your target → **"Signing & Capabilities"**
3. Set **Bundle Identifier** to match App Store Connect: `com.yourcompany.fetchnews`

### 2.2 Add StoreKit Capability
1. In **"Signing & Capabilities"**, click **"+ Capability"**
2. Add **"In-App Purchase"**
3. This enables StoreKit functionality

### 2.3 Create StoreKit Configuration File (for testing)
1. In Xcode, go to **File** → **New** → **File**
2. Choose **"StoreKit Configuration File"**
3. Name it `Products.storekit`
4. Add your subscription:
   - **Product ID**: `com.fetchnews.premium.monthly`
   - **Type**: Auto-Renewable Subscription
   - **Duration**: 1 Month
   - **Price**: $3.99

### 2.4 Configure Scheme for Testing
1. Go to **Product** → **Scheme** → **Edit Scheme**
2. Select **"Run"** → **"Options"**
3. Set **"StoreKit Configuration"** to your `Products.storekit` file

## Step 3: Backend Configuration

### 3.1 Add Apple Shared Secret
1. In App Store Connect, go to **"Users and Access"** → **"Keys"**
2. Create an **App Store Connect API Key** (if you don't have one)
3. Go to **"My Apps"** → **"App Information"** → **"App Store Connect API"**
4. Copy the **Shared Secret** (starts with a long string of characters)

### 3.2 Update Environment Variables
Add to your Render environment variables:
```
APPLE_SHARED_SECRET=your_shared_secret_here
```

### 3.3 Enable Production Receipt Validation
In `/backend/routes/subscriptions.js`, uncomment and implement the real Apple validation:

```javascript
// Replace the simulateReceiptValidation function with real Apple validation
async function validateReceiptWithApple(receipt, transactionID) {
  const https = require('https');
  
  const validationData = {
    'receipt-data': receipt,
    'password': process.env.APPLE_SHARED_SECRET,
    'exclude-old-transactions': true
  };
  
  const options = {
    hostname: 'buy.itunes.apple.com', // Use 'sandbox.itunes.apple.com' for testing
    port: 443,
    path: '/verifyReceipt',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve(response.status === 0); // 0 means valid
        } catch (error) {
          reject(error);
        }
      });
    });
    
    req.on('error', reject);
    req.write(JSON.stringify(validationData));
    req.end();
  });
}
```

## Step 4: Testing

### 4.1 Sandbox Testing
1. In App Store Connect, create **Sandbox Testers**:
   - Go to **"Users and Access"** → **"Sandbox Testers"**
   - Create test accounts with different regions
2. On your device, sign out of App Store
3. When prompted during purchase, use sandbox tester credentials
4. Test purchase, restore, and cancellation flows

### 4.2 Test Scenarios
- [ ] Successful purchase
- [ ] Purchase cancellation
- [ ] Restore purchases
- [ ] Subscription renewal
- [ ] Subscription cancellation
- [ ] Receipt validation
- [ ] Premium feature access

## Step 5: Production Deployment

### 5.1 App Store Review
1. **Archive** your app in Xcode
2. **Upload** to App Store Connect
3. **Submit for Review**:
   - Fill out app information
   - Add screenshots
   - Provide review notes
   - Submit for review

### 5.2 Production Checklist
- [ ] Bundle ID matches App Store Connect
- [ ] Subscription products are approved
- [ ] Backend uses production Apple servers
- [ ] Shared secret is configured
- [ ] Receipt validation is enabled
- [ ] Error handling is comprehensive
- [ ] Analytics are configured (optional)

## Step 6: Monitoring & Maintenance

### 6.1 App Store Connect Analytics
- Monitor subscription metrics
- Track conversion rates
- Analyze churn rates
- Review customer feedback

### 6.2 Backend Monitoring
- Monitor receipt validation success rates
- Track subscription status updates
- Log payment errors
- Monitor API performance

## Security Considerations

### Current Security Features ✅
- **bcrypt password hashing** (10 salt rounds)
- **JWT tokens** with 7-day expiration
- **Rate limiting** (100 requests per 15 minutes)
- **HTTPS only** (required for production)
- **Input validation** and sanitization
- **Secure receipt validation** with Apple

### Additional Security Recommendations
- **Regular security audits**
- **Monitor for suspicious activity**
- **Implement fraud detection**
- **Use environment variables** for secrets
- **Regular dependency updates**
- **Backup user data** regularly

## Troubleshooting

### Common Issues
1. **"Product not available"**: Check product ID matches App Store Connect
2. **"Invalid receipt"**: Verify shared secret and Apple server endpoints
3. **"Purchase failed"**: Check sandbox vs production environment
4. **"Subscription not active"**: Verify receipt validation logic

### Debug Steps
1. Check App Store Connect product status
2. Verify bundle ID matches
3. Test with sandbox environment first
4. Check backend logs for errors
5. Validate receipt format and content

## Support Resources

- [Apple StoreKit Documentation](https://developer.apple.com/documentation/storekit)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)
- [StoreKit Testing Guide](https://developer.apple.com/documentation/storekit/testing)
- [Receipt Validation Guide](https://developer.apple.com/documentation/storekit/original_api_for_in-app_purchase/validating_receipts_with_the_app_store)

---

**Note**: This setup enables real payment processing. Test thoroughly in sandbox before going live!
