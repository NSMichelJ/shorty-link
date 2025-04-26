import { $links } from "@/lib/storages";
import { useStore } from "@nanostores/react";
import { useEffect, useState } from "react";
import LinkCard from "./Card";

import { actions } from "astro:actions";
import { LoaderCircle, SearchX, ServerCrash } from "lucide-react";

export default function Container() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const links = useStore($links);

  useEffect(() => {
    setLoading(true)
    setError(true)
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(false);
        const { data, error: fetchError } = await actions.links.getLinks();

        if (fetchError) {
          setError(true);
        } else if (data) {
          $links.set(data);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {loading && (
        <div className="mx-auto my-24 flex h-full w-full items-center justify-center gap-2 p-4 text-gray-500 dark:text-gray-400">
          <LoaderCircle size={54} className="animate-spin" />
        </div>
      )}

      {error && (
        <div className="mx-auto my-24 flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-gray-500 dark:text-gray-400">
          <ServerCrash size={54} />
          <p className="text-2xl font-semibold">Something went wrong</p>
        </div>
      )}

      {!loading && links.length === 0 && (
        <div className="mx-auto my-24 flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-gray-500 dark:text-gray-400">
          <SearchX size={54} />
          <p className="text-2xl font-semibold">No links found</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 2xl:grid-cols-2">
        {links.map((link) => (
          <LinkCard link={link} key={link.id}/>
        ))}
      </div>
    </>
  );
}
