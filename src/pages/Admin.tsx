import { useState } from "react";
import { Upload, Lock, LogOut, Image, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ADMIN_PIN = "1234"; // Simple PIN protection

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [images, setImages] = useState<{ id: number; name: string; category: string }[]>([]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      setIsAuthenticated(true);
      toast({ title: "Welcome, Admin!", description: "You can now manage gallery images." });
    } else {
      toast({ title: "Invalid PIN", description: "Please try again.", variant: "destructive" });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPin("");
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    
    // Simulate adding files (will be replaced with Supabase upload)
    const newImages = files.map((file, i) => ({
      id: Date.now() + i,
      name: file.name,
      category: "Weddings"
    }));
    
    setImages([...images, ...newImages]);
    toast({ title: "Images Added", description: `${files.length} image(s) ready for upload.` });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeImage = (id: number) => {
    setImages(images.filter(img => img.id !== id));
    toast({ title: "Image Removed" });
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
            Default PIN: 1234
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
        </div>

        {/* Image List */}
        {images.length > 0 && (
          <div className="glass-card p-6">
            <h2 className="text-xl font-display mb-4">PENDING UPLOADS</h2>
            <div className="space-y-3">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Image className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm">{image.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <select
                      value={image.category}
                      onChange={(e) => {
                        setImages(images.map(img => 
                          img.id === image.id ? { ...img, category: e.target.value } : img
                        ));
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
              onClick={() => toast({ 
                title: "Connect Lovable Cloud", 
                description: "Enable Cloud to upload images to Supabase storage." 
              })}
            >
              UPLOAD TO GALLERY
            </button>
          </div>
        )}

        {images.length === 0 && (
          <p className="text-center text-muted-foreground text-sm">
            No images queued. Drag and drop images above to add them.
          </p>
        )}
      </div>
    </div>
  );
}
