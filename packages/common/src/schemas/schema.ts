// Zod schemas.

import z, { string } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const widgetFormSchema = z.object({
  message: z.string().min(1, "Message required"),
  email: z.email("Invalid email"),
  image: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, "Max 5MB")
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only JPEG, PNG, WebP allowed",
    ),
});

export const createFeedbackSchema = z.object({
  url: z.string().nonempty(),
  images: z
    .array(
      z.object({
        url: z.url(),
        key: z.string(),
      }),
    )
    .optional(),
  message: z.string().optional(),
  email: z.email(),
  clientContext: z
    .record(z.union([z.string(), z.number(), z.symbol()]), z.any())
    .optional(),
  debugContext: z
    .record(z.union([z.string(), z.number(), z.symbol()]), z.any())
    .optional(),
});

export const DomainSchema = z.object({
  name: z.string().refine(
    (data) => {
      if (data.length > 0) return true;
      return false;
    },
    { error: "Name of domain is required" },
  ),
  url: z.hostname(),
  // publicApiKey: z.string(),
  // status: z.string().refine((status) => {
  //   if (["ACTIVE", "PAUSED", "INACTIVE"].includes(status)) {
  //     return true;
  //   }
  //   return false;
  // }),
});

export type TWidgetFormPayload = z.infer<typeof widgetFormSchema>;
export type TcreateFeedbackPayload = z.infer<typeof createFeedbackSchema>;
export type TDomainPayload = z.infer<typeof DomainSchema>;
