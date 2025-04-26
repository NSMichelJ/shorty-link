import { createLink } from "./create";
import { deleteLink } from "./delete";
import { getLinks } from "./get";
import { updateLink } from "./update";
import { checkIfSlugExist } from "./verify";

export const links = {
  createLink,
  checkIfSlugExist,
  getLinks,
  deleteLink,
  updateLink,
};
