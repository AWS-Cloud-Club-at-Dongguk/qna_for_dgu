// lambda function to create a room

import { z } from "zod";

/** ======================= Create Room HTTP API ======================= **/

// 1. Create Room에 대한 클라이언트 입력용 스키마
export const createRoomRequestSchema = z.object({
    title: z
        .string()
        .max(100, "Title must be at most 100 characters long")
        .transform((val) => val.trim() || "Untitled") // || 연산자에서 ""는 falsy로 간주되어 "Untitled"로 대체됨
        .default("Untitled"),
    description: z.string().optional(),
    bannerUrl: z.string().optional(),
    iconUrl: z.string().optional()
});

// 2. DynamoDB에 저장할 때 사용할 Room 스키마
export const roomSchema = createRoomRequestSchema.extend({
    roomId: z.string(),
    createdAt: z.string(),
    isActive: z.boolean().default(true),
})

// 3. Create Room에 대한 Response 스키마
export const createRoomResponseSchema = z.object({
    title: z.string(),
    qrCodeUrl: z.string(),
});


/** ======================= Update/Delete Room HTTP API ======================= **/

// Delete Room에 대한 클라이언트 입력용 스키마
export const deleteRoomRequestSchema = z.object({
    roomId: z.string(),
});

// Update Room에 대한 클라이언트 입력용 스키마
export const updateRoomRequestSchema = z.object({
    title: z.string().max(100, "Title must be at most 100 characters long").optional(),
    description: z.string().optional(),
    bannerUrl: z.string().optional(),
    iconUrl: z.string().optional()
});

export const updateRoomResponseSchema = z.object({
    title: z.string(),
});

/** ======================= Get Room Messages HTTP API ======================= **/

const messageSchema = z.object({
    messageId: z.string(),
    nickname: z.string(),
    content: z.string(),
    timestamp: z.string(),
    senderId: z.string(),
});

export const getRoomMessagesResponseSchema = z.object({
    messages: z.array(messageSchema),
});

/** ======================= Types ======================= **/

export type CreateRoomRequest = z.infer<typeof createRoomRequestSchema>;
export type Room = z.infer<typeof roomSchema>;
export type CreateRoomResponse = z.infer<typeof createRoomResponseSchema>;

export type DeleteRoomRequest = z.infer<typeof deleteRoomRequestSchema>;
export type UpdateRoomRequest = z.infer<typeof updateRoomRequestSchema>;
export type UpdateRoomResponse = z.infer<typeof updateRoomResponseSchema>;

export type Message = z.infer<typeof messageSchema>;
export type GetRoomMessagesResponse = z.infer<typeof getRoomMessagesResponseSchema>;