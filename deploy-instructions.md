# 📋 Detailed Deployment Instructions

Step-by-step guide to deploy the IoT Dashboard to GitHub Pages.

## Prerequisites

- GitHub account (free)
- Git installed on your computer
- Basic command line knowledge

## Method 1: GitHub Web Interface (Easiest)

### Step 1: Create Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the **+** icon in the top right → **New repository**
3. Repository name: `iot-dashboard`
4. Description: "IoT Device Dashboard - Real-Time Sensor Monitoring"
5. Set to **Public** (required for free GitHub Pages)
6. **DO NOT** initialize with README, .gitignore, or license
7. Click **Create repository**

### Step 2: Upload Files

1. On the repository page, click **uploading an existing file**
2. Drag and drop all project files:
   - `index.html`
   - `style.css`
   - `app.js`
   - `data.json`
   - `manifest.json`
   - `sw.js`
   - `README.md`
   - `.gitignore`
3. Scroll down and click **Commit changes**

### Step 3: Enable GitHub Pages

1. Go to repository **Settings** (top menu)
2. Scroll to **Pages** section (left sidebar)
3. Under **Source**, select:
   - Branch: `main`
   - Folder: `/ (root)`
4. Click **Save**
5. Wait 2-5 minutes for deployment

### Step 4: Access Your Dashboard

Visit: `https://YOUR_USERNAME.github.io/iot-dashboard`

Replace `YOUR_USERNAME` with your GitHub username.

---

## Method 2: Command Line (Recommended for Developers)

### Step 1: Initialize Git

```bash
# Navigate to project directory
cd iot-dashboard

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial IoT Dashboard deployment"
```

### Step 2: Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Repository name: `iot-dashboard`
3. Set to **Public**
4. **DO NOT** initialize with any files
5. Click **Create repository**

### Step 3: Connect and Push

```bash
# Add remote repository (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/iot-dashboard.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

### Step 4: Enable GitHub Pages

1. Go to repository **Settings** → **Pages**
2. Source: **Deploy from branch "main"**
3. Folder: **/ (root)**
4. Click **Save**

### Step 5: Verify Deployment

- Check the **Actions** tab for deployment status
- Visit `https://YOUR_USERNAME.github.io/iot-dashboard`
- Wait 2-5 minutes if site doesn't load immediately

---

## Method 3: Using Deployment Script

### Step 1: Make Script Executable

```bash
chmod +x deploy.sh
```

### Step 2: Run Script

```bash
./deploy.sh
```

The script will:
- Initialize git (if needed)
- Add and commit files
- Prompt for your GitHub username
- Set up remote repository
- Push to GitHub

### Step 3: Enable GitHub Pages

Follow **Step 4** from Method 2 above.

---

## Post-Deployment Checklist

- [ ] Repository is public
- [ ] All files are in root directory
- [ ] GitHub Pages is enabled
- [ ] Branch is set to `main`
- [ ] Site is accessible at `username.github.io/iot-dashboard`
- [ ] Dashboard loads and displays data
- [ ] Chart is rendering correctly
- [ ] Refresh button works
- [ ] Mobile view is responsive

## Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file in root with your domain:
   ```
   yourdomain.com
   ```
2. In GitHub Pages settings, enter your custom domain
3. Update DNS records with your domain provider:
   - Type: `CNAME`
   - Name: `@` or `www`
   - Value: `YOUR_USERNAME.github.io`

## Troubleshooting

### Site shows 404

- **Wait 5-10 minutes**: GitHub Pages can take time to deploy
- **Check branch name**: Must be `main` or `master`
- **Verify file location**: `index.html` must be in root
- **Check repository visibility**: Must be public (or you have GitHub Pro)

### Changes not updating

- **Clear browser cache**: Hard refresh (Ctrl+F5 / Cmd+Shift+R)
- **Check Actions tab**: Verify deployment completed
- **Wait a few minutes**: Updates can take 2-5 minutes

### API errors in console

- **Normal behavior**: Dashboard falls back to simulated data
- **Check API keys**: If using OpenWeatherMap, verify key is correct
- **CORS issues**: All APIs used support CORS, but check browser console

### Chart not displaying

- **Check Chart.js CDN**: Ensure internet connection
- **Browser compatibility**: Use modern browser (Chrome, Firefox, Safari, Edge)
- **Clear cache**: May be cached old version

## Updating Your Dashboard

After making changes:

```bash
git add .
git commit -m "Update dashboard"
git push origin main
```

GitHub Pages will automatically redeploy (takes 2-5 minutes).

## Security Notes

- **API Keys**: Never commit real API keys to public repositories
- **Use Environment Variables**: For production, use GitHub Secrets
- **Rate Limits**: Be aware of API rate limits (OpenWeatherMap: 1,000/day)

## Need Help?

- Check [GitHub Pages Documentation](https://docs.github.com/en/pages)
- Review [README.md](README.md) for project details
- Open an issue on GitHub

---

**Deployment typically takes 2-5 minutes. Be patient!** ⏱️

