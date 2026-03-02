import {
  ReactSketchCanvas,
  type ReactSketchCanvasRef,
} from "react-sketch-canvas";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@repo/ui";

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

  const handleToggleEraser = () => {
    setEraseMode(!eraseMode);
    canvasRef.current?.eraseMode(!eraseMode);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const dataUrl = await canvasRef.current?.exportImage("png");
      if (!dataUrl) return;

      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "annotated-screenshot.png", {
        type: "image/png",
      });

      onSave(file);
    } catch (err) {
      console.error("Failed to save annotation", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="absolute right-[calc(100%+1rem)] bottom-0 flex flex-col rounded-xl border border-border bg-card shadow-2xl z-50 overflow-hidden"
    >
      <div className="flex items-center justify-between border-b border-border p-3 bg-muted/30">
        <span className="font-medium text-sm">Annotate Screenshot</span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <div className="w-[800px] h-[500px] bg-secondary flex items-center justify-center p-4">
        <ReactSketchCanvas
          ref={canvasRef}
          preserveBackgroundImageAspectRatio=""
          className="w-full h-full rounded-lg overflow-hidden object-contain"
          backgroundImage={imageUrl}
          exportWithBackgroundImage
          strokeColor="#ef4444"
          strokeWidth={4}
        />
      </div>

      <div className="border-t border-border p-3 bg-muted/30 flex justify-center gap-3">
        <Button
          variant={!eraseMode ? "default" : "outline"}
          size="sm"
          onClick={handleToggleEraser}
        >
          Pen
        </Button>
        <Button
          variant={eraseMode ? "default" : "outline"}
          size="sm"
          onClick={handleToggleEraser}
        >
          Eraser
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => canvasRef.current?.undo()}
        >
          Undo
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => canvasRef.current?.redo()}
        >
          Redo
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => canvasRef.current?.clearCanvas()}
        >
          Clear
        </Button>
      </div>
    </motion.div>
  );
};
