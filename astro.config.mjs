import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  // site: 'https://stargazers.club',
  integrations: [
    starlight({
      title: `Haku の Portfolio`,
      components: { Header: "./src/components/Header.astro" },
      social: {
        github: "https://github.com/hakudevtw",
        linkedin: "https://linkedin.com/in/柏岳-陳-34000a227",
      },
      lastUpdated: true,
      pagination: false,
      editLink: { baseUrl: "https://github.com/hakudevtw/my-blog/edit/main/notes/" },
      customCss: ["./src/tailwind.css"],
      sidebar: [
        {
          label: "Intro",
          link: "/notes/intro",
        },
        {
          label: "WebDev",
          autogenerate: { directory: "notes/WebDev" },
        },
      ],
    }),
    tailwind({ applyBaseStyles: false }),
  ],
});
