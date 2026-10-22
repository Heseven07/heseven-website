import { post } from './post';
import { author } from './author';
import { category } from './category';
import { blockContent } from './blockContent';
import { seo } from './seo';
import { landingPage, servicePage } from './landingPage';
import { sectionTypes } from './sections';
import { cta } from './sections/shared';

export const schemaTypes = [
  post,
  author,
  category,
  blockContent,
  seo,
  landingPage,
  servicePage,
  cta,
  ...sectionTypes,
];
