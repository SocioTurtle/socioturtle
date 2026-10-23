# socioturtle
curious community-driven platform designed to inspire curiosity, meaningful conversations, and knowledge sharing

## Handover: Quick Start for the App Owner

Follow these steps to load this project from Git, open it in Visual Studio Code, make changes, preview locally, and push updates back to the remote repository. This guide assumes a Windows environment but the commands are similar on macOS/Linux.

**Prerequisites:**
- **Git:** Install Git (https://git-scm.com/) and ensure `git` works in your terminal.
- **Visual Studio Code:** Install from https://code.visualstudio.com/.
- **Recommended VS Code extensions:** GitLens, Live Server, Prettier, GitHub Pull Requests, and your preferred AI assistant extension (e.g., GitHub Copilot Chat).

**Clone the repository:**
1. Open a terminal and run:

```bash
git clone <REPO_URL>
cd <repo-folder>
```

Replace `<REPO_URL>` with the repository HTTPS or SSH URL and `<repo-folder>` with the created folder name.

**Open in VS Code:**
1. From the terminal:

```bash
code .
```

**Preview the site locally:**
1. Open `index.html` in the editor and use the Live Server extension (right-click → "Open with Live Server") or open the file directly in your browser.
2. The site is static (HTML/CSS/JS). Pages load the prebuilt `tailwind.css`, so previewing needs no build step.

**Regenerate `tailwind.css` after changing Tailwind classes:**

`tailwind.css` contains only the Tailwind classes used in the HTML and JS files. After you add or change a Tailwind class, rebuild it, or the new class will have no effect on the live site.

1. Download the Tailwind CSS v3.4.17 standalone CLI for your platform from https://github.com/tailwindlabs/tailwindcss/releases/tag/v3.4.17 (for example `tailwindcss-macos-arm64` or `tailwindcss-windows-x64.exe`). Keep it outside the repository and rename it to `tailwindcss`.
2. From the repository root, run:

```bash
./tailwindcss -i tailwind.input.css -o tailwind.css --minify
```

3. Commit the updated `tailwind.css` together with your HTML or JS change.

Brand colors (`primary`, `secondary`, `dark`, `light`) are defined in `tailwind.config.js`.

**Using an AI agent in VS Code (recommended workflow):**
1. Install and enable your AI assistant extension (e.g., GitHub Copilot Chat).
2. When asking the AI to make changes, include this instruction: "Follow the project's AGENTS.md guidelines and preserve accessibility, SEO, and progressive enhancement." The AGENTS.md file is in the repo: [AGENTS.md](AGENTS.md).
3. Example prompts you can send to the AI agent:
	- "Improve accessibility of [index.html](index.html) and explain changes." 
	- "Refactor `script.js` to reduce global variables while keeping behavior identical." 
	- "Add ARIA attributes and keyboard focus handling to the navigation." 
4. Review AI-proposed edits in the editor before saving. The AI should suggest minimal, focused changes.

**Make changes locally:**
1. Create a feature branch:

```bash
git checkout -b feature/your-description
```

2. Make edits in VS Code. Save files and preview with Live Server.
3. Run a quick manual checklist (see below) before committing.

**Commit and push changes:**
```bash
git add .
git commit -m "Describe the change concisely"
git push -u origin feature/your-description
```

**Open a Pull Request:**
1. Use the GitHub/GitLab UI or the `gh` CLI to open a PR from your feature branch into the default branch.
2. In the PR description, mention that the work followed [AGENTS.md](AGENTS.md) guidelines and list manual checks performed.

**Manual pre-merge checklist:**
- **Accessibility:** Keyboard navigation, meaningful alt text, ARIA where necessary, single H1 per page.
- **SEO:** Unique title and meta description, correct heading hierarchy, descriptive link text.
- **Performance:** Minimize large images, defer non-critical JS, avoid render-blocking resources.
- **Quality:** No console errors, no broken links, no unused files left behind.

**Notes on AGENTS.md compliance:**
- The repository includes [AGENTS.md](AGENTS.md), which defines styling, accessibility, and testing expectations. Ask the AI agent to reference it when making changes.

**If you want the AI agent to apply changes automatically:**
- Use the agent to produce a workspace edit and preview it locally. Always review and test edits before committing. Do not accept blind edits without review.

**Contact & next steps:**
- If you want, I can also prepare a short checklist file (CHECKLIST.md) with the manual tests and quick commands. Reply if you'd like that created.

---
Project files of interest:
- [index.html](index.html) — home page and the sign-up dialog
- [about.html](about.html), [gallery.html](gallery.html), [testimonials.html](testimonials.html), [investors.html](investors.html), [contact.html](contact.html) — one page per menu item
- [archives.html](archives.html) — Our Journey: past events and milestones
- [styles.css](styles.css) — custom styles
- [tailwind.css](tailwind.css) — generated Tailwind utilities (do not edit by hand)
- [script.js](script.js) — home page behaviour, the sign-up dialog, and redirects from old `index.html#section` links
- [nav.js](nav.js) — mobile menu, shared by every page
- [sitemap.xml](sitemap.xml) and [robots.txt](robots.txt) — add new pages to the sitemap

