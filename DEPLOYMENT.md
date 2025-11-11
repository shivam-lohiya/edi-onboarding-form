# GitHub Pages Deployment Guide

This guide will help you deploy the EDI Onboarding Form to GitHub Pages.

## Prerequisites

- A GitHub repository for this project
- GitHub account with appropriate permissions
- Git installed on your local machine

## Deployment Steps

### 1. Enable GitHub Pages

1. Go to your GitHub repository on GitHub.com
2. Click on **Settings** (in the repository menu)
3. Scroll down to the **Pages** section in the left sidebar
4. Under **Source**, select **GitHub Actions** (not the legacy "Deploy from a branch" option)

### 2. Push Your Changes

Make sure all the configuration files are committed and pushed to your repository:

```bash
git add .
git commit -m "Configure GitHub Pages deployment"
git push origin main
```

**Note:** If your default branch is named something other than `main` (e.g., `master`), update the branch name in `.github/workflows/deploy.yml` accordingly.

### 3. Automatic Deployment

Once you push to the `main` branch:
- The GitHub Actions workflow will automatically trigger
- It will build your application
- Deploy it to GitHub Pages
- You can monitor the deployment progress in the **Actions** tab of your repository

### 4. Access Your Deployed Site

After successful deployment, your site will be available at:

```
https://<your-username>.github.io/edi-onboarding-form/
```

Replace `<your-username>` with your GitHub username or organization name.

## Manual Deployment (Alternative Method)

If you prefer to deploy manually using the gh-pages package:

### Install gh-pages

```bash
npm install --save-dev gh-pages
```

### Deploy Manually

```bash
npm run deploy
```

This will build the project and push the `dist` folder to the `gh-pages` branch.

**Note:** For manual deployment, you'll need to change the GitHub Pages source in Settings > Pages to "Deploy from a branch" and select the `gh-pages` branch.

## Configuration Files

### vite.config.js

The `base` path is set to `/edi-onboarding-form/` to match the repository name. If your repository has a different name, update this value:

```javascript
export default defineConfig({
  plugins: [react()],
  base: '/your-repo-name/',
})
```

### GitHub Actions Workflow

The deployment workflow is defined in `.github/workflows/deploy.yml` and will:
- Trigger on every push to the `main` branch
- Can also be triggered manually from the Actions tab
- Build the application using `npm run build`
- Deploy to GitHub Pages automatically

## Troubleshooting

### 404 Errors on Refresh

If you get 404 errors when refreshing pages or using direct URLs, you may need to:
1. Add a `404.html` file that redirects to `index.html`
2. Or configure your routing to use hash-based routing

### Workflow Permissions Error

If the workflow fails due to permissions:
1. Go to Settings > Actions > General
2. Scroll to "Workflow permissions"
3. Select "Read and write permissions"
4. Save changes and re-run the workflow

### Build Fails

If the build fails:
1. Check the Actions tab for error details
2. Ensure all dependencies are listed in `package.json`
3. Test the build locally with `npm run build`
4. Check that Node version in workflow matches your local version

## Environment Variables

If your application uses environment variables:

1. Create `.env` files for different environments
2. For production secrets, use GitHub Secrets:
   - Go to Settings > Secrets and variables > Actions
   - Add your secrets
   - Reference them in the workflow file

## Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file in the `public` folder with your domain name
2. Configure DNS settings with your domain provider
3. In GitHub Settings > Pages, add your custom domain
4. Enable "Enforce HTTPS"

## Monitoring Deployments

- View deployment status in the **Actions** tab
- Each deployment creates a new run with detailed logs
- Failed deployments will show error messages

## Updating the Site

Every time you push changes to the `main` branch:
- GitHub Actions automatically rebuilds and redeploys
- Changes typically appear within 1-2 minutes
- Clear browser cache if changes don't appear immediately

## Support

For issues with:
- **Application**: Check application logs and console errors
- **Deployment**: Check GitHub Actions logs
- **GitHub Pages**: Refer to [GitHub Pages documentation](https://docs.github.com/en/pages)
