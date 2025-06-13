import { LinkWithContent } from '../types/link';
import { isToday, isYesterday, subDays, startOfDay, startOfMonth, subMonths } from 'date-fns';

export type GroupedLinks = {
  [key: string]: LinkWithContent[];
};

export const groupLinksByDate = (links: LinkWithContent[]): GroupedLinks => {
  const groups: GroupedLinks = {
    Today: [],
    Yesterday: [],
    'Previous 7 Days': [],
    'This Month': [],
    'Last Month': [],
    Older: [],
  };

  const now = new Date();

  for (const link of links) {
    const linkDate = new Date(link.created_at);

    if (isToday(linkDate)) {
      groups.Today.push(link);
    } else if (isYesterday(linkDate)) {
      groups.Yesterday.push(link);
    } else if (linkDate >= subDays(startOfDay(now), 7)) {
      groups['Previous 7 Days'].push(link);
    } else if (linkDate >= startOfMonth(now)) {
      groups['This Month'].push(link);
    } else if (linkDate >= startOfMonth(subMonths(now, 1))) {
      groups['Last Month'].push(link);
    } else {
      groups.Older.push(link);
    }
  }

  // Remove empty groups
  for (const key in groups) {
    if (groups[key].length === 0) {
      delete groups[key];
    }
  }

  return groups;
}; 