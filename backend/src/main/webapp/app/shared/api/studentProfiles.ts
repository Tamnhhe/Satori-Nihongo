import axios from 'axios';

export interface Pageable {
  page?: number;
  size?: number;
  sort?: string[];
}

export interface StudentProfile {
  id: number;
  // Optional fields from backend DTO (tolerate unknown keys)
  fullName?: string;
  email?: string;
  level?: string;
  userId?: number;
  [key: string]: any;
}

const resourceUrl = 'api/student-profiles';

export async function list(params: Pageable & { filter?: string } = {}) {
  const response = await axios.get<StudentProfile[]>(resourceUrl, {
    params: {
      page: params.page ?? 0,
      size: params.size ?? 20,
      sort: params.sort,
      filter: params.filter,
    },
  });
  return { data: response.data, headers: response.headers };
}

export async function get(id: number) {
  const response = await axios.get<StudentProfile>(`${resourceUrl}/${id}`);
  return response.data;
}
