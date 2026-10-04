import { getFacultyMember, listDepartments, listFaculty } from "./faculty";
import { listEvents } from "./events";
import { listNews } from "./news";
import { getPage } from "./pages";
import { getProgram, listPrograms } from "./programs";

/**
 * Mock implementations of the REST API, grouped by resource. Feature `data.ts` files pass
 * them to `apiRequest({ mock })`; they only run while API_BASE_URL is unset.
 */
export const mockApi = {
  pages: { get: getPage },
  programs: { list: listPrograms, get: getProgram },
  faculty: { list: listFaculty, get: getFacultyMember },
  departments: { list: listDepartments },
  news: { list: listNews },
  events: { list: listEvents },
};
