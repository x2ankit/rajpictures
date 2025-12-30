import { useEffect, useMemo, useRef, useState } from "react";
import { Upload, Lock, LogOut, Image as ImageIcon, Trash2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "@/hooks/use-toast";
import { supabase, supabaseGalleryBucket } from "@/lib/supabaseClient";

type PendingUpload = {
  id: string;
  file: File;
  previewUrl?: string;
  title: string;
  category: "Weddings" | "Cinematic";
};

type GalleryRow = {
  id: number;
  created_at: string;
  title: string | null;
  category: string | null;
  image_url: string;
  storage_path: string | null;
  order_index?: number | null;
};

function isMissingOrderIndexColumnError(err: unknown): boolean {
  const message = err instanceof Error ? err.message : String(err);
  const lower = message.toLowerCase();
  return (
    lower.includes("order_index") &&
    (lower.includes("does not exist") ||
      lower.includes("could not find") ||
      lower.includes("unknown column") ||
      lower.includes("column") && lower.includes("not") && lower.includes("exist"))
  );
}

function createObjectUrlSafe(file: File): string | null {
  try {
    return URL.createObjectURL(file);
  } catch {
    return null;
  }
}

function revokeObjectUrlSafe(url?: string | null) {
  if (!url) return;
  try {
    URL.revokeObjectURL(url);
  } catch {
    // ignore
  }
}

function safeFileName(name: string) {
  return name
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "");
}

function extractImageFilesFromClipboard(data: DataTransfer | null | undefined): File[] {
  const items = data?.items;
  if (!items || items.length === 0) return [];

  const imageFiles: File[] = [];
  for (const item of Array.from(items)) {
    if (item.kind !== "file") continue;
    const file = item.getAsFile();
    if (file && file.type.startsWith("image/")) imageFiles.push(file);
  }
  return imageFiles;
}

async function uploadToSupabase(file: File) {
  const bucket = supabaseGalleryBucket;
  const extension = file.name.includes(".") ? file.name.split(".").pop() : "";
  const base = safeFileName(file.name.replace(/\.[^/.]+$/, "")) || "image";
  const path = `gallery/${Date.now()}-${crypto.randomUUID()}-${base}${extension ? "." + extension : ""}`;

  const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: false,
    contentType: file.type || undefined,
    cacheControl: "3600",
  });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  const publicUrl = data.publicUrl;
  if (!publicUrl) throw new Error("Could not resolve public URL for uploaded file.");

  return { publicUrl, storagePath: path };
}

