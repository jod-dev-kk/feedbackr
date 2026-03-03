import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Send,
  Camera,
  Loader2,
  Trash2,
  Edit2,
  CheckCircle2,
  ChevronDown,
  Pen,
  MessageSquare,
} from "lucide-react";
import { Button, Textarea, Input } from "@repo/ui";
import { type TWidgetFormPayload } from "@repo/common/schemas";
import { cn } from "@repo/utils/client";
import { ImageAnnotator } from "@/components/ImageAnnotator.tsx";
import { useScreenshot } from "@/hooks/useScreenShot.ts";
import { submitFeedback } from "@/utils/widget.handler.utils.ts";
import { useGetSubmitDetails } from "@/hooks/useGetSubmitDetails.ts";

interface WidgetFormProps {
  isAnnotating: boolean;
  previewUrl: string | null;
  onClose: () => void;
  onOpenAnnotator: () => void;
  onCloseAnnotator: () => void;
  onAnnotationSave: (file: File) => void;
}

export function WidgetForm({
  isAnnotating,
  previewUrl,
  onClose,
  onOpenAnnotator,
  onCloseAnnotator,
  onAnnotationSave,
}: WidgetFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useFormContext<TWidgetFormPayload>();
  const { getData } = useGetSubmitDetails();
  const { captureScreen, isCapturing } = useScreenshot();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [rawImage, setRawImage] = useState<File | null>(null);
  const [rawImageUrl, setRawImageUrl] = useState<string | null>(null);

  const imageFile = watch("image");

  useEffect(() => {
    if (!rawImage) {
      setRawImageUrl(null);
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setRawImageUrl(reader.result as string);
    reader.readAsDataURL(rawImage);
  }, [rawImage]);

  const handleTakeScreenshot = async () => {
    const file = await captureScreen();
    if (file) {
      setRawImage(file);
      setValue("image", file, { shouldValidate: true });
      onOpenAnnotator();
    }
  };

  const onSubmit = async (data: TWidgetFormPayload) => {
    setIsSubmitting(true);

    try {
      const sdkData = await getData();

      await submitFeedback({ ...data, ...sdkData })?.then(() => {
        setIsSubmitting(false);
        setIsSuccess(true);

        setTimeout(() => {
          reset();
          onClose();
        }, 2500);
      });
    } catch (error) {
      setIsSubmitting(false);
      console.error("Submission Error:", error);
    }
  };

  const cardClass = cn(
    "fixed inset-0 z-[9998] flex flex-col bg-card",
    isAnnotating
      ? [
          "md:fixed md:inset-auto md:z-[9998]",
          "md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2",
          "md:w-[82vw] md:h-[85vh]",
          "md:rounded-2xl md:border md:border-border/60 md:shadow-2xl",
        ]
      : [
          "md:absolute md:inset-auto md:z-auto",
          "md:bottom-[calc(100%+12px)] md:right-0",
          "md:w-[380px] md:h-auto",
          "md:rounded-2xl md:border md:border-border/60 md:shadow-2xl md:shadow-black/10",
        ],
  );

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -16, scale: 0.95 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={cardClass}
      >
        <div
          className="relative shrink-0 overflow-hidden px-4 py-4 md:rounded-t-2xl"
          style={{
            background: "linear-gradient(135deg, #443aff 0%, #6c63ff 100%)",
          }}
        >
          <div className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/5" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                <CheckCircle2 className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Success</p>
                <p className="text-xs text-white/70">
                  Message sent successfully
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/15 hover:text-white"
            >
              <ChevronDown className="h-5 w-5 md:hidden" />
              <X className="hidden h-4 w-4 md:block" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-5 p-8">
          <motion.svg
            viewBox="0 0 100 100"
            className="h-24 w-24 overflow-visible"
          >
            {[...Array(8)].map((_, i) => {
              const angle = (i * 360) / 8;
              const radius = 38;

              return (
                <motion.circle
                  key={i}
                  cx="50"
                  cy="50"
                  r="2.5"
                  fill="#22c55e"
                  initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                  animate={{
                    scale: [0, 1.5, 0],
                    x: Math.cos((angle * Math.PI) / 180) * radius,
                    y: Math.sin((angle * Math.PI) / 180) * radius,
                    opacity: [1, 1, 0],
                  }}
                  transition={{
                    duration: 0.6,
                    delay: 0.15,
                    ease: "easeOut",
                  }}
                />
              );
            })}

            <motion.circle
              cx="50"
              cy="50"
              r="40"
              fill="#f0fdf4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 250,
                damping: 20,
                delay: 0.1,
              }}
            />

            <motion.path
              d="M 32 52 L 45 65 L 70 35"
              fill="transparent"
              stroke="#22c55e"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 0.4,
                delay: 0.35,
                ease: "easeOut",
              }}
            />
          </motion.svg>

          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-foreground">
              Feedback received!
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Thanks for helping us improve. We read every message.
            </p>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {isAnnotating && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-9997 hidden md:block"
            onClick={onCloseAnnotator}
          />
        )}
      </AnimatePresence>

      <motion.div
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 12 }}
        transition={{
          layout: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
          opacity: { duration: 0.25 },
          y: { duration: 0.25 },
        }}
        className={cardClass}
      >
        <div
          className="relative shrink-0 overflow-hidden px-4 py-4 md:rounded-t-2xl"
          style={{
            background: "linear-gradient(135deg, #443aff 0%, #6c63ff 100%)",
          }}
        >
          <div className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/5" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                {isAnnotating ? (
                  <Pen className="h-4 w-4 text-white" />
                ) : (
                  <MessageSquare className="h-4 w-4 text-white" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  {isAnnotating ? "Annotate Screenshot" : "Send Feedback"}
                </p>
                <p className="text-xs text-white/70">
                  {isAnnotating
                    ? "Draw to highlight issues"
                    : "We read every message"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={isAnnotating ? onCloseAnnotator : onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/15 hover:text-white"
            >
              <ChevronDown className="h-5 w-5 md:hidden" />
              <X className="hidden h-4 w-4 md:block" />
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {isAnnotating ? (
            <motion.div
              key="annotator"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="flex min-h-0 flex-1 flex-col"
            >
              {rawImageUrl && (
                <ImageAnnotator
                  imageUrl={rawImageUrl}
                  onSave={onAnnotationSave}
                  onCancel={onCloseAnnotator}
                />
              )}
            </motion.div>
          ) : (
            <motion.form
              key="form-body"
              onSubmit={handleSubmit(onSubmit)}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="flex min-h-0 flex-1 flex-col"
            >
              <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="message"
                    className="text-xs font-medium text-foreground/70"
                  >
                    Message <span className="text-destructive">*</span>
                  </label>
                  <Textarea
                    id="message"
                    {...register("message")}
                    placeholder="Describe your issue or share your ideas..."
                    aria-invalid={!!errors.message}
                    aria-describedby={
                      errors.message ? "message-error" : undefined
                    }
                    className="min-h-[90px] resize-none rounded-xl border-border/80 bg-muted/40 text-sm placeholder:text-muted-foreground/60"
                    autoFocus
                  />
                  <AnimatePresence>
                    {errors.message && (
                      <FieldError
                        id="message-error"
                        message={errors.message.message!}
                      />
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="email"
                    className="text-xs font-medium text-foreground/70"
                  >
                    Email <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="you@example.com"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className="rounded-xl border-border/80 bg-muted/40 text-sm placeholder:text-muted-foreground/60"
                  />
                  <AnimatePresence>
                    {errors.email && (
                      <FieldError
                        id="email-error"
                        message={errors.email.message!}
                      />
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground/70">
                    Screenshot <span className="text-destructive">*</span>
                  </label>
                  <div className="relative min-h-[60px]">
                    <AnimatePresence mode="wait" initial={false}>
                      {!imageFile ? (
                        <motion.button
                          key="capture"
                          type="button"
                          onClick={handleTakeScreenshot}
                          disabled={isCapturing}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="group absolute inset-0 flex items-center gap-3 rounded-xl border border-dashed border-border bg-muted/20 px-3 py-2.5 transition-colors hover:border-primary/40 hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/60 transition-colors group-hover:bg-primary/10">
                            {isCapturing ? (
                              <Loader2 className="h-4 w-4 animate-spin text-primary" />
                            ) : (
                              <Camera className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                            )}
                          </div>
                          <div className="text-left">
                            <p className="text-xs font-medium text-foreground/80 group-hover:text-foreground">
                              {isCapturing ? "Capturing…" : "Take a screenshot"}
                            </p>
                            <p className="text-[11px] text-muted-foreground/60">
                              Capture and annotate your screen
                            </p>
                          </div>
                        </motion.button>
                      ) : (
                        <motion.div
                          key="preview"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="absolute inset-0 flex items-center gap-3 rounded-xl border border-border/80 bg-muted/30 px-2"
                        >
                          {previewUrl && (
                            <img
                              src={previewUrl}
                              alt="Screenshot preview"
                              className="h-10 w-16 shrink-0 rounded-lg border border-border/60 object-cover shadow-sm"
                            />
                          )}
                          <span className="flex-1 truncate text-xs font-medium text-muted-foreground">
                            screenshot.png
                          </span>
                          <div className="flex items-center gap-0.5">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={onOpenAnnotator}
                              aria-label="Edit"
                              className="h-7 w-7 text-muted-foreground/60 hover:bg-primary/10 hover:text-primary"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setRawImage(null);
                                setValue(
                                  "image",
                                  undefined as unknown as File,
                                  { shouldValidate: true },
                                );
                              }}
                              aria-label="Remove"
                              className="h-7 w-7 text-muted-foreground/60 hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <AnimatePresence>
                    {errors.image && (
                      <FieldError
                        id="image-error"
                        message={errors.image.message as string}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="shrink-0 border-t border-border/40 p-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full gap-2 rounded-xl py-5 text-sm font-medium shadow-md shadow-primary/20"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" /> Send Feedback
                    </>
                  )}
                </Button>
                <p className="mt-2.5 text-center text-[10px] text-muted-foreground/50">
                  Powered by <span className="font-semibold">Feedbackr</span>
                </p>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

function FieldError({ message, id }: { message: string; id: string }) {
  return (
    <motion.p
      id={id}
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      className="text-[11px] text-destructive"
    >
      {message}
    </motion.p>
  );
}
