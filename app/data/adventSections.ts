export interface AdventSection {
  id: number;
  enabled: boolean;
  redirectPath: string;
}

export const adventSections: AdventSection[] = [
  { id: 1, enabled: true, redirectPath: "/day1" },
  { id: 2, enabled: true, redirectPath: "/day2" },
  { id: 3, enabled: false, redirectPath: "/day3" },
  { id: 4, enabled: false, redirectPath: "/day4" },
  { id: 5, enabled: false, redirectPath: "/day5" },
  { id: 6, enabled: false, redirectPath: "/day6" },
  { id: 7, enabled: false, redirectPath: "/day7" },
  { id: 8, enabled: false, redirectPath: "/day8" },
  { id: 9, enabled: false, redirectPath: "/day9" },
  { id: 10, enabled: false, redirectPath: "/day10" },
  { id: 11, enabled: false, redirectPath: "/day11" },
  { id: 12, enabled: false, redirectPath: "/day12" },
  { id: 13, enabled: false, redirectPath: "/day13" },
  { id: 14, enabled: false, redirectPath: "/day/14" },
  { id: 15, enabled: false, redirectPath: "/day15" },
  { id: 16, enabled: false, redirectPath: "/day16" },
  { id: 17, enabled: false, redirectPath: "/day17" },
  { id: 18, enabled: false, redirectPath: "/day18" },
  { id: 19, enabled: false, redirectPath: "/day19" },
  { id: 20, enabled: false, redirectPath: "/day20" },
  { id: 21, enabled: false, redirectPath: "/day21" },
  { id: 22, enabled: false, redirectPath: "/day22" },
  { id: 23, enabled: false, redirectPath: "/day23" },
  { id: 24, enabled: false, redirectPath: "/day24" },
  { id: 25, enabled: false, redirectPath: "/day25" },
];
