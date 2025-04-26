import { prisma } from "@/lib/db";
import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";

export const deleteLink = defineAction({
  accept: "json",
  input: z.object({
    id: z.string(),
  }),
  handler: async (input, context) => {
    const userId = context.locals.user?.id;

    if (!userId) {
      throw new ActionError({
        message: "User not authenticated",
        code: "UNAUTHORIZED",
      });
    }

    const deletedLink = prisma.link.delete({
      where: {
        id: input.id,
      },
    });

    return deletedLink;
  },
});
