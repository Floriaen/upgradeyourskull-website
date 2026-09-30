<h1 align="center">
  Upgrade Your Skull website
</h1>

## Quick start

Requires Node.js 22.12+ (pinned via Volta in `package.json`).

1.  **Install dependencies.**

    ```shell
    npm install
    ```

2.  **Start developing.**

    ```shell
    npm run dev
    ```

3.  **Open the code and start customizing!**

    Your site is now running at http://localhost:4321

## Production build

Build the site locally:

```shell
npm run build
```

Preview the production build:

```shell
npm run preview
```

## Deployment

The site is deployed using Docker via Coolify. Push to the `main` branch to trigger an automatic deployment.

The `Dockerfile` builds the Astro site and serves static files with nginx.
