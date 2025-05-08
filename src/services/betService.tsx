import api from './api';

export const createBet = async (formValues: FormData) => api.post<any>(`/bet/create`, formValues);

export const getAllBets = async () => api.get<any>(`/bet/`);
