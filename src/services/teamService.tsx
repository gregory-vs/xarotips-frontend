import api from './api';
import { Team } from '../types/Team';

export const getTeams = async () => api.get<Team[]>('/team/all-db');
