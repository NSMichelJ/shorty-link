import { $links } from "@/lib/storages";
import { useStore } from "@nanostores/react";
import type { Link } from "@prisma/client";
import { actions } from "astro:actions";
import {
  Copy,
  MousePointerClick,
  SquareArrowOutUpRight,
  Trash
} from "lucide-react";
import EditLink from "./Edit";

export default function LinkCard({ link }: { link: Link }) {
  const {id, slug, originalUrl, clicks, createdAt, expiresAt, } = link

  const links = useStore($links)

  const copyShortLink = (slug: string) => {
    const origin = window.location.origin;
    navigator.clipboard.writeText(`${origin}/s/${slug}`);
  }

  const deleteLink = async (id: string) => {
    const {data, error} = await actions.links.deleteLink({
      id
    })

    if (error) {
      console.log(error);
    } else if (data) {
      $links.set(links.filter(link => link.id !== data.id))
    }
  }

  return (
    <div className="rounded-md border border-gray-200 bg-gray-100 p-4 dark:border-gray-600 dark:bg-gray-700">
      <div className="flex items-center justify-between gap-4">
        <div className="w-full space-y-1">
          <div className="flex items-center gap-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
              /{slug}
            </h2>
            <div className="flex gap-2">
              <button
                className="cursor-pointer"
                onClick={() => copyShortLink(slug)}
              >
                <Copy size={18} />
              </button>
              <button className="cursor-pointer" onClick={() => deleteLink(id)}>
                <Trash size={18} />
              </button>
              <EditLink initialData={link} />
            </div>
          </div>
          <a
            href={originalUrl}
            className="flex cursor-pointer items-center gap-2 text-gray-800 underline dark:text-gray-300"
            target="_blank"
          >
            <SquareArrowOutUpRight size={18} className="no-underline" />
            {originalUrl}
          </a>
          <div className="flex gap-2 text-sm dark:text-gray-400">
            <span>
              {createdAt.toLocaleDateString("en-us", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
            {expiresAt && (
              <span>
                Expires:{" "}
                {expiresAt.toLocaleDateString("en-us", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            )}
          </div>
        </div>

        <span className="text-md inline-flex items-center gap-2 rounded-md border border-gray-300 bg-gray-200 px-2 py-1 font-medium dark:border-gray-500 dark:bg-gray-600">
          <MousePointerClick size={18} />
          {clicks}
        </span>
      </div>
    </div>
  );
}
