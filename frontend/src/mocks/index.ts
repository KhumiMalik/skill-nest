import { getVacancy, listVacancies } from "./careers";
import { getEvent, listEvents, registerForEvent } from "./events";
import { getFacultyMember, listDepartments, listFaculty } from "./faculty";
import { listFaqs } from "./faqs";
import { createAdmissionEnquiry, createContactMessage, createNewsletterSubscription } from "./forms";
import { getAlbum, listAlbums } from "./gallery";
import { getNewsArticle, listNews, listNewsCategories } from "./news";
import { getNotice, listNotices } from "./notices";
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
  news: { list: listNews, get: getNewsArticle, categories: listNewsCategories },
  notices: { list: listNotices, get: getNotice },
  events: { list: listEvents, get: getEvent, register: registerForEvent },
  faqs: { list: listFaqs },
  gallery: { list: listAlbums, get: getAlbum },
  careers: { list: listVacancies, get: getVacancy },
  forms: {
    contactMessage: createContactMessage,
    admissionEnquiry: createAdmissionEnquiry,
    newsletterSubscription: createNewsletterSubscription,
  },
};
