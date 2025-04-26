import { zodResolver } from "@hookform/resolvers/zod";
import { actions } from "astro:actions";
import { PlusCircle, X } from "lucide-react";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

import { LinkSchema } from "@/lib/schemas";
import { $links } from "@/lib/storages";
import { cn } from "@/lib/utils";

interface FormInput {
  originalUrl: string;
  slug?: string;
  expiresAt?: string;
}

export default function CreateLink() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    reset,
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LinkSchema),
  });

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    setLoading(true);

    const { data: exitsSlug } = await actions.links.checkIfSlugExist({
      slug: data.slug,
    });

    if (exitsSlug) {
      setError("slug", {
        message: "Slug already exists",
      });
      console.log("Slug already exists, please choose another one.");
      setLoading(false);
      return;
    }

    const { data: result, error } = await actions.links.createLink(data);

    if (error) {
      console.error("Error creating link:", error);
      setLoading(false);
    } else {
      reset();
      $links.set([result, ...$links.get()]);
    }

    setLoading(false);
  };

  return (
    <>
      <button
        id="openModal"
        className="flex cursor-pointer items-center gap-2 rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700"
        onClick={() => setOpen(true)}
      >
        <PlusCircle size={18} /> Create link
      </button>

      <div
        id="modal"
        className={cn(
          "fixed inset-0 z-50 cursor-pointer bg-black/50 backdrop-blur-sm transition-opacity duration-1000 ease-in-out",
          {
            hidden: !open,
          },
        )}
        onClick={() => setOpen(false)}
      >
        <div
          className="relative mx-auto mt-20 max-w-lg cursor-default rounded-lg bg-white shadow-sm dark:bg-gray-700"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-600">
            <h3 className="text-xl font-semibold">Create link</h3>
            <button
              id="closeModal"
              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={() => setOpen(false)}
            >
              <X />
            </button>
          </div>

          <div className="p-4">
            <form
              className="space-y-4"
              onSubmit={handleSubmit(onSubmit)}
              autoComplete="off"
            >
              <div>
                <label
                  htmlFor="originalUrl"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Original URL
                </label>
                <input
                  type="url"
                  id="originalUrl"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                  placeholder="https://example.com"
                  required
                  {...register("originalUrl")}
                />
                {errors.originalUrl && (
                  <p className="mt-2 text-sm text-red-500 dark:text-red-400">
                    {errors.originalUrl.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="slug"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Custom Slug (Optional)
                </label>
                <input
                  type="text"
                  id="slug"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                  placeholder="auto-generated-if-empty"
                  {...register("slug")}
                />
                {errors.slug && (
                  <p className="mt-2 text-sm text-red-500 dark:text-red-400">
                    {errors.slug.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="expiresAt"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Expiration Date (Optional)
                </label>
                <input
                  type="datetime-local"
                  id="expiresAt"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                  {...register("expiresAt")}
                />
                {errors.expiresAt && (
                  <p className="mt-2 text-sm text-red-500 dark:text-red-400">
                    {errors.expiresAt.message}
                  </p>
                )}
              </div>

              <button
                id="create-link-button"
                type="submit"
                className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Link"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
