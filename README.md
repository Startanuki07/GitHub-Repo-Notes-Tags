# ✨ Add Personal Notes, Categories, and Ratings to GitHub Repos

**This script adds a personal note, category tag, custom icon, and star rating to any repo on your GitHub lists.**

---

> 💡 **Overview**
> On GitHub's Starred repos, Your repositories, and Organization repositories pages, every listed repo gets a small badge showing a color-coded category tag and a personal note, both editable right where they appear. A settings panel lets you build your own categories and groups, swap the small icon shown in front of each repo's title for one from a large icon set, and turn on an optional 1–5 star rating. Everything you create — notes, categories, and settings — can be backed up to a file, restored later, or reset back to a clean slate at any time.

---

## 🎛 Getting Started

| Icon | Feature Name | Where It Appears |
|------|---|---|
| 🏷️ | Note & Category Badge | Automatically added next to every repo's title on your Starred repos, Your repositories, and Organization repositories pages |
| ✏️ | Note Editor | Click the pencil icon on a badge to add or change its note, category, and note color |
| ⚙️ | Settings Panel | Click the gear icon inside an open note editor for display, styling, and release-icon options |
| ⭐ | Star Rating | Appears under a badge once turned on in Settings — click a star to rate it, click the same star again to clear it |

## 🚀 Core Features

### 📝 Personal Notes

Attach a short private note to any repo, shown right next to its title.

- Click the pencil icon on a repo's badge to start typing.
- Give the note its own text color with a built-in color picker.
- Saves automatically when you click away or press Enter; press Escape to cancel without saving.

### 🏷️ Categories & Custom Groups

Tag repos with a color-coded category so you can tell what kind of project each one is at a glance.

- Choose from 18 ready-made categories (covering areas like AI/ML, Web, Mobile, DevOps, Security, and more) or create your own with a custom name and color.
- Organize your categories into your own tab groups so a long category list stays easy to browse.
- Remove a category or an entire group at any time; deleting a group also removes the categories inside it.

Example badge: `[ AI / ML ] — "worth revisiting for the RAG approach" ★★★★☆`

### 🎨 Custom Release Icons

Replace the small icon shown in front of each repo's title — it also links straight to that repo's Releases page.

- Pick from 89 icons across 8 themed sets — GitHub and dev-tool icons, media & creation, travel, sport, work, and more — or keep the default.
- Lock one icon so it displays for every repo at once; your individual per-repo choices are kept underneath and reappear the moment you unlock it.

### ⭐ Star Ratings

Give any repo a quick 1–5 star rating.

- Click a star to set the rating; click the same star again to clear it back to no rating.
- Off by default — turn it on from the Settings Panel.

- Breaks that total down by category with a simple bar chart.

## ⚠️ Experimental Features & Known Limitations

### Known Constraints & Limitations

- **Category deletion:** Removing a single category takes effect immediately with no confirmation step. Removing an entire group does ask for confirmation first, since it also removes every category inside that group.
- **Multiple open menus:** If more than one repo's category menu is open on the page at the same time, adding or removing a category in one won't refresh the others until you close and reopen them.
- **Group order:** Category groups always appear in the order you created them — there's no way to manually reorder them yet.

## ⚙️ Additional Features

### Appearance & Display Settings

Fine-tune how notes, category pills, and icons look across every repo, with a one-click reset back to default for each individual setting.

- Adjust the note's text size, and the category pill's glow, corner rounding, spacing, and overall size.
- Turn the release icon's glow on or off, and adjust its strength.
- Choose whether a repo's note appears before or after GitHub's own Public/Private label.
- Keep the edit pencil always visible, or only show it when you hover over a repo's row.

### Page Coverage

Choose which GitHub pages the script is active on.

- Toggle scanning on or off separately for Starred repos, Your repositories, and Organization repositories.
- Organization repositories is off by default, since it's a heavier page to scan.

### Category Menu Size

Cycle the category picker's own popup between three sizes — Small, Medium, and Large — using a button inside the picker itself.

## 🔐 Security & Privacy Notice

> This script stores everything you create — notes, categories, ratings, icon choices, and settings — using your userscript manager's own local storage. Nothing is uploaded or shared with any outside service.

| Data Type | Source | Purpose | Storage | Transmitted To |
|---|---|---|---|---|
| Repo notes, categories, ratings, and icon choices | Entered by you through each repo's badge | Let you personally annotate and organize the repos on your lists | Your browser's local userscript-manager storage | Not transmitted anywhere |
| Custom categories, groups, and display settings | Created or adjusted by you in the Settings Panel | Remember your own categories and preferred appearance across visits | Your browser's local userscript-manager storage | Not transmitted anywhere |

**This script does not collect, share, or transmit any of your data to a server — everything it stores stays on your own device.**

> 💡 A note, category, rating, or setting is only ever saved once you actively create or change it — nothing is recorded in the background beyond what you enter yourself. Exporting a backup file (see Backup, Restore & Reset above) is entirely optional and only happens when you click Export.

---

- This userscript is primarily maintained on Greasy Fork.
- Built with AI assistance by a hobbyist developer. Bug fixes and updates may not be immediate.
- Feedback is welcome. Responses may be assisted by translation tools if needed.
