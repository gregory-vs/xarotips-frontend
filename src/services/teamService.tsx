import api from './api';
import { OptionType } from '../types/OptionType';

export const getTeams = async () => api.get<OptionType[]>('/team/all-db');
