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

Add a project by copying an existing entry in `projects`. Set `course` to the exact course code in `courses`, such as `CPEN 221`; the `course` field is optional, so independent research, personal builds, and future work can appear in the project showcase without being forced into a course. Set `highlight: true` when you want the project in the visual showcase; leave it out or set it to `false` for projects that should remain discoverable through their course. Multiple projects can share a course. Optional links are `githubUrl`, `reportUrl`, `slidesUrl`, `videoUrl`, and `storyMapUrl`; omit any you do not have. Add `image` and `imageAlt` when you have a project photo, map, screenshot, or diagram. Cards without images show an editor prompt suggesting a useful visual. Project cards and detail dialogs update automatically.

Add a resource once in `resources`, with its `title`, `description`, `url`, and a `courses` array, such as `["PHYS 157", "PHYS 158"]`. It appears both in the resource library and in every matching course. Course filters automatically highlight entries containing projects or resources.

Images can live in [content/photos](./content/photos). Change `profile.banner` or `profile.headshot` to their relative paths. A course can optionally have `image`, `imageAlt`, and `imageCaption` fields; otherwise courses use decorative discipline illustrations. Adjust image crops with `object-position` in [styles.css](./styles.css).

`imageAlt` is accessibility text: it becomes the image’s HTML `alt` attribute. Screen readers read it aloud, and browsers may show it if the image cannot load. It intentionally does not change the visible image, add a caption, or modify the crop. If you want words visible on the card, use `imageCaption`; if you want to change the image itself, update `image`.

Most text is escaped automatically. Only `experience` bullet strings intentionally support trusted HTML, allowing inline links. Do not insert untrusted HTML there.

## Layout and appearance

[index.html](./index.html) contains section headings, navigation, and introductory interface copy. [styles.css](./styles.css) contains the palette, typography, spacing, and responsive layouts; color variables are at the top. [site.js](./site.js) renders content, searches courses/resources, and opens native keyboard-accessible project dialogs. Social SVG icons are defined there too.

After editing, refresh the browser, check the relevant course/resource search, and open any newly added links. Local paths are case-sensitive on most production hosts. Preserve filename capitalization and deploy PDFs/images alongside the site.

## Athletics page

[athletics.html](./athletics.html) is a separate page; the academic portfolio remains one scrolling page. It shares [styles.css](./styles.css) and adds page-specific styling in [athletics.css](./athletics.css). Edit **[athletics-content.js](./athletics-content.js)** for races and the athletics banner. No build step or server is required.

### Add a race

Copy an entry in `races`. This example shows the available fields (replace the example values with your own result before adding it):

```js
{
  date: '2027-05-15',             // ISO date: YYYY-MM-DD
  event: '5000m',                // Display label, independent of grouping
  distanceMeters: 5000,          // Same value for 5000m track and 5km road/XC
  gait: 'run',                   // 'run' or 'walk'; keeps running separate from RW
  surface: 'track',              // 'track', 'road', or 'xc'
  performance: '18:24.52',        // Time, or 'DQ', 'DNF', 'NT'
  performanceNote: '',           // E.g. '+1.2 m/s' or 'downhill course'; shown in parentheses
  competition: 'Competition name',
  location: 'Venue, City, Country',
  points: null,                  // Manually entered number; null for no score
  place: 3,                     // A number or text such as '3 (heat)'; null if unknown
  resultsUrl: 'content/athletics/results.pdf', // Local file OR official https URL
  notes: ['PB'],                 // Optional notes, e.g. ['PB', 'NR']
  bestEligible: true             // Optional; false excludes this race from PB/SB calculations
}
```

Upload result files anywhere under `content` and use the matching relative path; the example path above is not a supplied file. Omit `resultsUrl` if no result document is available. If place is missing but a results link is present, the Place cell displays “Results”. Notes are entered manually and are not claims inferred from time comparisons. Record points are entered manually too, never calculated.

Times accept seconds, `mm:ss.ss`, or `hh:mm:ss.ss`. Track times retain two decimal places but omit leading zero units (`12:45.32` or `1:30:56.74`); road/XC display whole seconds without leading zero units (`12:45` or `1:31:57`). DQ/DNF/NT stay as text, never count as bests, and sort after timed results in the event view. Missing points sort last in points view. Unknown values remain dashes, not zeroes.

### Filters and best performances

- The year dropdown is generated from saved races, newest year first. The default order is most recent race first.
- Selecting an event automatically switches to fastest-first sorting. You can still sort the selected event by points or date. Reset restores all years/events and recent-first order.
- `distanceMeters` and `gait` define an event group: a 5km road run and a 5000m track run both use `5000` and `run`; 5kmRW uses `5000` and `walk`. `event` is only the displayed name.
- Odd-distance XC appears in the unfiltered history and points view but does not create an event dropdown option or PB/SB. Standard-distance XC, such as 5km, joins its matching event. The standard-distance list is in [athletics.js](./athletics.js).
- A season means a calendar year. The fastest eligible saved race in each year/event is bold, including ties. Filtering or sorting does not change the year's best.
- Set `bestEligible: false` for wind-assisted, downhill, short-course, or other performances you do not want counted as PB/SB. These results remain visible and still sort by their recorded times. A condition note alone does not change eligibility.
- Personal-best cards are calculated directly from `races`. Add or update a result once, and the corresponding PB card updates automatically. Track/road/XC equivalents are grouped here too.

### Athletics banner

The default [track-lane graphic](./content/photos/athletics-track.svg) is decorative. To use your own race photo, set `profile.banner` to its path and `profile.bannerAlt` to a short description. A wide photo with open space on the left will suit the header text. The crop is controlled by `.athletics-hero .banner` in [athletics.css](./athletics.css).
