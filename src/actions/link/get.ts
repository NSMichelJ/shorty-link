import { prisma } from "@/lib/db";
import { ActionError, defineAction } from "astro:actions";

export const getLinks = defineAction({
  handler: async (_, context) => {
    const userId = context.locals.user?.id;

    if (!userId) {
      throw new ActionError({
        message: "User not authenticated",
        code: "UNAUTHORIZED",
      });
    }

    const links = await prisma.link.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return links;
  },
});