function SortableGalleryTile({ row, onDelete }: { row: GalleryRow; onDelete: (row: GalleryRow) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: row.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={
        "glass-card overflow-hidden border border-border/40 bg-secondary/20 relative group " +
        (isDragging ? "opacity-80" : "opacity-100")
      }
    >
      <div className="absolute left-2 top-2 z-10 flex items-center gap-2">
        <div
          className="select-none rounded-md bg-background/30 border border-border/50 backdrop-blur px-2 py-1 text-[10px] font-mono text-muted-foreground cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
        >
          DRAG
        </div>
      </div>

      <button
        type="button"
        onPointerDownCapture={(e) => e.stopPropagation()}
        onKeyDownCapture={(e) => e.stopPropagation()}
        onClick={() => onDelete(row)}
        className="absolute right-2 top-2 z-10 rounded-md bg-background/30 border border-border/50 backdrop-blur p-2 text-destructive hover:text-destructive/80 transition-all"
        title="Delete"
        aria-label="Delete"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      <div className="aspect-[4/3] bg-black/40">
        <img
          src={row.image_url}
          alt={row.title || "Gallery image"}
          className="w-full h-full object-cover"
          loading="lazy"
          draggable={false}
        />
      </div>

      <div className="p-3">
        <div className="text-sm truncate">{row.title || "(Untitled)"}</div>
        <div className="text-[10px] font-mono text-muted-foreground truncate">
          {row.category || "Uncategorized"}
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [pending, setPending] = useState<PendingUpload[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isLoadingGallery, setIsLoadingGallery] = useState(false);
  const [galleryRows, setGalleryRows] = useState<GalleryRow[]>([]);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [isOrderIndexAvailable, setIsOrderIndexAvailable] = useState(true);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const pendingCount = pending.length;
  const hasPending = pendingCount > 0;

  const accept = useMemo(() => "image/*", []);

  const loadGallery = async () => {
    setIsLoadingGallery(true);
    try {
      const { data, error } = await supabase
        .from("gallery")
        .select("id, created_at, title, category, image_url, storage_path, order_index")
        .order("order_index", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) throw error;
      setIsOrderIndexAvailable(true);
      setGalleryRows((data as GalleryRow[]) || []);
    } catch (err: unknown) {
      if (isMissingOrderIndexColumnError(err)) {
        try {
          const { data, error } = await supabase
            .from("gallery")
            .select("id, created_at, title, category, image_url, storage_path")
            .order("created_at", { ascending: false });

          if (error) throw error;
          setIsOrderIndexAvailable(false);
          setGalleryRows(((data as Omit<GalleryRow, "order_index">[]) || []).map((r) => ({ ...r, order_index: null })));
          toast({
            title: "Ordering not enabled",
            description: "Add an order_index column to enable drag-and-drop ordering.",
            variant: "destructive",
          });
        } catch (fallbackErr: unknown) {
          const message = fallbackErr instanceof Error ? fallbackErr.message : "Failed to load gallery";
          toast({ title: "Gallery load failed", description: message, variant: "destructive" });
        }
      } else {
        const message = err instanceof Error ? err.message : "Failed to load gallery";
        toast({ title: "Gallery load failed", description: message, variant: "destructive" });
      }
    } finally {
      setIsLoadingGallery(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) void loadGallery();
  }, [isAuthenticated]);

  // Ctrl+V: paste images directly into the upload queue
  useEffect(() => {
    if (!isAuthenticated) return;

    const onPaste = (e: ClipboardEvent) => {
      const imageFiles = extractImageFilesFromClipboard(e.clipboardData);
      if (imageFiles.length === 0) return;
      addFiles(imageFiles);
      e.preventDefault();
    };

    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const secretPin = import.meta.env.VITE_ADMIN_PIN as string | undefined;
    if (!secretPin) {
      toast({
        title: "Admin PIN not configured",
        description: "Please configure the Admin PIN and redeploy.",
        variant: "destructive",
      });
      return;
    }

    if (pin === secretPin) {
      setIsAuthenticated(true);
      toast({ title: "Welcome, Admin!", description: "You can now manage gallery images." });
    } else {
      toast({ title: "Invalid PIN", description: "Please try again.", variant: "destructive" });
    }
  };

  const handleLogout = () => {
    pending.forEach((p) => revokeObjectUrlSafe(p.previewUrl));
    setIsAuthenticated(false);
    setPin("");
    setPending([]);
    setGalleryRows([]);
  };

  const addFiles = (files: File[]) => {
    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length === 0) {
      toast({
        title: "No images found",
        description: "Please add image files (JPG/PNG/WebP).",
        variant: "destructive",
      });
      return;
    }

    const newPending: PendingUpload[] = imageFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: createObjectUrlSafe(file) || undefined,
      title: file.name.replace(/\.[^/.]+$/, ""),
      category: "Weddings",
    }));

    setPending((prev) => [...prev, ...newPending]);
    toast({ title: "Images Added", description: `${newPending.length} image(s) queued.` });
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    addFiles(Array.from(e.dataTransfer.files));
  };

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    addFiles(files);
    e.target.value = "";
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    // Only deactivate when leaving the drop zone
    if (e.currentTarget === e.target) setIsDragActive(false);
  };

  const removeImage = (id: string) => {
    setPending((prev) => {
      const removing = prev.find((img) => img.id === id);
      revokeObjectUrlSafe(removing?.previewUrl);
      return prev.filter((img) => img.id !== id);
    });
    toast({ title: "Image Removed" });
  };

  const uploadAll = async () => {
    if (!hasPending) return;
    setIsUploading(true);

    try {
      const currentMaxOrderIndex = galleryRows.reduce(
        (max, row) => Math.max(max, row.order_index ?? -1),
        -1
      );
      let nextOrderIndex = currentMaxOrderIndex + 1;

      for (const item of pending) {
        const { publicUrl, storagePath } = await uploadToSupabase(item.file);

        const baseRow = {
          title: item.title || null,
          category: item.category,
          image_url: publicUrl,
          storage_path: storagePath,
        };

        const rowWithOrder = isOrderIndexAvailable
          ? { ...baseRow, order_index: nextOrderIndex++ }
          : baseRow;

        const { error: insertError } = await supabase.from("gallery").insert(rowWithOrder);

        if (insertError) {
          if (isMissingOrderIndexColumnError(insertError)) {
            setIsOrderIndexAvailable(false);
            const { error: retryError } = await supabase.from("gallery").insert(baseRow);
            if (retryError) throw retryError;
            toast({
              title: "Ordering not enabled",
              description: "Uploaded without order_index. Add the column to enable reordering.",
              variant: "destructive",
            });
          } else {
            throw insertError;
          }
        }
      }

      toast({
        title: "Upload complete",
        description: `${pendingCount} image(s) uploaded to Supabase.`,
      });
      pending.forEach((p) => revokeObjectUrlSafe(p.previewUrl));
      setPending([]);
      await loadGallery();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload failed";
      toast({ title: "Upload failed", description: message, variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const deleteGalleryItem = async (row: GalleryRow) => {
    try {
      // Remove the file from Storage first (if we have storage_path)
      if (row.storage_path) {
        const { error: storageError } = await supabase
          .storage
          .from(supabaseGalleryBucket)
          .remove([row.storage_path]);

        if (storageError) throw storageError;
      }

      const { error: deleteError } = await supabase.from("gallery").delete().eq("id", row.id);
      if (deleteError) throw deleteError;

      setGalleryRows((prev) => prev.filter((r) => r.id !== row.id));
      toast({ title: "Deleted", description: "Removed from gallery and storage." });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Delete failed";
      toast({ title: "Delete failed", description: message, variant: "destructive" });
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor)
  );

  const saveOrderIndexes = async (rows: GalleryRow[]) => {
    if (!isOrderIndexAvailable) {
      toast({
        title: "Ordering not enabled",
        description: "Add an order_index column to enable drag-and-drop ordering.",
        variant: "destructive",
      });
      return;
    }

    setIsSavingOrder(true);
    try {
      const updates = rows.map((row, index) => ({ id: row.id, order_index: index }));
      const { error } = await supabase.from("gallery").upsert(updates, { onConflict: "id" });
      if (error) throw error;
      toast({ title: "Order saved", description: "Gallery order updated." });
    } catch (err: unknown) {
      if (isMissingOrderIndexColumnError(err)) {
        setIsOrderIndexAvailable(false);
      }
      const message = err instanceof Error ? err.message : "Failed to save order";
      toast({ title: "Save failed", description: message, variant: "destructive" });
      // Re-sync to server state
      await loadGallery();
    } finally {
      setIsSavingOrder(false);
    }
  };

  const onDragEnd = async (event: DragEndEvent) => {
    if (!isOrderIndexAvailable) {
      toast({
        title: "Ordering not enabled",
        description: "Add an order_index column to enable drag-and-drop ordering.",
        variant: "destructive",
      });
      await loadGallery();
      return;
    }

    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) return;

    setGalleryRows((prev) => {
      const oldIndex = prev.findIndex((r) => r.id === active.id);
      const newIndex = prev.findIndex((r) => r.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return prev;

      const next = arrayMove(prev, oldIndex, newIndex);
      void saveOrderIndexes(next);
      return next;
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="glass-card p-8 w-full max-w-sm">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-primary/20">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-display text-center mb-6">ADMIN ACCESS</h1>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter PIN"
              className="w-full px-4 py-3 bg-input border border-border rounded-lg text-center text-2xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-primary/50"
              maxLength={4}
            />
            <button
              type="submit"
              className="w-full py-3 bg-primary text-primary-foreground font-display tracking-wider rounded-lg hover:bg-primary/90 transition-all"
            >
              UNLOCK
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-display">GALLERY ADMIN</h1>
          <motion.button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-secondary text-muted-foreground rounded-lg hover:text-foreground transition-all"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </motion.button>
        </div>

        {/* Upload Zone */}
        <div
          onDrop={handleFileDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onPaste={(e) => {
            if (!isAuthenticated) return;
            const imageFiles = extractImageFilesFromClipboard(e.clipboardData);
            if (imageFiles.length === 0) return;
            addFiles(imageFiles);
            e.preventDefault();
          }}
          onClick={openFilePicker}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openFilePicker();
            }
          }}
          tabIndex={0}
          role="button"
          aria-label="Upload images. Drag and drop, click to select, or paste with Ctrl+V."
          className={
            "glass-card border-2 border-dashed transition-all p-12 text-center cursor-pointer mb-8 outline-none focus-visible:ring-2 focus-visible:ring-primary/60 " +
            (isDragActive
              ? "border-primary/60 bg-primary/5"
              : "border-border hover:border-primary/50")
          }
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-display mb-2">DROP IMAGES HERE</p>
          <p className="text-sm text-muted-foreground">
            Drag & drop images to queue them • Or paste (Ctrl+V)
          </p>

          <div className="mt-6 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
            <motion.button
              type="button"
              onClick={openFilePicker}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center px-5 py-2.5 bg-secondary text-muted-foreground rounded-lg hover:text-foreground transition-all"
            >
              <span className="text-sm">Choose files</span>
            </motion.button>
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              multiple
              className="hidden"
              onChange={handleFilePick}
            />
          </div>
        </div>

        {/* Existing Gallery */}
        <div className="glass-card p-6 mb-8">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="text-xl font-display">LIVE GALLERY</h2>
            <div className="flex items-center gap-3">
              {(isSavingOrder || isLoadingGallery) && (
                <div className="text-[10px] font-mono text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    {isSavingOrder ? "Saving order" : "Loading"}
                  </span>
                </div>
              )}

              <motion.button
                type="button"
                onClick={() => void loadGallery()}
                className="px-4 py-2 bg-secondary text-muted-foreground rounded-lg hover:text-foreground transition-all"
                disabled={isLoadingGallery || isSavingOrder}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {isLoadingGallery ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Refreshing
                  </span>
                ) : (
                  "Refresh"
                )}
              </motion.button>
            </div>
          </div>

          {galleryRows.length === 0 ? (
            <p className="text-sm text-muted-foreground">No images yet.</p>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
              <SortableContext items={galleryRows.map((r) => r.id)} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {galleryRows.map((row) => (
                    <SortableGalleryTile key={row.id} row={row} onDelete={(r) => void deleteGalleryItem(r)} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>

        {/* Image List */}
        {hasPending && (
          <div className="glass-card p-6">
            <h2 className="text-xl font-display mb-4">PENDING UPLOADS</h2>
            <div className="space-y-3">
              {pending.map((image) => (
                <div
                  key={image.id}
                  className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-md overflow-hidden bg-black/40 border border-border/40 flex-shrink-0">
                      {image.previewUrl ? (
                        <img
                          src={image.previewUrl}
                          alt={image.title || image.file.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-5 h-5 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm">{image.file.name}</span>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {(image.file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      value={image.title}
                      onChange={(e) => {
                        const value = e.target.value;
                        setPending((prev) =>
                          prev.map((img) => (img.id === image.id ? { ...img, title: value } : img))
                        );
                      }}
                      placeholder="Title"
                      className="hidden md:block w-48 px-3 py-1 bg-input border border-border rounded text-sm"
                    />
                    <select
                      value={image.category}
                      onChange={(e) => {
                        const value = e.target.value as PendingUpload["category"];
                        setPending((prev) =>
                          prev.map((img) => (img.id === image.id ? { ...img, category: value } : img))
                        );
                      }}
                      className="px-3 py-1 bg-input border border-border rounded text-sm"
                    >
                      <option value="Weddings">Weddings</option>
                      <option value="Cinematic">Cinematic</option>
                    </select>
                    <button
                      onClick={() => removeImage(image.id)}
                      className="text-destructive hover:text-destructive/80 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <motion.button
              className="w-full mt-6 py-3 bg-primary text-primary-foreground font-display tracking-wider rounded-lg hover:bg-primary/90 transition-all"
              disabled={isUploading}
              onClick={uploadAll}
              whileHover={!isUploading ? { scale: 1.03, boxShadow: "var(--shadow-glow-purple)" } : undefined}
              whileTap={!isUploading ? { scale: 0.98 } : undefined}
            >
              {isUploading ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  UPLOADING...
                </span>
              ) : (
                "UPLOAD TO GALLERY"
              )}
            </motion.button>

            <div className="mt-3 text-center text-[10px] font-mono text-muted-foreground/70">
              Bucket: {supabaseGalleryBucket} • Table: gallery
            </div>
          </div>
        )}

        {!hasPending && (
          <p className="text-center text-muted-foreground text-sm">
            No images queued. Drag and drop images above to add them.
          </p>
        )}
      </div>
    </div>
  );
}
