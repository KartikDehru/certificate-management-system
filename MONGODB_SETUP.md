# MongoDB Atlas Setup Guide

## Step 1: Create MongoDB Atlas Account
1. Go to [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Click "Try Free" and create an account
3. Choose the **FREE** tier (M0 Sandbox)

## Step 2: Create a Cluster
1. Choose **AWS** as provider
2. Select a region close to you
3. Keep the default cluster name (Cluster0)
4. Click "Create Cluster"

## Step 3: Set Up Database Access
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and password (save these!)
5. Set privileges to "Read and write to any database"
6. Click "Add User"

## Step 4: Set Up Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

## Step 5: Get Connection String
1. Go to "Clusters" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" as driver
5. Copy the connection string (looks like this):
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## Step 6: Update Connection String
1. Replace `<password>` with your actual password
2. Replace `<dbname>` with `certificates` (or keep it as is)
3. Your final string should look like:
   ```
   mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/certificates?retryWrites=true&w=majority
   ```

## Step 7: Add to Vercel
1. Go to your Vercel project dashboard
2. Go to "Settings" → "Environment Variables"
3. Add a new variable:
   - **Name**: `MONGODB_URI`
   - **Value**: Your connection string from Step 6
4. Click "Save"

## Step 8: Deploy
1. Push your code to GitHub
2. Vercel will automatically redeploy
3. Your app will now use MongoDB for persistent storage!

## Testing
- Create a certificate as admin
- Refresh the page - certificate should still be there
- Verify the certificate using the ID
- Certificates are now stored permanently in MongoDB!

## Troubleshooting
- Make sure your MongoDB user has read/write permissions
- Check that your IP is whitelisted (or use 0.0.0.0/0)
- Verify the connection string is correct
- Check Vercel logs for any errors
