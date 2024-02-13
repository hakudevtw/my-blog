import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import tailwind from "@astrojs/tailwind";
import path from "path";
import fs from "fs";

// https://astro.build/config
export default defineConfig({
  // site: 'https://stargazers.club',
  integrations: [
    starlight({
      title: `Haku の`,
      components: { Header: "./src/components/Header.astro" },
      social: {
        github: "https://github.com/hakudevtw",
        linkedin: "https://linkedin.com/in/柏岳-陳-34000a227",
        email: "mailto:hakudevtw@gmail.com",
      },
      lastUpdated: true,
      pagination: false,
      editLink: { baseUrl: "https://github.com/hakudevtw/my-blog/edit/main/" },
      customCss: ["./src/tailwind.css"],
      sidebar: [
        {
          label: "Intro",
          link: "/notes/intro",
        },
        ...generateNotesSidebar(),
      ],
    }),
    tailwind({ applyBaseStyles: false }),
  ],
});

function generateNotesSidebar(baseUrl = "/notes", directoryPath = "./src/content/docs/notes") {
  try {
    const items = fs.readdirSync(directoryPath);
    const folders = items.filter((item) =>
      fs.statSync(path.join(directoryPath, item)).isDirectory()
    );

    const sidebar = folders.map((folder) => ({
      label: folder,
      autogenerate: { directory: `${baseUrl}/${folder}` },
    }));

    return sidebar;
  } catch (error) {
    console.error(`Error reading folders in ${directoryPath}:`, error.message);
    return [];
  }
}
