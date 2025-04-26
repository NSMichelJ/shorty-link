import { prisma } from "@/lib/db";
import { UpdateLinkSchema } from "@/lib/schemas";
import { ActionError, defineAction } from "astro:actions";

export const updateLink = defineAction({
  accept: "json",
  input: UpdateLinkSchema,
  handler: async (input, context) => {
    const userId = context.locals.user?.id;

    if (!userId) {
      throw new ActionError({
        message: "User not authenticated",
        code: "UNAUTHORIZED",
      });
    }

    const updatedLink = prisma.link.update({
      where: {
        id: input.id,
      },
      data: {
        slug: input.slug,
        originalUrl: input.originalUrl,
        expiresAt: input?.expiresAt ? new Date(input?.expiresAt) : null,
        userId: userId,
      },
    });

    return updatedLink;
  },
});
