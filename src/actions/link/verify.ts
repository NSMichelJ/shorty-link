import { prisma } from "@/lib/db";
import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const checkIfSlugExist = defineAction({
  accept: "json",
  input: z.object({
    slug: z.optional(z.string()),
  }),
  handler: async (input) => {
    if (input.slug) {   
      const existingLink = await prisma.link.findUnique({
        where: { slug: input.slug },
      });

      if (existingLink) {
        return true;
      }
    }
    return false;
  },
});
