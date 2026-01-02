import { useEffect, useMemo, useState } from "react";
import { Link2, Loader2, Trash2, Upload } from "lucide-react";
import { supabase, supabaseGalleryBucket } from "@/lib/supabaseClient";
import { toast } from "@/hooks/use-toast";

const CATEGORIES = [
  "Wedding",
  "Pre-wedding",
  "Bridal",
  "Baby",
  "Ring Ceremony",
  "Conceptual",
] as const;

type Category = (typeof CATEGORIES)[number];

type GalleryRow = {
  id: number;
  category: string | null;
  image_url: string;
  title: string | null;
  storage_path: string | null;
  created_at?: string;
};

function isVideoUrl(url: string): boolean {
  const u = url.toLowerCase();
  return u.endsWith(".mp4") || u.endsWith(".webm") || u.endsWith(".mov") || u.endsWith(".m4v");
}

function safeFileName(name: string) {
  return name
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "");
}

function categoryToFolder(category: Category) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

function tryExtractStoragePathFromPublicUrl(publicUrl: string, bucket: string): string | null {
  try {
    const u = new URL(publicUrl);
    const marker = `/storage/v1/object/public/${bucket}/`;
    const idx = u.pathname.indexOf(marker);
    if (idx === -1) return null;
    const path = u.pathname.slice(idx + marker.length);
    return decodeURIComponent(path || "").trim() || null;
  } catch {
    return null;
  }
}

