import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence } from "framer-motion";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  widgetFormSchema,
  type TWidgetFormPayload,
} from "@repo/common/schemas";
import { WidgetForm } from "./components/WidgetForm.tsx";
import { WidgetTrigger } from "./components/WidgetTrigger.tsx";
import { cn } from "@repo/utils/client";
import { handlePostMessage } from "@/utils/postMessage.utils.ts";

export function Widget() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isAnnotating, setIsAnnotating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const methods = useForm<TWidgetFormPayload>({
    resolver: zodResolver(widgetFormSchema),
    defaultValues: { message: "", email: "", image: undefined },
  });

  const imageFile = methods.watch("image");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl(null);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(imageFile);
  }, [imageFile]);

  const handleClose = () => {
    setIsOpen(false);
    setIsAnnotating(false);
    setTimeout(() => {
      handlePostMessage("FEEDBACK_WIDGET_CLOSE");
    }, 300);
  };

  if (!mounted) return null;

  return (
    <div
      id="widget-root"
      className={cn(
        "fixed bottom-0 right-0 z-9999 font-inter flex items-center justify-center p-1",
        // !isOpen && "size-full",
      )}
    >
      <FormProvider {...methods}>
        <AnimatePresence>
          {isOpen && (
            <WidgetForm
              key="form"
              isAnnotating={isAnnotating}
              previewUrl={previewUrl}
              onClose={handleClose}
              onOpenAnnotator={() => setIsAnnotating(true)}
              onCloseAnnotator={() => setIsAnnotating(false)}
              onAnnotationSave={(file: File) => {
                methods.setValue("image", file, { shouldValidate: true });
                setIsAnnotating(false);
              }}
            />
          )}
        </AnimatePresence>

        <div
          className={`mt-3 flex justify-end ${isOpen ? "hidden md:flex" : "flex"}`}
        >
          <WidgetTrigger
            isOpen={isOpen}
            onClick={() => {
              if (isOpen) {
                setIsOpen(false);
                setTimeout(
                  () => handlePostMessage("FEEDBACK_WIDGET_CLOSE"),
                  300,
                );
              } else {
                handlePostMessage("FEEDBACK_WIDGET_OPEN");
                setTimeout(() => setIsOpen(true), 300);
              }
            }}
          />
        </div>
      </FormProvider>
    </div>
  );
}
