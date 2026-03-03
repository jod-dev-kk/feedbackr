import { useRef, useState, useEffect } from "react";
import {
  ReactSketchCanvas,
  type ReactSketchCanvasRef,
} from "react-sketch-canvas";
import {
  Pen,
  Eraser,
  Undo2,
  Redo2,
  Trash2,
  Check,
  Loader2,
} from "lucide-react";

import { Button } from "@repo/ui";
import { cn } from "@repo/utils/client";

interface ImageAnnotatorProps {
  imageUrl: string;
  onSave: (file: File) => void;
  onCancel: () => void;
}

export const ImageAnnotator = ({
  imageUrl,
  onSave,
  onCancel,
}: ImageAnnotatorProps) => {
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const [eraseMode, setEraseMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [aspectRatio, setAspectRatio] = useState<number | null>(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setAspectRatio(img.width / img.height);
    };
    img.src = imageUrl;
  }, [imageUrl]);

  const setErase = (val: boolean) => {
    setEraseMode(val);
    canvasRef.current?.eraseMode(val);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const dataUrl = await canvasRef.current?.exportImage("png");
      if (!dataUrl) return;

      const blob = await (await fetch(dataUrl)).blob();

      onSave(
        new File([blob], "annotated-screenshot.png", { type: "image/png" }),
      );
    } catch (err) {
      console.error("Failed to save annotation", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!aspectRatio) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto bg-muted/20 p-4">
        <div
          className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-xl border border-border/60 bg-white shadow-sm"
          style={{ aspectRatio: String(aspectRatio) }}
        >
          <div className="absolute inset-0">
            <ReactSketchCanvas
              ref={canvasRef}
              style={{ width: "100%", height: "100%" }}
              backgroundImage={imageUrl}
              preserveBackgroundImageAspectRatio="none"
              exportWithBackgroundImage
              strokeColor="#ef4444"
              strokeWidth={4}
            />
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-center gap-1.5 border-t border-border/60 px-4 py-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setErase(false)}
          className={cn(
            "h-8 gap-1.5 px-2.5 text-xs font-medium transition-colors",
            !eraseMode
              ? "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary"
              : "text-muted-foreground",
          )}
        >
          <Pen className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Pen</span>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setErase(true)}
          className={cn(
            "h-8 gap-1.5 px-2.5 text-xs font-medium transition-colors",
            eraseMode
              ? "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary"
              : "text-muted-foreground",
          )}
        >
          <Eraser className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Eraser</span>
        </Button>

        <div className="mx-1 h-5 w-px bg-border" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => canvasRef.current?.undo()}
          className="h-8 gap-1.5 px-2.5 text-xs font-medium text-muted-foreground"
        >
          <Undo2 className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Undo</span>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => canvasRef.current?.redo()}
          className="h-8 gap-1.5 px-2.5 text-xs font-medium text-muted-foreground"
        >
          <Redo2 className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Redo</span>
        </Button>

        <div className="mx-1 h-5 w-px bg-border" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => canvasRef.current?.clearCanvas()}
          className="h-8 gap-1.5 px-2.5 text-xs font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Clear</span>
        </Button>

        <div className="mx-1 h-5 w-px bg-border" />

        <Button
          type="button"
          size="sm"
          onClick={handleSave}
          disabled={isSaving}
          className="h-8 gap-1.5 rounded-lg px-3 text-xs"
        >
          {isSaving ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Check className="h-3.5 w-3.5" />
          )}
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
};
