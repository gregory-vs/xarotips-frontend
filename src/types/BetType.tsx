import type { Dayjs } from 'dayjs';

export interface BetType {
    id: number;
    playerName: string;
    teamName: string;
    type: string;
    value: number;
    status: string;
    odd: number;
    score: number;
    createdAt: Dayjs
  }