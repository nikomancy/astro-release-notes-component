# Release Notes Technical Implementation Plan

## 1. Content Collection Schema

Update `src/content.config.ts` to include a schema for the releases collection:

```ts
import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

// Define the schema for release notes
const releaseSchema = z.object({
  title: z.string(),
  date: z.string().transform(str => new Date(str)),
  excerpt: z.string(),
});

export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
  releases: defineCollection({ schema: releaseSchema }),
};
```

## 2. Fix Release Notes Page

Update `src/pages/release-notes.astro` to properly load and type the content collection:

```astro
---
import StarlightPage from '@astrojs/starlight/components/StarlightPage.astro';
import ReleaseNoteCard from '../components/ReleaseNoteCard.astro';
import { getCollection } from 'astro:content';

// Get all release notes from the content collection
const releaseEntries = await getCollection('releases');

// Sort release notes by date (newest first)
const sortedReleaseNotes = releaseEntries.sort(
  (a, b) => b.data.date.getTime() - a.data.date.getTime()
);
---

<StarlightPage frontmatter={{ 
  title: 'Release Notes',
  description: 'See what\'s new in the latest version of our app.',
  tableOfContents: false,
  template: 'splash',
}}>
  <div class="release-notes-container">
    <div class="release-notes-list">
      {sortedReleaseNotes.map(async (entry) => {
        const { Content } = await entry.render();
        return (
          <ReleaseNoteCard 
            title={entry.data.title} 
            date={entry.data.date.toISOString()} 
            content={entry.data.excerpt}
          >
            <Content />
          </ReleaseNoteCard>
        );
      })}
    </div>
  </div>
</StarlightPage>

<style>
  .release-notes-container {
    max-width: var(--sl-content-width);
    margin: 0 auto;
    padding: var(--sl-spacing-medium) var(--sl-spacing-large);
  }

  .release-notes-list {
    display: flex;
    flex-direction: column;
    gap: var(--sl-spacing-medium);
  }
</style>
```

## 3. Update Release Note Card Component

Ensure `ReleaseNoteCard.astro` props match the expected interface:

```astro
---
export interface Props {
  title: string;
  date: string;
  content: string;
}

const { title, date, content } = Astro.props;

// Format the date to match the design (MM/DD/YYYY)
const formattedDate = new Date(date).toLocaleDateString('en-US', {
  month: 'numeric',
  day: 'numeric',
  year: 'numeric'
});
---

<div class="release-note-card">
  <div class="release-note-header">
    <h2>{title}</h2>
    <time datetime={date}>{formattedDate}</time>
  </div>
  <div class="release-note-description">
    <p>{content}</p>
  </div>
  <div class="release-note-content">
    <slot />
  </div>
</div>

<!-- Keep existing styles -->
```

## 4. Testing Steps

1. Verify that the release notes are correctly loaded from the content collection
2. Check that the notes are sorted in reverse chronological order
3. Ensure that each card displays:
   - Title
   - Formatted date
   - Excerpt
   - Full content from MDX
4. Verify styling is consistent with Starlight theme 