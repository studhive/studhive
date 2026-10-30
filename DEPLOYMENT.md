# Deploy Studhive on Vercel and connect studhive.org

The website source is in the repository root, `studhive/`. Vercel builds these files and publishes only `dist/`. There are no runtime dependencies or backend services to configure.

## 1. Push the website to GitHub

This checkout already points to `git@github.com:studhive/studhive.git`.

From the main `studhive/` directory, review your changes, commit the website files, and push your current branch:

```bash
git status
git add README.md DEPLOYMENT.md .gitignore .vercelignore package.json vercel.json build.mjs server.mjs site.config.mjs public/ scripts/
git commit -m "Build Studhive website and configure Vercel hosting"
git push -u origin HEAD
```

If you work on a feature branch, merge it into the branch you choose as Vercel’s production branch before launching.

## 2. Import the repository into Vercel

1. Sign in to [Vercel](https://vercel.com/new) with the GitHub account that can access `studhive/studhive`.
2. Add a new project and import that repository. If it is missing, grant Vercel’s GitHub integration access to it.
3. Set **Root Directory** to the repository root (`.`). Do not select `studhive-site` or `public`.
4. Confirm these settings:

| Setting | Value |
| --- | --- |
| Framework Preset | Other |
| Root Directory | Repository root (`.`) |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | Default |

`vercel.json` already supplies the build and output settings. The default installation step has no project dependencies to install. See [Vercel’s build configuration documentation](https://vercel.com/docs/builds/configure-a-build).

5. Click **Deploy**.
6. Open the returned `*.vercel.app` address. Check the home page, a programme page and Contact before connecting the domain.

Future pushes to the production branch trigger a new production deployment through the Git integration. See [Vercel’s deployment documentation](https://vercel.com/docs/deployments).

## 3. Add the domain to Vercel

1. Open the Studhive project in Vercel.
2. Go to **Settings → Domains**.
3. Add **studhive.org** to the production environment.
4. Add **www.studhive.org** as well, and configure it to redirect to **studhive.org**. If Vercel suggests the opposite redirect, choose the main domain instead so it matches the website’s configured address.
5. Keep this screen open. Vercel shows the exact DNS values required for this project.

The address in `site.config.mjs` is already `https://studhive.org`. No environment variables are required. If you later choose another primary address, change `origin` there or set a `SITE_URL` environment variable in Vercel and redeploy.

See [Vercel’s custom-domain guide](https://vercel.com/docs/domains/working-with-domains/add-a-domain) and [domain redirects](https://vercel.com/docs/domains/working-with-domains/deploying-and-redirecting).

## 4. Update DNS at Spaceship

Keep DNS hosted at Spaceship for this method. If the domain currently uses another provider’s nameservers, make these changes at that DNS provider instead; Spaceship’s inactive records will not affect the live domain.

1. Sign in to Spaceship.
2. Open **Advanced DNS Manager** and select **studhive.org**.
3. Open **DNS records → Custom records**.
4. Add or update these records using the exact targets displayed in Vercel:

| Type | Host | Value |
| --- | --- | --- |
| A | `@` | The IPv4 address shown for `studhive.org` in Vercel |
| CNAME | `www` | The project-specific hostname shown for `www.studhive.org` in Vercel |

Use **Add** to save each record. Leave TTL at its default. Copy the CNAME target as displayed, including its final dot if shown. Replace conflicting website records for these same hosts; keep existing email MX and TXT records.

If Vercel asks for a TXT record to verify ownership, add that exact host and value too. Use the values in your project’s Domains screen rather than an IP address or CNAME copied from an old tutorial: Vercel provides project-specific instructions.

See [Spaceship’s DNS record instructions](https://www.spaceship.com/knowledgebase/dns-records-types/) and [Vercel’s DNS troubleshooting guide](https://vercel.com/docs/domains/troubleshooting).

## 5. Confirm the connection

Return to **Vercel → Settings → Domains** and refresh the domain checks. Wait for valid configuration and an active HTTPS certificate. DNS changes may take time to reach your network; nameserver changes can take up to 48 hours, though this guide does not require changing nameservers.

Check:

- `https://studhive.org` opens the website over HTTPS.
- `https://www.studhive.org` redirects to `https://studhive.org`.
- Programme pages load when opened directly, not just through the menu.
- A nonexistent page shows the custom 404 page.

## 6. Finish the public launch

The current site still contains the four agreed placeholder groups, and its contact form prepares local drafts without sending messages. Replace these settings in `site.config.mjs` as the approved details become available.

Search indexing is intentionally disabled while this version contains placeholders. Once the content is ready, update the `noindex, nofollow` meta tag and the disallow-all `robots.txt` generation in `build.mjs`, then commit and push to redeploy.

## Alternative: deploy from your terminal

If you prefer not to import GitHub through the dashboard, run from `studhive/`:

```bash
npx vercel
```

Sign in when prompted, create or select the Studhive project, use the current directory as the root, and keep the settings from `vercel.json`. Review the deployment, then publish to production:

```bash
npx vercel --prod
```

Add the domain and DNS records using steps 3–5. The Vercel CLI creates local `.vercel/` state, which is ignored by Git. See the [Vercel CLI documentation](https://vercel.com/docs/cli/deploy).
