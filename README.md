# Brinhildr Commerce Dashboard

<!-- mesbah-lab-credit -->
> **A Mesbah Lab freebie.** Designed and coded by us at [Mesbah Lab](https://mesbahlab.net).
>
> **More freebies:** [mesbahlab.net](https://mesbahlab.net)
>
> **Follow us:** [Instagram](https://www.instagram.com/themesbahlab/) · [X](https://x.com/mesbahlab) · [Facebook](https://www.facebook.com/profile.php?id=1421874334341579) · [Pinterest](https://www.pinterest.com/mesbahlab/) · [YouTube](https://www.youtube.com/channel/UCyPo3LFW1Xv8DkcEnRdB7Ug) · [Behance](https://www.behance.net/mesbahismail) · [GitHub](https://github.com/mesbahismail)
>
> **Enjoying this freebie?** [Support us with a donation on PayPal](https://paypal.me/mesbahlab). Your tip keeps designs free for everyone.
<!-- /mesbah-lab-credit -->

A responsive Next.js App Router dashboard based on the supplied Brinhildr design. The application uses shadcn/ui primitives for cards, menus, inputs, selects, avatars, and mobile navigation; Recharts powers the analytics charts.

The dashboard uses Poppins. The Next.js preview loads optimized Poppins font files with `next/font`; the installable dashboard stylesheet requests Poppins from Google Fonts for host apps.

## Run the preview

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Install the dashboard from the registry

The registry source is `registry.json`. Build its static manifests into `public/r`:

```bash
npm run registry:build
```

Deploy the Next.js application or host the generated `public/r` directory on a public static host. Once hosted, install the dashboard in a shadcn-compatible Next.js project:

```bash
npx shadcn@latest add https://YOUR_PUBLIC_HOST/r/brinhildr-dashboard.json
```

The dashboard block installs its page and local components. Its shadcn/ui primitives are declared through `registryDependencies`; `lucide-react` and `recharts` are declared through `dependencies`.

## Install individual components

```bash
npx shadcn@latest add https://YOUR_PUBLIC_HOST/r/brinhildr-sales-chart.json
npx shadcn@latest add https://YOUR_PUBLIC_HOST/r/brinhildr-earnings-chart.json
npx shadcn@latest add https://YOUR_PUBLIC_HOST/r/brinhildr-top-products.json
npx shadcn@latest add https://YOUR_PUBLIC_HOST/r/brinhildr-country-sales.json
npx shadcn@latest add https://YOUR_PUBLIC_HOST/r/brinhildr-category-breakdown.json
```

Individual charts and data cards are designed to be composed in an existing application. Their transitive shadcn/ui, CSV utility, card menu, and npm dependencies are described by the registry.

## Registry preview and validation

```bash
npm run registry:build
npx shadcn@latest add ./public/r/brinhildr-dashboard.json
```

Run the `add` command in a separate clean shadcn-compatible project after copying or hosting the generated item manifest. The checked-in `registry.json` is the source of truth; `public/r` is generated output.

## Official Registry Directory submission

The current submission instructions are documented at
[ui.shadcn.com/docs/registry/registry-index](https://ui.shadcn.com/docs/registry/registry-index).
The directory lists public registry namespaces; an ordinary public GitHub
registry can already be used with `owner/repo/item` addresses without directory
listing.

For directory submission:

- Publish the source under the included license and make the repository publicly accessible.
- Replace the `your-username` homepage and author placeholders with the public repository and maintainer details.
- Host a valid, schema-compliant flat registry with `/registry.json` and each item manifest at the registry root; registry source `files` entries must not contain `content`.
- Add the registry entry to `apps/v4/registry/directory.json` in the shadcn/ui repository, run `pnpm validate:registries`, and open a pull request for review.
- Confirm the hosted `shadcn add` URL and transitive dependencies in a clean supported project.

The registry has not been published or submitted, and directory acceptance has not been verified. This workspace also has no Git repository or public registry URL yet.
