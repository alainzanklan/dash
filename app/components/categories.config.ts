import { categories } from '@/utils/Categories'; // <-- adjust this import path to match where your categories.ts actually lives

// Short editorial line per category. Add/edit here — falls back to a
// generic line if a label isn't listed.
const TAGLINES: Record<string, string> = {
  Milestones: 'Statement pieces for the moments worth remembering.',
  'Social Events': 'Turn heads at every gathering, effortlessly.',
  Casuals: 'Everyday ease, made with the same care as our finest pieces.',
  Corporates: 'Sharp, polished tailoring for the modern workday.',
  'Daily Accessories': 'The finishing details that complete every look.',
};

export const CATEGORY_BANNERS = categories
  .filter((cat) => cat.label !== 'All')
  .map((cat) => ({
    name: cat.label,
    categoryValue: cat.label,
    tagline: TAGLINES[cat.label] ?? 'Discover the collection.',
    image: cat.image,
  }));
