# Tyler Wilson’s portfolio

A responsive static website with no build tools, packages, or external font/icon dependencies. Open [index.html](./index.html) in a browser, or run `python -m http.server 8000` and visit `http://localhost:8000`. Deploy the files together to any static host, including GitHub Pages.

## Updating content

Edit [site-content.js](./site-content.js). Each named list contains ordinary JavaScript objects; copy an existing object to add another item. Keep commas between entries and quote text values. The order of entries controls their display order.

| Content | Where to edit |
| --- | --- |
| Biography, name, role, banner, portrait, résumé | `profile` |
| Social links and accessible icon labels | `socials` |
| Papers, conference information, DOI and PDF links | `publications` |
| Employment and role descriptions | `experience` |
| Teaching appointments | `teaching` |
| Degrees and awards | `education`, `awards` |
| Course descriptions and academic years | `courses` |
| Project descriptions, collaborators and deliverables | `projects` |
| Study materials | `resources` |

For example, prepend a publication to `publications`:

```js
{
  "title": "Your paper title",
  "year": "2027",
  "authors": "Author names",
  "type": "Research · Journal",
  "venue": "Journal or presentation details",
  "links": [
    { "label": "Read paper", "url": "content/publications/paper.pdf" },
    { "label": "DOI", "url": "https://doi.org/your-doi" }
  ]
}
```

Add a project by copying an existing entry in `projects`. Set `course` to the exact course code in `courses`, such as `CPEN 221`. Multiple projects can share a course. Optional links are `githubUrl`, `reportUrl`, `slidesUrl`, `videoUrl`, and `storyMapUrl`; omit any you do not have. Project cards and detail dialogs update automatically.

Add a resource once in `resources`, with its `title`, `description`, `url`, and a `courses` array, such as `["PHYS 157", "PHYS 158"]`. It appears both in the resource library and in every matching course. Course filters automatically highlight entries containing projects or resources.

Images can live in [content/photos](./content/photos). Change `profile.banner` or `profile.headshot` to their relative paths. A course can optionally have `image` and `imageAlt` fields; otherwise project courses use decorative line illustrations. Adjust image crops with `object-position` in [styles.css](./styles.css).

Most text is escaped automatically. Only `experience` bullet strings intentionally support trusted HTML, allowing inline links. Do not insert untrusted HTML there.

## Layout and appearance

[index.html](./index.html) contains section headings, navigation, and introductory interface copy. [styles.css](./styles.css) contains the palette, typography, spacing, and responsive layouts; color variables are at the top. [site.js](./site.js) renders content, searches courses/resources, and opens native keyboard-accessible project dialogs. Social SVG icons are defined there too.

After editing, refresh the browser, check the relevant course/resource search, and open any newly added links. Local paths are case-sensitive on most production hosts. Preserve filename capitalization and deploy PDFs/images alongside the site.
