# Neural Birds

Neuroevolution simulator based on the popular flappy bird mobile game. Simulation uses neural networks and genetic algorithms to create optimized birds that survive trough the course. Click [here](https://www.neuralbirds.com/) to test and [here](https://www.youtube.com/watch?v=zGWXS5YHu0w) for video

![alt text](./public/pic.JPG)

## Built With

- React
- TypeScript
- Vite
- Tensorflow.js
- Chart.js

## Development

Requires Node.js 24 (`.nvmrc`) and pnpm 12 (`packageManager` in `package.json`).

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # production build into dist/
```

See [AGENTS.md](./AGENTS.md) for the full list of checks.

## Deploy (Cloudflare)

The app deploys as static assets on a Cloudflare Worker. `wrangler.jsonc` serves
`dist/`, and `public/_headers` (copied into `dist/` by Vite) sets the security and
cache headers. `wrangler` is a pinned devDependency, so the deploy uses the lockfile
version rather than `npx`.

There is no CI deploy job. To connect the repo in the Cloudflare dashboard
(Workers & Pages → Create → Import a repository):

| Setting        | Value                       |
| -------------- | --------------------------- |
| Root directory | `/`                         |
| Build command  | `pnpm build`                |
| Deploy command | `pnpm exec wrangler deploy` |

Also set these build variables (Settings → Build → Variables), so Cloudflare installs
dependencies with the repo's toolchain. The install runs before the build command,
so pinning versions there would be too late:

| Variable       | Value     |
| -------------- | --------- |
| `NODE_VERSION` | `24.21.0` |
| `PNPM_VERSION` | `12.4.2`  |

Keep them in step with `.nvmrc` and the `packageManager` field.

To deploy from your machine instead, run `pnpm exec wrangler login` once, then
`pnpm run deploy`. Use `pnpm run deploy`, not `pnpm deploy`: `deploy` is also a
built-in pnpm command, and the shorthand runs that one instead of the script.

To serve the app on a custom domain, the domain needs to be an active zone in the
same Cloudflare account. Then add it under the Worker's Settings → Domains & Routes
→ Custom Domain. Cloudflare creates the DNS record itself, and refuses a hostname
that already has a CNAME.

The Content-Security-Policy in `public/_headers` allows only this origin plus
Cloudflare Web Analytics. Loading scripts, fonts, images or APIs from any other
origin needs a matching entry there, or the browser blocks it in production (the
Vite dev server does not apply `_headers`).

## Simulation

In the setup select initial gap width and number of birds. Lower number of birds means faster performance but changes for creating optimized birds are lower. If the birds won't survive past the first pipes in 20 rounds restart evolution if necessary. Simulation can be speeded up to 100x.

## Evolution

Bird fitness is measured by the distance the bird survives. Highest scoring birds are chosen to the mating pool and are ranked by percentage (individual points/total points) so that the most fitted birds are more likely to pass genes on.

Each offspring has two parents that are chosen from the pool. Offspring "dna" is combination of its parents neural network weights. In addition offspring has a change of mutating its weights.

## Visuals

- Neural Network
  - Neural network layout visualized
  - Change layout in the settings
- Bird view
  - Bird Input/Output data visualized
- Family tree
  - Select bird from current generation to see its parents and grandparents
  - Each bird is mapped by:
    - ID
    - Fitness
    - Score
  - Additional color option to based on the bird score
  - DNA
    - Neural network weight values visualized in radar chart
    - Updates every time new generation is created

![alt text](./public/dna.JPG)
![alt text](./public/tree.JPG)
