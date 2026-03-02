import {
  X,
  Send,
  Camera,
  MessageSquare,
  Loader2,
  Trash2,
  Edit2,
  CheckCircle2,
} from "lucide-react";
import { Button, Textarea, Input, Label } from "@repo/ui";
import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";
import { TWidgetFormPayload } from "@repo/common/schemas";
import { useState } from "react";
import { useScreenshot } from "@/hooks/useScreenShot.ts";

export function WidgetForm({
  onClose,
  onOpenAnnotator,
}: {
  onClose: () => void;
  onOpenAnnotator: () => void;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useFormContext<TWidgetFormPayload>();

  const { captureScreen, isCapturing } = useScreenshot();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const imageFile = watch("image");
  const thumbnailUrl = imageFile ? URL.createObjectURL(imageFile) : null;

  const handleTakeScreenshot = async () => {
    const file = await captureScreen();
    if (file) {
      setValue("image", file, { shouldValidate: true });
      onOpenAnnotator();
    }
  };

  const handleRemoveImage = () => {
    setValue("image", undefined as unknown as File, { shouldValidate: true });
  };

  const onSubmit = async (data: TWidgetFormPayload) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("FINAL SUBMIT PAYLOAD:", data);

    setIsSubmitting(false);
    setIsSuccess(true);

    setTimeout(() => {
      setIsSuccess(false);
      reset(); // Clears the form completely
      onClose(); // Closes the widget
    }, 2000);
  };

  if (isSuccess) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex h-[300px] w-[calc(100vw-2rem)] flex-col items-center justify-center gap-4 overflow-hidden rounded-xl border border-border bg-card shadow-2xl sm:w-[400px]"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
        >
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </motion.div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground">
            Feedback Sent!
          </h3>
          <p className="text-sm text-muted-foreground">
            Thank you for helping us improve.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      layoutId="form"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-border bg-card shadow-2xl sm:w-[400px]"
    >
      <div className="flex items-center justify-between bg-primary px-4 py-3 text-primary-foreground">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          <span className="font-medium">Send Feedback</span>
        </div>
        <button
          onClick={onClose}
          className="rounded-md p-1 transition-colors hover:bg-white/20"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5 p-5"
      >
        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            {...register("message")}
            placeholder="Describe your issue or share your ideas..."
            className="min-h-[100px] resize-none bg-muted/30"
            autoFocus
          />
          {errors.message && (
            <span className="text-xs text-red-500">
              {errors.message.message}
            </span>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="your@email.com"
            className="bg-muted/30"
          />
          {errors?.email && (
            <span className="text-xs text-red-500">{errors.email.message}</span>
          )}
        </div>

        <div className="space-y-2">
          <Label>Attachments</Label>

          {!imageFile ? (
            <div>
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={handleTakeScreenshot}
                disabled={isCapturing}
                className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
              >
                {isCapturing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
                {isCapturing ? "Capturing screen..." : "Take a screenshot"}
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between rounded-md border border-border bg-muted/30 p-2">
              <div className="flex items-center gap-3 overflow-hidden">
                {thumbnailUrl && (
                  <img
                    src={thumbnailUrl}
                    alt="Screenshot thumbnail"
                    className="h-10 w-16 rounded object-cover shadow-sm border border-border"
                  />
                )}
                <span className="text-xs text-muted-foreground truncate">
                  screenshot.png
                </span>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={onOpenAnnotator}
                  className="h-8 w-8 hover:text-primary"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={handleRemoveImage}
                  className="h-8 w-8 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          {errors.image && (
            <span className="text-xs text-red-500 block">
              {errors.image.message as string}
            </span>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full gap-2 py-5 mt-2"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          {isSubmitting ? "Sending..." : "Send Feedback"}
        </Button>
      </form>
    </motion.div>
  );
}
