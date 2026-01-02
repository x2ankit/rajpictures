/**
 * SQL PREP (run in Supabase SQL editor):
 *
 * -- Add a column to remember the order of photos
 * alter table public.portfolio_items add column if not exists sort_order int default 0;
 */

import { useEffect, useMemo, useRef, useState } from "react";
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Cloud, Folder, Loader2, LogOut, Trash, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
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

type PortfolioItemRow = {
  id: number;
  category: string | null;
  src: string;
  title: string | null;
  type: string | null;
  created_at?: string;
  sort_order?: number | null;
};

function safeFileName(name: string) {
  return name
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "");
}

function categoryToFolder(category: Category) {
  // Example desired: baby/filename.jpg
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

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function asCategoryLabel(category: string | null | undefined) {
  return (category || "Uncategorized").trim() || "Uncategorized";
}

function formatSpeed(mbPerSec: number) {
  if (!Number.isFinite(mbPerSec) || mbPerSec <= 0) return "0.00 MB/s";
  return `${mbPerSec.toFixed(2)} MB/s`;
}

function UploadSpeedometer({
  isUploading,
  percent,
  currentIndex,
  total,
  speed,
  currentFileName,
}: {
  isUploading: boolean;
  percent: number;
  currentIndex: number;
  total: number;
  speed: number;
  currentFileName: string;
}) {
  if (!isUploading) return null;

  return (
    <div className="fixed right-5 bottom-5 z-[95] w-[min(420px,calc(100vw-2.5rem))]">
      <div className="rounded-2xl border border-white/10 bg-black/70 backdrop-blur-xl p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-zinc-300">
            <Cloud className="h-4 w-4 text-amber-500" />
            Uploading
          </div>
          <div className="text-xs font-mono tracking-widest text-amber-500">{percent}%</div>
        </div>

        <div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-amber-500 transition-[width] duration-200"
            style={{ width: `${Math.max(0, Math.min(100, percent))}%` }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 text-xs text-zinc-300">
          <div className="truncate">Uploading file {currentIndex} of {total}</div>
          <div className="font-mono text-zinc-400">{formatSpeed(speed)}</div>
        </div>

        <div className="mt-2 text-[11px] text-zinc-500 truncate">{currentFileName}</div>
      </div>
    </div>
  );
}

function SortablePhotoCard({
  row,
  onDelete,
  isBusy,
}: {
  row: PortfolioItemRow;
  onDelete: (row: PortfolioItemRow) => void;
  isBusy: boolean;
}) {
  const sortable = useSortable({ id: String(row.id) });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(sortable.transform),
    transition: sortable.transition,
  };

  return (
    <div
      ref={sortable.setNodeRef}
      style={style}
      className={
        "relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur " +
        (sortable.isDragging ? "ring-2 ring-amber-500/60" : "")
      }
    >
      <button
        type="button"
        onClick={() => onDelete(row)}
        disabled={isBusy}
        className="absolute right-2 top-2 z-10 rounded-md bg-black/40 border border-white/10 p-2 text-red-400 hover:text-red-300 transition-colors disabled:opacity-60"
        aria-label="Delete"
        title="Delete"
      >
        <Trash className="h-4 w-4" />
      </button>

      <div
        {...sortable.attributes}
        {...sortable.listeners}
        className="cursor-grab active:cursor-grabbing"
        aria-label="Drag to reorder"
        title="Drag to reorder"
      >
        <div className="aspect-[4/3] bg-black/40">
          <img
            src={row.src}
            alt={row.title || "Image"}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="p-3">
          <div className="text-xs text-white truncate">{row.title || "(Untitled)"}</div>
        </div>
      </div>
    </div>
  );
}

function UploadZone({
  categories,
  selectedCategory,
  onCategoryChange,
  uploadQueue,
  onPickFiles,
  onStartUpload,
  isUploading,
}: {
  categories: readonly string[];
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  uploadQueue: File[];
  onPickFiles: (files: File[]) => void;
  onStartUpload: () => void;
  isUploading: boolean;
}) {
  const canUpload = uploadQueue.length > 0 && !isUploading;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-8">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-amber-500">
        <Cloud className="h-4 w-4" />
        Upload Zone
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <label className="block text-xs uppercase tracking-[0.25em] text-zinc-400">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          >
            {categories.map((c) => (
              <option key={c} value={c} className="bg-black">
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs uppercase tracking-[0.25em] text-zinc-400">Files</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => onPickFiles(Array.from(e.target.files || []))}
            className="mt-2 block w-full text-sm text-zinc-300 file:mr-4 file:rounded-md file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-xs file:uppercase file:tracking-[0.22em] file:text-white hover:file:bg-white/15"
          />
          <div className="mt-2 text-xs text-zinc-500">Selected: {uploadQueue.length} file(s)</div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end">
        <button
          type="button"
          onClick={onStartUpload}
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
  );
}

function FolderGrid({
  folders,
  counts,
  activeFolder,
  onToggle,
}: {
  folders: string[];
  counts: Record<string, number>;
  activeFolder: string | null;
  onToggle: (folder: string) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-sm uppercase tracking-[0.25em] text-zinc-300">Folders</h2>
        <div className="text-xs text-zinc-500">Click a folder to manage & reorder</div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {folders.map((folder) => {
          const isActive = folder === activeFolder;
          return (
            <button
              key={folder}
              type="button"
              onClick={() => onToggle(folder)}
              className={
                "text-left rounded-xl border px-5 py-4 transition-colors " +
                (isActive
                  ? "border-amber-500/60 bg-amber-500/10"
                  : "border-white/10 bg-white/5 hover:border-amber-500/30")
              }
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Folder className={"h-5 w-5 " + (isActive ? "text-amber-500" : "text-zinc-300")} />
                  <div className="text-sm font-semibold text-white">{folder}</div>
                </div>
                <div className="text-xs font-mono tracking-widest text-zinc-400">{counts[folder] ?? 0}</div>
              </div>
              <div className="mt-2 text-xs text-zinc-500">View photos • Drag to reorder • Delete safely</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const bucket = supabaseGalleryBucket;

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const [uploadQueue, setUploadQueue] = useState<File[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Wedding");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [currentUploadIndex, setCurrentUploadIndex] = useState(1);
  const [currentUploadName, setCurrentUploadName] = useState("");

  const uploadStartRef = useRef<number>(0);
  const uploadedBytesRef = useRef<number>(0);

  const [items, setItems] = useState<PortfolioItemRow[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const [isSavingOrder, setIsSavingOrder] = useState(false);

  const loadItems = async () => {
    setIsLoadingItems(true);
    try {
      const { data, error } = await supabase
        .from("portfolio_items")
        .select("id, category, src, title, type, created_at, sort_order")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false })
        .order("id", { ascending: false });

      if (error) throw error;
      setItems((data as PortfolioItemRow[]) || []);
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  };

  useEffect(() => {
    if (!isUploading) return;

    const t = window.setInterval(() => {
      const elapsedMs = Math.max(1, Date.now() - uploadStartRef.current);
      const mb = uploadedBytesRef.current / (1024 * 1024);
      const mbps = mb / (elapsedMs / 1000);
      setUploadSpeed(Number.isFinite(mbps) ? mbps : 0);
    }, 250);

    return () => window.clearInterval(t);
  }, [isUploading]);

  const onUpload = async () => {
    if (uploadQueue.length === 0 || isUploading) return;

    setIsUploading(true);
    uploadStartRef.current = Date.now();
    uploadedBytesRef.current = 0;
    setUploadSpeed(0);
    setCurrentUploadIndex(1);
    setCurrentUploadName(uploadQueue[0]?.name ?? "");

    const categoryLabel = (selectedCategory as Category) ?? "Wedding";
    const folder = categoryToFolder(categoryLabel);

    const existingMax = Math.max(
      -1,
      ...items
        .filter((it) => asCategoryLabel(it.category) === categoryLabel)
        .map((it) => (typeof it.sort_order === "number" ? it.sort_order : 0))
    );
    const baseSort = Math.max(0, existingMax + 1);

    try {
      for (let i = 0; i < uploadQueue.length; i++) {
        const file = uploadQueue[i];
        setCurrentUploadIndex(i + 1);
        setCurrentUploadName(file.name);

        const cleanedName = safeFileName(file.name) || `image-${i + 1}`;
        let objectPath = `${folder}/${cleanedName}`;

        // 1) Storage upload
        let uploadRes = await supabase.storage.from(bucket).upload(objectPath, file, {
          upsert: false,
          contentType: file.type || undefined,
          cacheControl: "3600",
        });

        if (uploadRes.error) {
          const msg = uploadRes.error.message.toLowerCase();
          // If collision, retry with unique name.
          if (
            msg.includes("already") ||
            msg.includes("exist") ||
            (uploadRes.error as any).statusCode === 409
          ) {
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
        const { error: insertErr } = await supabase.from("portfolio_items").insert({
          category: categoryLabel,
          src: publicUrl,
          title: file.name,
          type: "image",
          sort_order: baseSort + i,
        });

        if (insertErr) {
          // Keep things clean if DB insert fails.
          await supabase.storage.from(bucket).remove([objectPath]);
          throw insertErr;
        }

        uploadedBytesRef.current += file.size;
      }

      toast({ title: "Upload complete", description: `${uploadQueue.length} file(s) uploaded.` });
      setUploadQueue([]);
      await loadItems();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload failed";
      toast({ title: "Upload failed", description: message, variant: "destructive" });
    } finally {
      setIsUploading(false);
      setCurrentUploadName("");
      setCurrentUploadIndex(1);
      setUploadSpeed(0);
    }
  };

  const onDeleteImage = async (row: PortfolioItemRow) => {
    if (isUploading || isDeletingAll || isSavingOrder) return;

    const storagePath = tryExtractStoragePathFromPublicUrl(row.src, bucket);
    if (!storagePath) {
      toast({
        title: "Delete failed",
        description: "Could not determine storage path from the URL.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error: storageErr } = await supabase.storage.from(bucket).remove([storagePath]);
      if (storageErr) throw storageErr;

      const { error: dbErr } = await supabase.from("portfolio_items").delete().eq("id", row.id);
      if (dbErr) throw dbErr;

      setItems((prev) => prev.filter((it) => it.id !== row.id));
      toast({ title: "Deleted", description: row.title || "Item removed." });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Delete failed";
      toast({ title: "Delete failed", description: message, variant: "destructive" });
    }
  };

  const onDeleteAll = async () => {
    if (isDeletingAll || isUploading) return;

    const ok = window.confirm(
      "DELETE ALL PHOTOS? This will remove every portfolio_items record and delete the files from Storage."
    );
    if (!ok) return;

    setIsDeletingAll(true);
    setActiveFolder(null);

    try {
      const { data, error } = await supabase
        .from("portfolio_items")
        .select("id, src");

      if (error) throw error;

      const paths: string[] = [];
      for (const row of (data as { id: number; src: string }[]) || []) {
        const p = tryExtractStoragePathFromPublicUrl(row.src, bucket);
        if (p) paths.push(p);
      }

      // Delete storage objects in chunks.
      for (const batch of chunk(paths, 100)) {
        const { error: rmErr } = await supabase.storage.from(bucket).remove(batch);
        if (rmErr) throw rmErr;
      }

      // Delete DB rows.
      const { error: dbErr } = await supabase.from("portfolio_items").delete().gt("id", 0);
      if (dbErr) throw dbErr;

      toast({ title: "Deleted all", description: "All photos removed." });
      await loadItems();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Delete all failed";
      toast({ title: "Delete all failed", description: message, variant: "destructive" });
    } finally {
      setIsDeletingAll(false);
    }
  };

  const folderCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const row of items) {
      const k = asCategoryLabel(row.category);
      counts[k] = (counts[k] ?? 0) + 1;
    }
    return counts;
  }, [items]);

  const folders = useMemo(() => {
    const fromDb = new Set<string>(items.map((it) => asCategoryLabel(it.category)));
    for (const c of CATEGORIES) fromDb.add(c);
    return Array.from(fromDb).sort((a, b) => a.localeCompare(b));
  }, [items]);

  const activeFolderItems = useMemo(() => {
    if (!activeFolder) return [];
    return items
      .filter((it) => asCategoryLabel(it.category) === activeFolder)
      .slice()
      .sort((a, b) => {
        const ao = typeof a.sort_order === "number" ? a.sort_order : 0;
        const bo = typeof b.sort_order === "number" ? b.sort_order : 0;
        if (ao !== bo) return ao - bo;
        // fallback for stability
        return b.id - a.id;
      });
  }, [activeFolder, items]);

  const onDeleteCategory = async (categoryLabel: string) => {
    if (isUploading || isDeletingAll || isSavingOrder) return;

    const ok = window.confirm(
      `Delete category "${categoryLabel}"? This will delete ALL photos in this folder (Storage + Database).`
    );
    if (!ok) return;

    const toDelete = items.filter((it) => asCategoryLabel(it.category) === categoryLabel);
    if (toDelete.length === 0) {
      toast({ title: "Nothing to delete", description: "This category is empty." });
      return;
    }

    try {
      const paths = toDelete
        .map((row) => tryExtractStoragePathFromPublicUrl(row.src, bucket))
        .filter(Boolean) as string[];

      for (const batch of chunk(paths, 100)) {
        const { error: rmErr } = await supabase.storage.from(bucket).remove(batch);
        if (rmErr) throw rmErr;
      }

      // Delete DB rows.
      const { error: dbErr } = await supabase
        .from("portfolio_items")
        .delete()
        .eq("category", categoryLabel);
      if (dbErr) throw dbErr;

      setItems((prev) => prev.filter((it) => asCategoryLabel(it.category) !== categoryLabel));
      if (activeFolder === categoryLabel) setActiveFolder(null);
      toast({ title: "Category deleted", description: `${toDelete.length} photo(s) removed.` });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Delete category failed";
      toast({ title: "Delete category failed", description: message, variant: "destructive" });
    }
  };

  const persistSortOrder = async (orderedRows: PortfolioItemRow[]) => {
    setIsSavingOrder(true);
    try {
      for (let i = 0; i < orderedRows.length; i++) {
        const row = orderedRows[i];
        const { error } = await supabase
          .from("portfolio_items")
          .update({ sort_order: i })
          .eq("id", row.id);
        if (error) throw error;
      }
    } finally {
      setIsSavingOrder(false);
    }
  };

  const onDragEnd = async (event: DragEndEvent) => {
    if (!activeFolder) return;
    if (isUploading || isDeletingAll || isSavingOrder) return;

    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) return;

    const current = activeFolderItems;
    const oldIndex = current.findIndex((r) => String(r.id) === String(active.id));
    const newIndex = current.findIndex((r) => String(r.id) === String(over.id));
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(current, oldIndex, newIndex);

    // Update local state immediately for snappy UX.
    const newSortMap = new Map<number, number>();
    reordered.forEach((r, i) => newSortMap.set(r.id, i));
    setItems((prev) =>
      prev.map((it) =>
        newSortMap.has(it.id) ? { ...it, sort_order: newSortMap.get(it.id) } : it
      )
    );

    try {
      await persistSortOrder(reordered);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save order";
      toast({ title: "Reorder failed", description: message, variant: "destructive" });
      // Reload to get a consistent state from DB.
      await loadItems();
    }
  };

  const uploadPercent = useMemo(() => {
    if (!isUploading) return 0;
    const total = Math.max(1, uploadQueue.length);
    const completed = Math.max(0, currentUploadIndex - 1);
    return Math.round((completed / total) * 100);
  }, [currentUploadIndex, isUploading, uploadQueue.length]);

  return (
    <main className="min-h-screen bg-black text-white px-6 md:px-12 lg:px-24 py-24">
      <div className="mx-auto w-full max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-10">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-amber-500">Admin</div>
            <h1 className="mt-3 font-serifDisplay text-4xl md:text-5xl">Dashboard</h1>
            <div className="mt-2 text-xs text-zinc-500">
              Pro manager • Upload stats • Folder view • Drag & drop ordering
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onDeleteAll}
              disabled={isDeletingAll || isUploading || isSavingOrder}
              className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-3 text-xs font-bold uppercase tracking-[0.22em] text-white hover:bg-red-500 disabled:opacity-60"
            >
              {isDeletingAll ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash className="h-4 w-4" />}
              DELETE ALL PHOTOS
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 py-3 text-xs font-bold uppercase tracking-[0.22em] text-white hover:bg-white/10"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>

        <UploadZone
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          uploadQueue={uploadQueue}
          onPickFiles={setUploadQueue}
          onStartUpload={onUpload}
          isUploading={isUploading}
        />

        <div className="mt-12">
          {isLoadingItems ? (
            <div className="mt-10 flex items-center gap-3 text-zinc-400">
              <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
              Loading...
            </div>
          ) : (
            <FolderGrid
              folders={folders}
              counts={folderCounts}
              activeFolder={activeFolder}
              onToggle={(folder) => setActiveFolder((prev) => (prev === folder ? null : folder))}
            />
          )}
        </div>

        {/* Active folder contents */}
        <div className="mt-10">
          {activeFolder ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <Folder className="h-5 w-5 text-amber-500" />
                    <h2 className="text-lg font-semibold text-white">{activeFolder}</h2>
                    <div className="text-xs font-mono tracking-widest text-zinc-400">
                      {activeFolderItems.length}
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-zinc-500">
                    Drag photos to reorder. Order is saved to <span className="text-zinc-300">sort_order</span>.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onDeleteCategory(activeFolder)}
                  disabled={isUploading || isDeletingAll || isSavingOrder}
                  className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-3 text-xs font-bold uppercase tracking-[0.22em] text-white hover:bg-red-500 disabled:opacity-60"
                >
                  <Trash className="h-4 w-4" />
                  Delete Category
                </button>
              </div>

              {activeFolderItems.length === 0 ? (
                <div className="mt-8 text-sm text-zinc-400">This folder is empty.</div>
              ) : (
                <div className="mt-8">
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                    <SortableContext
                      items={activeFolderItems.map((r) => String(r.id))}
                      strategy={rectSortingStrategy}
                    >
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {activeFolderItems.map((row) => (
                          <SortablePhotoCard
                            key={row.id}
                            row={row}
                            onDelete={onDeleteImage}
                            isBusy={isUploading || isDeletingAll || isSavingOrder}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-2 text-sm text-zinc-400">
              Select a folder above to manage photos.
            </div>
          )}
        </div>
      </div>

      <UploadSpeedometer
        isUploading={isUploading}
        percent={uploadPercent}
        currentIndex={Math.min(currentUploadIndex, Math.max(1, uploadQueue.length))}
        total={Math.max(1, uploadQueue.length)}
        speed={uploadSpeed}
        currentFileName={currentUploadName}
      />
    </main>
  );
}
