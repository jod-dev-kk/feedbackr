import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { widgetFormSchema, TWidgetFormPayload } from "@repo/common/schemas";
import { ImageAnnotator } from "@/components/ImageAnnotator.tsx";
import { WidgetForm } from "./components/WidgetForm.tsx";
import { WidgetTrigger } from "./components/WidgetTrigger.tsx";

export function Widget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnnotating, setIsAnnotating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const methods = useForm<TWidgetFormPayload>({
    resolver: zodResolver(widgetFormSchema),
    defaultValues: { message: "", email: "", image: undefined },
  });

  const imageFile = methods.watch("image");

  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [imageFile]);

  const handleSaveAnnotation = (annotatedFile: File) => {
    methods.setValue("image", annotatedFile, { shouldValidate: true });
    setIsAnnotating(false);
  };

  return createPortal(
    <div
      id="widget-root"
      className="fixed bottom-4 right-4 z-9999 font-inter md:bottom-6 md:right-6"
    >
      <FormProvider {...methods}>
        <AnimatePresence mode="wait">
          {isOpen ? (
            <main className="relative flex items-end gap-4">
              <AnimatePresence>
                {isAnnotating && previewUrl && (
                  <ImageAnnotator
                    key="annotator"
                    imageUrl={previewUrl}
                    onSave={handleSaveAnnotation}
                    onCancel={() => setIsAnnotating(false)}
                  />
                )}
              </AnimatePresence>

              <div className="relative inline-block">
                <WidgetForm
                  key="form"
                  onClose={() => setIsOpen(false)}
                  onOpenAnnotator={() => setIsAnnotating(true)}
                />
              </div>
            </main>
          ) : (
            <WidgetTrigger
              key="trigger"
              isOpen={isOpen}
              onClick={() => setIsOpen(true)}
            />
          )}
        </AnimatePresence>
      </FormProvider>
    </div>,
    document.body,
  );
}
