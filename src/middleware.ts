import { auth } from "@/lib/auth";
import { defineMiddleware } from "astro:middleware";
import { prisma } from "./lib/db";

export const onRequest = defineMiddleware(async (context, next) => {
  const isAuthed = await auth.api.getSession({
    headers: context.request.headers,
  });

  if (isAuthed) {
    context.locals.user = isAuthed.user;
    context.locals.session = isAuthed.session;
  } else {
    context.locals.user = null;
    context.locals.session = null;
  }

  if (context.url.pathname === "/auth" && isAuthed) {
    return context.redirect("/dashboard");
  }

  if (context.url.pathname.startsWith("/dashboard") && !isAuthed) {
    return context.redirect("/auth");
  }

  if (context.url.pathname.startsWith("/s/")) {
    const slug = context.url.pathname.slice(3);
    const link = await prisma.link.findUnique({
      where: {
        slug,
      },
    });

    if (link) {
      if (link.expiresAt && link.expiresAt < new Date()) {
        return new Response("Link expired", { status: 400 });
      }
      return context.redirect(link.originalUrl);
    }
  }

  return next();
});
