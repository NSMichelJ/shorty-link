import type { Link } from "@prisma/client";
import { atom } from "nanostores";

export const $links = atom<Link[]>([]);
