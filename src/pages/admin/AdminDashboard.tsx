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
import { clearSupabaseAuthStorage, supabase, supabaseGalleryBucket } from "@/lib/supabaseClient";
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

function UploadStatsCompact({
  percent,
  currentIndex,
  total,
  speed,
  currentFileName,
}: {
  percent: number;
  currentIndex: number;
  total: number;
  speed: number;
  currentFileName: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/40 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-[11px] uppercase tracking-[0.25em] text-zinc-400">Upload Stats</div>
        <div className="text-xs font-mono tracking-widest text-amber-500">{percent}%</div>
      </div>

      <div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full bg-amber-500 transition-[width] duration-200"
          style={{ width: `${Math.max(0, Math.min(100, percent))}%` }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 text-xs text-zinc-300">
        <div className="truncate">File {currentIndex} / {total}</div>
        <div className="font-mono text-zinc-400">{formatSpeed(speed)}</div>
      </div>

      <div className="mt-2 text-[11px] text-zinc-500 truncate">{currentFileName || "—"}</div>
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

  const inputRef = useRef<HTMLInputElement | null>(null);

  const openPicker = () => {
    inputRef.current?.click();
  };

  const onDropFiles = (files: File[]) => {
    const picked = (files || []).filter((f) => f.type.startsWith("image/"));
    onPickFiles(picked);
  };

  return (
    <div className="rounded-xl border border-white/10 bg-black/40 p-4">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-zinc-300">
        <Cloud className="h-4 w-4 text-amber-500" />
        Upload
      </div>

      <div className="mt-4">
        <label className="block text-[11px] uppercase tracking-[0.25em] text-zinc-400">Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
        >
          {categories.map((c) => (
            <option key={c} value={c} className="bg-black">
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => onDropFiles(Array.from(e.target.files || []))}
          className="hidden"
        />

        <button
          type="button"
          onClick={openPicker}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDropFiles(Array.from(e.dataTransfer.files || []));
          }}
          className="w-full h-32 rounded-lg border border-dashed border-zinc-700 bg-black/30 hover:border-amber-500/40 transition-colors flex flex-col items-center justify-center gap-2"
        >
          <Upload className="h-5 w-5 text-zinc-300" />
          <div className="text-xs text-zinc-300">Drop images here</div>
          <div className="text-[11px] text-zinc-500">or click to browse</div>
        </button>

        <div className="mt-2 text-xs text-zinc-500">Selected: {uploadQueue.length} file(s)</div>
      </div>

      <button
        type="button"
        onClick={onStartUpload}
        disabled={!canUpload}
        className="mt-4 w-full inline-flex items-center justify-center gap-3 rounded-md bg-amber-500 px-4 py-3 text-xs font-bold uppercase tracking-[0.22em] text-black disabled:opacity-60"
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {folders.map((folder) => {
          const isActive = folder === activeFolder;
          return (
            <button
              key={folder}
              type="button"
              onClick={() => onToggle(folder)}
              className={
                "text-left rounded-2xl border px-6 py-6 transition-colors " +
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
              <div className="mt-3 text-xs text-zinc-500">Click to open • Drag to reorder • Delete safely</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ImageGrid({
  items,
  sensors,
  onDragEnd,
  onDelete,
  isBusy,
}: {
  items: PortfolioItemRow[];
  sensors: ReturnType<typeof useSensors>;
  onDragEnd: (event: DragEndEvent) => void;
  onDelete: (row: PortfolioItemRow) => void;
  isBusy: boolean;
}) {
  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext
        items={items.map((r) => String(r.id))}
        strategy={rectSortingStrategy}
      >
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 [column-fill:_balance]">
          {items.map((row) => (
            <div key={row.id} className="mb-4 break-inside-avoid">
              <SortablePhotoCard row={row} onDelete={onDelete} isBusy={isBusy} />
            </div>
          ))}
        </div>
      </SortableContext>
    </DndContext>
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

  const [userName, setUserName] = useState<string>("Admin");

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

  useEffect(() => {
    let cancelled = false;

    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (cancelled) return;

      const user = data.user;
      const nameFromMeta =
        (user?.user_metadata as any)?.full_name || (user?.user_metadata as any)?.name;
      const nameFromEmail = user?.email?.split("@")[0];
      setUserName((nameFromMeta || nameFromEmail || "Admin").toString());
    };

    void loadUser();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } finally {
      clearSupabaseAuthStorage();
    }
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

        if (uploadRes.error) {
          throw new Error(`Storage upload failed: ${uploadRes.error.message}`);
        }

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
          throw new Error(`DB insert failed: ${insertErr.message}`);
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
    <div className="h-screen w-full flex bg-black text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[350px] flex-shrink-0 border-r border-zinc-800 p-6 flex flex-col gap-6 bg-zinc-950">
        <div>
          <div className="text-[11px] uppercase tracking-[0.35em] text-amber-500">Dashboard</div>
          <div className="mt-2 font-serifDisplay text-2xl text-white">Admin Command Center</div>
          <h1 className="mt-3 text-sm text-zinc-300">
            Welcome, <span className="text-amber-500 capitalize">{userName}</span>
          </h1>
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

        {isUploading && (
          <UploadStatsCompact
            percent={uploadPercent}
            currentIndex={Math.min(currentUploadIndex, Math.max(1, uploadQueue.length))}
            total={Math.max(1, uploadQueue.length)}
            speed={uploadSpeed}
            currentFileName={currentUploadName}
          />
        )}

        <div className="mt-auto pt-2">
          <button
            type="button"
            onClick={onDeleteAll}
            disabled={isDeletingAll || isUploading || isSavingOrder}
            className="w-full text-left text-xs uppercase tracking-[0.25em] text-red-400 hover:text-red-300 disabled:opacity-60"
          >
            {isDeletingAll ? "Deleting all..." : "Delete All Photos"}
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 py-3 text-xs font-bold uppercase tracking-[0.22em] text-white hover:bg-white/10"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Content */}
      <section className="flex-1 h-full overflow-y-auto p-8 bg-black">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xs text-zinc-400">
              {activeFolder ? (
                <span>
                  <span className="text-zinc-500">📁</span> Home <span className="text-zinc-600">&gt;</span> <span className="text-white">{activeFolder}</span>
                </span>
              ) : (
                <span>
                  <span className="text-zinc-500">📁</span> Home
                </span>
              )}
            </div>
            <div className="mt-2 text-xl font-semibold text-white">
              {activeFolder ? activeFolder : "Folders"}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-white hover:bg-white/10"
            >
              View Live Site ↗
            </a>

            {/* Sign out (top right) */}
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-white hover:bg-white/10"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>

        {activeFolder ? (
          <div className="mt-8">
            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setActiveFolder(null)}
                className="text-xs uppercase tracking-[0.25em] text-zinc-400 hover:text-amber-500 transition-colors"
              >
                ← Back to Folders
              </button>

              <button
                type="button"
                onClick={() => onDeleteCategory(activeFolder)}
                disabled={isUploading || isDeletingAll || isSavingOrder}
                className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-white hover:bg-red-500 disabled:opacity-60"
              >
                <Trash className="h-4 w-4" />
                Delete Category
              </button>
            </div>

            {activeFolderItems.length === 0 ? (
              <div className="mt-10 text-sm text-zinc-400">This folder is empty.</div>
            ) : (
              <div className="mt-8">
                <div className="text-xs text-zinc-500 mb-4">
                  Drag & drop to reorder. Saved to <span className="text-zinc-300">sort_order</span>.
                </div>
                <ImageGrid
                  items={activeFolderItems}
                  sensors={sensors}
                  onDragEnd={onDragEnd}
                  onDelete={onDeleteImage}
                  isBusy={isUploading || isDeletingAll || isSavingOrder}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="mt-8">
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
        )}
      </section>

      {/* Optional floating speedometer (kept, but only when uploading) */}
      <UploadSpeedometer
        isUploading={isUploading}
        percent={uploadPercent}
        currentIndex={Math.min(currentUploadIndex, Math.max(1, uploadQueue.length))}
        total={Math.max(1, uploadQueue.length)}
        speed={uploadSpeed}
        currentFileName={currentUploadName}
      />
    </div>
  );
}
