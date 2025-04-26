import { zodResolver } from "@hookform/resolvers/zod";
import type { Link } from "@prisma/client";
import { actions } from "astro:actions";
import { Edit, X } from "lucide-react";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

import { UpdateLinkSchema } from "@/lib/schemas";
import { $links } from "@/lib/storages";
import { cn } from "@/lib/utils";

interface FormInput {
  id: string;
  originalUrl: string;
  slug: string;
  expiresAt?: string;
}

export default function EditLink({ initialData }: { initialData: Link }) {
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const {
    reset,
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(UpdateLinkSchema),
    defaultValues: {
      id: initialData.id,
      originalUrl: initialData?.originalUrl || "",
      slug: initialData?.slug || "",
      expiresAt: initialData?.expiresAt
        ? new Date(initialData.expiresAt).toISOString().slice(0, 16)
        : undefined,
    },
  });

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    setLoading(true);
    const { data: exitsSlug } = await actions.links.checkIfSlugExist({
      slug: data.slug,
    });

    if (exitsSlug && data.slug !== initialData.slug) {
      setError("slug", {
        message: "Slug already exists",
      });
      console.log("Slug already exists, please choose another one.");
      setLoading(false);
      return;
    }

    const { data: result, error } = await actions.links.updateLink(data);

    if (error) {
      console.error("Error updating link:", error);
      setLoading(false);
    } else {
      $links.set(
        $links
          .get()
          .map((link) =>
            link.id === result.id ? { ...link, ...result } : link,
          ),
      );
      reset({
        id: result.id,
        originalUrl: result.originalUrl,
        slug: result.slug,
        expiresAt: result?.expiresAt
          ? new Date(result.expiresAt).toISOString().slice(0, 16)
          : undefined,
      });
    }

    setLoading(false);
  };

  return (
    <>
      <button
        id="openModal"
        className="cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <Edit size={18} />
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
            <h3 className="text-xl font-semibold">Edit link</h3>
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
                {loading ? "Updating..." : "Update Link"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
