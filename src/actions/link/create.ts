import { prisma } from "@/lib/db";
import { LinkSchema } from "@/lib/schemas";
import { ActionError, defineAction } from "astro:actions";

export const createLink = defineAction({
  accept: "json",
  input: LinkSchema,
  handler: async (input, context) => {
    const userId = context.locals.user?.id;

    if (!userId) {
      throw new ActionError({
        message: "User not authenticated",
        code: "UNAUTHORIZED",
      });
    }

    const createdLink = prisma.link.create({
      data: {
        slug: input.slug || undefined,
        originalUrl: input.originalUrl,
        expiresAt: input?.expiresAt ? new Date(input?.expiresAt) : null,
        userId: userId,
      },
    });

    return createdLink;
  },
});
