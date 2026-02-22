import {
  ReactSketchCanvas,
  type ReactSketchCanvasRef,
} from "react-sketch-canvas";
import { useRef, useState } from "react";

export const ImageAnnotator = () => {
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const [eraseMode, setEraseMode] = useState(false);

  const handleEraserClick = () => {
    setEraseMode(true);
    canvasRef.current?.eraseMode(true);
  };

  const handlePenClick = () => {
    setEraseMode(false);
    canvasRef.current?.eraseMode(false);
  };

  const handleUndoClick = () => {
    canvasRef.current?.undo();
  };

  const handleRedoClick = () => {
    canvasRef.current?.redo();
  };

  const handleClearClick = () => {
    canvasRef.current?.clearCanvas();
  };

  const handleResetClick = () => {
    canvasRef.current?.resetCanvas();
  };

  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div className="max-w-[550px] w-full h-[500px] border border-border rounded-md flex flex-col ">
        <section className="border-b border-border bg-neutral-100 rounded-t-md flex items-center p-3 justify-center">
          Header
        </section>
        <main className="h-full w-full flex-1">
          <div className="flex items-center justify-center flex-col gap-2 p-2">
            <div className="w-[540px] h-[400px] flex items-center justify-center rounded-md">
              <ReactSketchCanvas
                className="object-cover w-full h-full rounded-md"
                ref={canvasRef}
                backgroundImage="https://images.unsplash.com/photo-1761839256547-0a1cd11b6dfb?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                exportWithBackgroundImage
              />
            </div>
          </div>
        </main>
        <section className="border-t border-border p-3 bg-neutral-100 rounded-b-md">
          <div className="d-flex gap-2 align-items-center ">
            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              disabled={!eraseMode}
              onClick={handlePenClick}
            >
              Pen
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              disabled={eraseMode}
              onClick={handleEraserClick}
            >
              Eraser
            </button>
            <div className="vr" />
            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              onClick={handleUndoClick}
            >
              Undo
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              onClick={handleRedoClick}
            >
              Redo
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              onClick={handleClearClick}
            >
              Clear
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              onClick={handleResetClick}
            >
              Reset
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
