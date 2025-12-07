#!/bin/bash

# IoT Dashboard Deployment Script
# This script initializes a git repository and pushes to GitHub for GitHub Pages deployment

echo "🚀 IoT Dashboard Deployment Script"
echo "===================================="
echo ""

# Check if git is installed
if ! command -v git &> /dev/null && ! command -v git.exe &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    echo "   Download from: https://git-scm.com/downloads"
    exit 1
fi

# Initialize git repository if not already initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
else
    echo "✅ Git repository already initialized"
fi

# Add all files
echo "📝 Adding files to git..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Initial IoT Dashboard deployment" || {
    echo "⚠️  No changes to commit or commit failed"
}

# Check if remote exists
if git remote | grep -q "origin"; then
    echo "✅ Remote 'origin' already exists"
    REMOTE_URL=$(git remote get-url origin)
    echo "   Current remote: $REMOTE_URL"
    read -p "Do you want to update the remote? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter your GitHub username: " GITHUB_USERNAME
        git remote set-url origin "https://github.com/$GITHUB_USERNAME/iot-dashboard.git"
    fi
else
    read -p "Enter your GitHub username: " GITHUB_USERNAME
    echo "🔗 Adding remote repository..."
    git remote add origin "https://github.com/$GITHUB_USERNAME/iot-dashboard.git"
fi

# Set branch to main
echo "🌿 Setting branch to 'main'..."
git branch -M main

# Push to GitHub
echo "📤 Pushing to GitHub..."
read -p "Do you want to push to GitHub now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    git push -u origin main || {
        echo "❌ Push failed. Make sure:"
        echo "   1. The repository exists on GitHub"
        echo "   2. You have push permissions"
        echo "   3. You're authenticated (use: git config --global user.name and user.email)"
        exit 1
    }
    
    echo ""
    echo "✅ Deployment complete!"
    echo "🌐 Your dashboard will be available at:"
    echo "   https://$GITHUB_USERNAME.github.io/iot-dashboard"
    echo ""
    echo "📋 Next steps:"
    echo "   1. Go to your GitHub repository settings"
    echo "   2. Navigate to 'Pages' section"
    echo "   3. Select 'Deploy from branch: main'"
    echo "   4. Your site will be live in 2-5 minutes!"
else
    echo "⏭️  Skipping push. Run 'git push -u origin main' manually when ready."
fi

echo ""
echo "✨ Done!"

