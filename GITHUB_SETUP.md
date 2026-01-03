# GitHub Setup Instructions

## Quick Setup Commands

After creating your repository on GitHub, run these commands:

### Replace YOUR_USERNAME with your actual GitHub username

```bash
# Add the remote repository
git remote add origin https://github.com/YOUR_USERNAME/student-management-system.git

# Verify the remote was added
git remote -v

# Push your code to GitHub
git push -u origin master
```

## If you get authentication errors:

### Method 1: Personal Access Token (Easiest)

1. Create a token at: https://github.com/settings/tokens
2. Select scope: `repo`
3. When pushing, use the token as your password

### Method 2: GitHub CLI (Recommended for future)

```bash
# Install GitHub CLI from: https://cli.github.com/
# Then authenticate:
gh auth login

# Create and push repository:
gh repo create student-management-system --public --source=. --push
```

### Method 3: SSH Key

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "hmizrifi2004@gmail.com"

# Add to GitHub: https://github.com/settings/keys
# Then use SSH URL:
git remote set-url origin git@github.com:YOUR_USERNAME/student-management-system.git
git push -u origin master
```

## Verify Your Repository

After pushing, visit:
https://github.com/YOUR_USERNAME/student-management-system

Your code should be visible there!

## Next Steps

1. Add a description to your repository
2. Add topics/tags: `react`, `nodejs`, `mongodb`, `student-management`, `education`
3. Enable GitHub Pages if you want to host the frontend
4. Set up GitHub Actions for CI/CD (optional)

## Troubleshooting

If you see "Authentication failed":
- Make sure you're using a Personal Access Token, not your GitHub password
- Password authentication is no longer supported by GitHub
- Use token or SSH key instead