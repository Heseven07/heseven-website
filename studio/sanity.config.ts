import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemaTypes';

export default defineConfig({
  name: 'default',
  title: 'Heseven Website',
  projectId: 'flt9h8js',
  dataset: 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.documentTypeListItem('landingPage').title('Landing pages'),
            S.documentTypeListItem('post').title('Blog posts'),
            S.divider(),
            S.documentTypeListItem('category').title('Categories'),
            S.documentTypeListItem('author').title('Authors'),
          ]),
    }),
    visionTool(), // GROQ query playground (Studio → Vision tab)
  ],
  schema: { types: schemaTypes },
});
