# Certificate Management System

A web application for issuing and verifying digital certificates with admin authentication.

## Features

- 🔐 **Admin Authentication**: Secure login system (admin/qwerty123)
- 📜 **Certificate Issuance**: Generate professional certificates with student details
- ✅ **Certificate Verification**: Public verification system using certificate IDs
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🎨 **Professional UI**: Clean, modern interface with white and orange branding

## Local Development

1. Clone or download this repository
2. Open `index.html` in your web browser
3. Or run a local server:
   ```bash
   npm install
   npm run dev
   ```

## Deployment to Vercel

### Method 1: Vercel CLI (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from your project directory**:
   ```bash
   vercel
   ```

4. **Follow the prompts**:
   - Set up and deploy? `Y`
   - Which scope? (Choose your account)
   - Link to existing project? `N`
   - What's your project's name? `certificate-management-system`
   - In which directory is your code located? `./`

5. **Your app will be deployed** and you'll get a URL like `https://your-app-name.vercel.app`

### Method 2: GitHub Integration

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/certificate-management-system.git
   git push -u origin main
   ```

2. **Go to [vercel.com](https://vercel.com)** and sign in
3. **Click "New Project"**
4. **Import your GitHub repository**
5. **Configure deployment**:
   - Framework Preset: `Other`
   - Root Directory: `./`
   - Build Command: Leave empty
   - Output Directory: Leave empty

6. **Click "Deploy"**

### Method 3: Drag & Drop

1. **Zip your project files** (excluding node_modules)
2. **Go to [vercel.com](https://vercel.com)**
3. **Drag and drop the zip file** onto the dashboard
4. **Your app will be deployed automatically**

## Usage

### Admin Access
- **Username**: `admin`
- **Password**: `qwerty123`

### Features
- **Issue Certificates**: Admin can create certificates with student name, course name, and completion date
- **Verify Certificates**: Anyone can verify certificates using the certificate ID
- **Download Certificates**: Certificates can be downloaded as PNG files
- **View Certificate List**: Admin can see all issued certificates

## File Structure

```
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── script.js           # JavaScript functionality
├── package.json        # Node.js dependencies
├── vercel.json         # Vercel configuration
└── README.md           # This file
```

## Security Notes

- Admin credentials are hardcoded for simplicity
- In production, consider using environment variables for credentials
- Certificate data is stored in browser memory (consider database for persistence)

## Customization

- Modify `styles.css` to change the appearance
- Update admin credentials in `script.js`
- Customize certificate template in the `generateCertificate()` function

## Support

For issues or questions, please check the code or create an issue in the repository.
