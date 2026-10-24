// features/messaging/api/schemas.ts
import { z } from "zod";

const id = z.string().uuid();
const iso = z.string();

export const userBriefSchema = z.object({
  id,
  name: z.string(),
  role: z.string(),
  avatar_url: z.string().nullable(),
});
export const personSchema = z.object({
  id,
  name: z.string(),
  role: z.string().optional(),
  avatar_url: z.string().nullish(),
});

export const lastMessageSchema = z.object({
  id,
  sender_name: z.string(),
  content: z.string().nullable(),
  deleted: z.boolean(),
  created_at: iso,
});

export const conversationSchema = z.object({
  id,
  conversation_type: z.enum(["private", "group"]),
  name: z.string(),
  other_user: userBriefSchema.nullable(),
  my_role: z.string().nullish(),
  unread_count: z.number().int(),
  last_message: lastMessageSchema.nullable(),
  last_activity_at: iso,
});
export const memberSchema = z.object({ user: userBriefSchema, role: z.string(), joined_at: iso });
export const conversationDetailSchema = conversationSchema.extend({
  members: z.array(memberSchema),
});
export const conversationsPageSchema = z.object({
  items: z.array(conversationSchema),
  total: z.number().int(),
});

export const replyToSchema = z.object({
  id,
  sender_name: z.string(),
  content: z.string().nullable(),
  deleted: z.boolean(),
});
export const messageSchema = z.object({
  id,
  conversation_id: id,
  sender: userBriefSchema,
  content: z.string().nullable(),
  deleted: z.boolean(),
  edited_at: iso.nullable(),
  created_at: iso,
  reply_to: replyToSchema.nullish(),
  is_mine: z.boolean(),
});
export const messagesPageSchema = z.object({
  items: z.array(messageSchema),
  has_more: z.boolean(),
});
export const unreadSchema = z.object({
  unread_messages: z.number().int(),
  unread_conversations: z.number().int(),
});
export const peopleSearchSchema = z.object({ people: z.object({ items: z.array(personSchema) }) });

// Ce que l'on envoie : les limites du serveur.
export const sendSchema = z.object({
  content: z.string().trim().min(1).max(4000),
  reply_to_id: id.optional(),
});
export const editSchema = z.object({ content: z.string().trim().min(1).max(4000) });
export const groupSchema = z.object({
  name: z.string().trim().min(2).max(100),
  member_ids: z.array(id).min(1).max(49),
});
export const renameSchema = z.object({ name: z.string().trim().min(2).max(100) });
export const membersSchema = z.object({ user_ids: z.array(id).min(1).max(49) });
export const privateSchema = z.object({ user_id: id });
export const searchQuerySchema = z.string().trim().min(2).max(100);

export type UserBrief = z.infer<typeof userBriefSchema>;
export type Person = z.infer<typeof personSchema>;
export type Conversation = z.infer<typeof conversationSchema>;
export type ConversationDetail = z.infer<typeof conversationDetailSchema>;
export type Message = z.infer<typeof messageSchema>;
export type MessagesPage = z.infer<typeof messagesPageSchema>;
