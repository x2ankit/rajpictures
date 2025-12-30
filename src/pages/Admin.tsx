import { useEffect, useMemo, useState } from "react";
import { Upload, Lock, LogOut, Image as ImageIcon, Trash2, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase, supabaseGalleryBucket } from "@/lib/supabaseClient";

const ADMIN_PIN_ENV = "VITE_ADMIN_PIN";

type PendingUpload = {
  id: string;
  file: File;
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
};

function createObjectUrlSafe(file: File): string | null {
  try {
    return URL.createObjectURL(file);
  } catch {
    return null;
  }
}

function safeFileName(name: string) {
  return name
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "");
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

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [pending, setPending] = useState<PendingUpload[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingGallery, setIsLoadingGallery] = useState(false);
  const [galleryRows, setGalleryRows] = useState<GalleryRow[]>([]);

  const pendingCount = pending.length;
  const hasPending = pendingCount > 0;

  const accept = useMemo(() => "image/*", []);

  const loadGallery = async () => {
    setIsLoadingGallery(true);
    try {
      const { data, error } = await supabase
        .from("gallery")
        .select("id, created_at, title, category, image_url, storage_path")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setGalleryRows((data as GalleryRow[]) || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load gallery";
      toast({ title: "Gallery load failed", description: message, variant: "destructive" });
    } finally {
      setIsLoadingGallery(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) void loadGallery();
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const secretPin = import.meta.env.VITE_ADMIN_PIN as string | undefined;
    if (!secretPin) {
      toast({
        title: "Admin PIN not configured",
        description: `Set ${ADMIN_PIN_ENV} in your environment (.env.local or .env).`,
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
      title: file.name.replace(/\.[^/.]+$/, ""),
      category: "Weddings",
    }));

    setPending((prev) => [...prev, ...newPending]);
    toast({ title: "Images Added", description: `${newPending.length} image(s) queued.` });
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    addFiles(Array.from(e.dataTransfer.files));
  };

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    addFiles(files);
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeImage = (id: string) => {
    setPending((prev) => prev.filter((img) => img.id !== id));
    toast({ title: "Image Removed" });
  };

  const uploadAll = async () => {
    if (!hasPending) return;
    setIsUploading(true);

    try {
      for (const item of pending) {
        const { publicUrl, storagePath } = await uploadToSupabase(item.file);

        const { error: insertError } = await supabase.from("gallery").insert({
          title: item.title || null,
          category: item.category,
          image_url: publicUrl,
          storage_path: storagePath,
        });

        if (insertError) throw insertError;
      }

      toast({
        title: "Upload complete",
        description: `${pendingCount} image(s) uploaded to Supabase.`,
      });
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
          
          <p className="text-center text-muted-foreground text-xs mt-6">
            PIN is read from <span className="font-mono text-primary">{ADMIN_PIN_ENV}</span>
          </p>
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
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-secondary text-muted-foreground rounded-lg hover:text-foreground transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

        {/* Upload Zone */}
        <div
          onDrop={handleFileDrop}
          onDragOver={handleDragOver}
          className="glass-card border-2 border-dashed border-border hover:border-primary/50 transition-all p-12 text-center cursor-pointer mb-8"
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-display mb-2">DROP IMAGES HERE</p>
          <p className="text-sm text-muted-foreground">
            Drag and drop images to upload to the gallery
          </p>

          <div className="mt-6">
            <label className="inline-flex items-center justify-center px-5 py-2.5 bg-secondary text-muted-foreground rounded-lg hover:text-foreground transition-all pointer-events-auto cursor-pointer">
              <span className="text-sm">Choose files</span>
              <input
                type="file"
                accept={accept}
                multiple
                className="hidden"
                onChange={handleFilePick}
              />
            </label>
          </div>
        </div>

        {/* Existing Gallery */}
        <div className="glass-card p-6 mb-8">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="text-xl font-display">LIVE GALLERY</h2>
            <button
              type="button"
              onClick={() => void loadGallery()}
              className="px-4 py-2 bg-secondary text-muted-foreground rounded-lg hover:text-foreground transition-all"
              disabled={isLoadingGallery}
            >
              {isLoadingGallery ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Refreshing
                </span>
              ) : (
                "Refresh"
              )}
            </button>
          </div>

          {galleryRows.length === 0 ? (
            <p className="text-sm text-muted-foreground">No images yet.</p>
          ) : (
            <div className="space-y-3">
              {galleryRows.slice(0, 30).map((row) => (
                <div
                  key={row.id}
                  className="flex items-center justify-between gap-4 p-4 bg-secondary/50 rounded-lg"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-md overflow-hidden bg-black/40 border border-border/40 flex-shrink-0">
                      <img src={row.image_url} alt={row.title || "Gallery image"} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm truncate">{row.title || "(Untitled)"}</div>
                      <div className="text-[10px] font-mono text-muted-foreground truncate">
                        {row.category || "Uncategorized"} • id: {row.id}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => void deleteGalleryItem(row)}
                    className="text-destructive hover:text-destructive/80 transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {galleryRows.length > 30 && (
                <div className="text-[10px] font-mono text-muted-foreground/70 text-center">
                  Showing latest 30 items.
                </div>
              )}
            </div>
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
                    <ImageIcon className="w-5 h-5 text-muted-foreground" />
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
            
            <button
              className="w-full mt-6 py-3 bg-primary text-primary-foreground font-display tracking-wider rounded-lg hover:bg-primary/90 transition-all"
              disabled={isUploading}
              onClick={uploadAll}
            >
              {isUploading ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  UPLOADING...
                </span>
              ) : (
                "UPLOAD TO GALLERY"
              )}
            </button>

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
