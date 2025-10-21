# Google Maps API Setup Guide

## Fix REQUEST_DENIED Error

### Step 1: Enable Required APIs
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to "APIs & Services" > "Library"
4. Enable these APIs:
   - **Maps JavaScript API**
   - **Geocoding API**

### Step 2: Set Up Billing
1. Go to "Billing" in Google Cloud Console
2. Link a billing account to your project
3. Add a payment method (credit card)

### Step 3: Create API Key
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the generated key

### Step 4: Restrict API Key
1. Click on your API key to edit it
2. Under "Application restrictions":
   - Select "HTTP referrers (web sites)"
   - Add these referrers:
     - `http://localhost:8080/*`
     - `http://127.0.0.1:8080/*`
     - `https://yourdomain.com/*` (if deployed)
3. Under "API restrictions":
   - Select "Restrict key"
   - Choose: Maps JavaScript API, Geocoding API
4. Save changes

### Step 5: Add to Environment
Add to your `.env` file:
```
GOOGLE_MAPS_API_KEY=your_api_key_here
```

### Step 6: Restart Server
```bash
npm start
```

## Alternative: Disable Maps (Temporary)
If you want to continue without maps, the app will work fine. Listings will be created without coordinates, and the map section won't show.

## Testing
1. Create a new listing with location like "Mumbai, India"
2. Check browser console for any API errors
3. Visit the listing show page to see if map appears