export default function GalleryManager() {
  const [category, setCategory] = useState<Category>("Wedding");
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [progressText, setProgressText] = useState<string>("");

  const [externalLink, setExternalLink] = useState<string>("");

  const [items, setItems] = useState<GalleryRow[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const bucket = supabaseGalleryBucket;

  const canUpload = useMemo(() => files.length > 0 && !isUploading, [files.length, isUploading]);

  const loadItems = async () => {
    setIsLoadingItems(true);
    try {
      const base = supabase
        .from("gallery")
        .select("id, category, image_url, title, storage_path, created_at");

      // Prefer newest-first if created_at exists.
      const { data, error } = await base.order("created_at", { ascending: false });
      if (error) {
        // Fallback if created_at doesn't exist.
        const { data: fallback, error: fallbackErr } = await supabase
          .from("gallery")
          .select("id, category, image_url, title, storage_path")
          .order("id", { ascending: false });

        if (fallbackErr) throw fallbackErr;
        setItems((fallback as GalleryRow[]) || []);
        return;
      }

      setItems((data as GalleryRow[]) || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load items";
      toast({ title: "Load failed", description: message, variant: "destructive" });
    } finally {
      setIsLoadingItems(false);
    }
  };

  useEffect(() => {
    void loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onUpload = async () => {
    if (!canUpload) return;

    setIsUploading(true);
    setProgressText("");

    const folder = categoryToFolder(category);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProgressText(`Uploading ${i + 1} of ${files.length}...`);

        const cleanedName = safeFileName(file.name) || `image-${i + 1}`;
        let objectPath = `${folder}/${cleanedName}`;

        // 1) Storage upload
        let uploadRes = await supabase.storage.from(bucket).upload(objectPath, file, {
          upsert: false,
          contentType: file.type || undefined,
          cacheControl: "3600",
        });

        if (uploadRes.error) {
          // If collision, retry with a unique name.
          const msg = uploadRes.error.message.toLowerCase();
          if (msg.includes("already") || msg.includes("exist") || (uploadRes.error as any).statusCode === 409) {
            objectPath = `${folder}/${Date.now()}-${crypto.randomUUID()}-${cleanedName}`;
            uploadRes = await supabase.storage.from(bucket).upload(objectPath, file, {
              upsert: false,
              contentType: file.type || undefined,
              cacheControl: "3600",
            });
          }
        }

        if (uploadRes.error) throw uploadRes.error;

        // 2) Public URL
        const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(objectPath);
        const publicUrl = publicUrlData.publicUrl;
        if (!publicUrl) throw new Error("Could not resolve public URL for uploaded file.");

        // 3) DB insert
        const { error: insertErr } = await supabase.from("gallery").insert({
          category,
          title: file.name,
          image_url: publicUrl,
          storage_path: objectPath,
        });

        if (insertErr) {
          // Keep things clean if DB insert fails.
          await supabase.storage.from(bucket).remove([objectPath]);
          throw insertErr;
        }
      }

      toast({ title: "Upload complete", description: `${files.length} item(s) uploaded.` });
      setFiles([]);
      setProgressText("");
      await loadItems();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload failed";
      toast({ title: "Upload failed", description: message, variant: "destructive" });
    } finally {
      setIsUploading(false);
      setProgressText("");
    }
  };

  const onDelete = async (row: GalleryRow) => {
    if (deletingId) return;

    const storagePath = row.storage_path || tryExtractStoragePathFromPublicUrl(row.image_url, bucket);

    setDeletingId(row.id);
    try {
      // Delete file from Storage when it is a Supabase-hosted public URL.
      if (storagePath) {
        const { error: storageErr } = await supabase.storage.from(bucket).remove([storagePath]);
        if (storageErr) throw storageErr;
      }

      const { error: dbErr } = await supabase.from("gallery").delete().eq("id", row.id);
      if (dbErr) throw dbErr;

      toast({
        title: "Deleted",
        description: storagePath ? (row.title || "Item removed.") : "Removed DB record (external link).",
      });
      await loadItems();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Delete failed";
      toast({ title: "Delete failed", description: message, variant: "destructive" });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 md:px-12 lg:px-24 py-24">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-10">
          <div className="text-xs uppercase tracking-[0.3em] text-amber-500">Admin</div>
          <h1 className="mt-4 font-serifDisplay text-4xl md:text-5xl">Gallery Manager</h1>
          <p className="mt-3 text-sm text-zinc-400">
            Upload images into Supabase Storage and manage your gallery table.
          </p>
        </div>

        {/* Uploader */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="block text-xs uppercase tracking-[0.25em] text-zinc-400">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-black">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs uppercase tracking-[0.25em] text-zinc-400">
                Files
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setFiles(Array.from(e.target.files || []))}
                className="mt-2 block w-full text-sm text-zinc-300 file:mr-4 file:rounded-md file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-xs file:uppercase file:tracking-[0.22em] file:text-white hover:file:bg-white/15"
              />
              <div className="mt-2 text-xs text-zinc-500">
                Selected: {files.length} file(s)
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-xs uppercase tracking-[0.25em] text-zinc-400">
              Add External Link
            </label>
            <div className="mt-2 flex flex-col md:flex-row md:items-center gap-3">
              <div className="flex-1 relative">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  value={externalLink}
                  onChange={(e) => setExternalLink(e.target.value)}
                  placeholder="https://... direct image link"
                  className="w-full rounded-md border border-white/10 bg-black/30 pl-10 pr-3 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>
              <button
                type="button"
                onClick={async () => {
                  const url = externalLink.trim();
                  if (!url) return;
                  try {
                    const { error } = await supabase.from("gallery").insert({
                      category,
                      title: null,
                      image_url: url,
                      storage_path: null,
                    });
                    if (error) throw error;
                    setExternalLink("");
                    toast({ title: "Added", description: "Link added to gallery." });
                    await loadItems();
                  } catch (err: unknown) {
                    const message = err instanceof Error ? err.message : "Failed to add link";
                    toast({ title: "Add failed", description: message, variant: "destructive" });
                  }
                }}
                className="inline-flex items-center justify-center rounded-md border border-white/10 bg-white/10 px-4 py-3 text-xs font-bold uppercase tracking-[0.22em] text-white hover:bg-white/15"
              >
                Add
              </button>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <div className="text-xs text-zinc-400">{progressText}</div>

            <button
              type="button"
              onClick={onUpload}
              disabled={!canUpload}
              className="inline-flex items-center gap-3 rounded-md bg-amber-500 px-5 py-3 text-xs font-bold uppercase tracking-[0.22em] text-black disabled:opacity-60"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload
                </>
              )}
            </button>
          </div>
        </div>

        {/* Manager grid */}
        <div className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-sm uppercase tracking-[0.25em] text-zinc-300">Items</h2>
            <button
              type="button"
              onClick={loadItems}
              className="text-xs uppercase tracking-[0.25em] text-zinc-500 hover:text-amber-500 transition-colors"
            >
              Refresh
            </button>
          </div>

          {isLoadingItems ? (
            <div className="mt-10 flex items-center gap-3 text-zinc-400">
              <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
              Loading...
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {items.map((row) => (
                <div
                  key={row.id}
                  className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur"
                >
                  <button
                    type="button"
                    onClick={() => onDelete(row)}
                    disabled={deletingId === row.id}
                    className="absolute right-2 top-2 z-10 rounded-md bg-black/40 border border-white/10 p-2 text-red-400 hover:text-red-300 transition-colors disabled:opacity-60"
                    aria-label="Delete"
                    title="Delete"
                  >
                    {deletingId === row.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>

                  <div className="aspect-[4/3] bg-black/40">
                    {isVideoUrl(row.image_url) ? (
                      <video
                        src={row.image_url}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <img
                        src={row.image_url}
                        alt={row.title || "Image"}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                  </div>

                  <div className="p-3">
                    <div className="text-xs text-white truncate">{row.title || "(Untitled)"}</div>
                    <div className="mt-1 text-[10px] font-mono text-zinc-500 truncate">
                      {row.category || "Uncategorized"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
