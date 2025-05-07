import api from './api';

export const getPlayersByTeam = async (team_id: number) => api.get<any>(`/player/team/${team_id}`);
