import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  // site: 'https://stargazers.club',
  integrations: [
    starlight({
      title: `Haku の ノット`,
      logo: {
        light: "./src/assets/logo.webp",
        dark: "./src/assets/logo.webp",
        alt: "Haku Bear",
      },
      social: {
        github: "https://github.com/withastro/starlight",
      },
      editLink: {
        baseUrl: "https://github.com/withastro/starlight/edit/main/docs/",
      },
      sidebar: [
        {
          label: "Guides",
          items: [
            // Each item here is one entry in the navigation menu.
            { label: "Example Guide", link: "/guides/example/" },
          ],
        },
        {
          label: "Reference",
          autogenerate: { directory: "reference" },
        },
      ],
      customCss: ["./src/tailwind.css"],
    }),
    tailwind({ applyBaseStyles: false }),
  ],
});
