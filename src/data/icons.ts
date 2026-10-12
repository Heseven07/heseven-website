/** 24×24 stroke icon paths, drawn by <Icon />. Single-weight line style (Lucide-like). */
export const icons = {
  code: 'M8 7 3 12l5 5m8-10 5 5-5 5M14 4l-4 16',
  migrate: 'M4 12h12m0 0-4-4m4 4-4 4M20 5v14',
  trend: 'M3 17 9 11l4 4 8-8m0 0h-5m5 0v5',
  bolt: 'M13 3 5 14h6l-1 7 8-11h-6l1-7Z',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm5-2 4 4',
  clock: 'M12 8v4l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  target:
    'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-4a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-4a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  users:
    'M16 20v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1m6.5-9a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM21 20v-1a4 4 0 0 0-3-3.9M15.5 4.1a3.5 3.5 0 0 1 0 6.8',
  report: 'M8 4h8l4 4v12H4V4h4Zm0 12v-3m4 3V9m4 7v-5',
  globe:
    'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-9-9h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3Z',
  sliders: 'M4 7h9m4 0h3M4 17h3m4 0h9M15 5v4M9 15v4',
  sparkles:
    'M12 3l1.8 4.7 4.7 1.8-4.7 1.8L12 16l-1.8-4.7-4.7-1.8 4.7-1.8L12 3Zm7 12 .8 2.2 2.2.8-2.2.8L19 21l-.8-2.2-2.2-.8 2.2-.8L19 15Z',
  layers: 'M12 3 3 8l9 5 9-5-9-5ZM3 12l9 5 9-5M3 16l9 5 9-5',
  heart: 'M12 20s-7-4.4-9.2-8.8A5 5 0 0 1 12 6a5 5 0 0 1 9.2 5.2C19 15.6 12 20 12 20Z',
} as const;

export type IconName = keyof typeof icons;
