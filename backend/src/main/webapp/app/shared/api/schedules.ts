import axios from 'axios';

export interface Pageable {
  page?: number;
  size?: number;
  sort?: string[];
}

export interface ScheduleDTO {
  id: number;
  date?: string; // ISO string from server
  startTime?: string; // ISO string
  endTime?: string; // ISO string
  location?: string | null;
  course?: { id?: number; name?: string } | null;
  [key: string]: any;
}

const resourceUrl = 'api/schedules';

export async function list(params: Pageable = {}) {
  const response = await axios.get<ScheduleDTO[]>(resourceUrl, {
    params: {
      page: params.page ?? 0,
      size: params.size ?? 20,
      sort: params.sort,
    },
  });
  return { data: response.data, headers: response.headers };
}

export async function create(payload: Partial<ScheduleDTO>) {
  const response = await axios.post<ScheduleDTO>(resourceUrl, payload);
  return response.data;
}

export async function update(id: number, payload: Partial<ScheduleDTO>) {
  const response = await axios.put<ScheduleDTO>(`${resourceUrl}/${id}`, payload);
  return response.data;
}

export async function remove(id: number) {
  await axios.delete(`${resourceUrl}/${id}`);
}
