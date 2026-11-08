export type DisciplineTag = "olahraga" | "seni" | "fitness" | "kejohanan";

export interface AthleteMoment {
  id: string;
  athleteName: string;
  athleteHandle: string;
  athleteAvatar: string;
  clubName: string;
  state: string; // e.g., "Pahang", "Terengganu", "Selangor", "Kedah", "Sabah"
  discipline: DisciplineTag;
  trainingFocus: string;
  imageUrl: string;
  caption: string;
  timestamp: string; // e.g. "2 jam lalu", "Semalam", "3 hari lalu"
  likesCount: number;
  userLiked?: boolean;
  commentsCount: number;
  viewsCount?: number;
  verifiedAthlete?: boolean;
  tags: string[];
  isFeatured?: boolean;
  featuredTitle?: string;
  featuredSubtitle?: string;
}

export type MomentCategoryFilter = "semua" | DisciplineTag;
export type MomentStateFilter = "semua" | string;
