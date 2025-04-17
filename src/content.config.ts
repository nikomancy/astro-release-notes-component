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
