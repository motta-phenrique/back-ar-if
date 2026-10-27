import { z } from "zod";

export const roomOutputSchema = z.object({
  id: z.uuid(),
  slug: z.string(),
  name: z.string(),
  blockId: z.uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type RoomOutput = z.infer<typeof roomOutputSchema>;

export function toRoomOutput(room: RoomOutput): RoomOutput {
  return roomOutputSchema.parse(room);
}
