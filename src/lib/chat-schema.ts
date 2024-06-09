import { z } from "zod";

export const chatSchema = z.object({
	message: z.string().min(1, "Message is required"),
});

export type ChatInputs = z.infer<typeof chatSchema>;
