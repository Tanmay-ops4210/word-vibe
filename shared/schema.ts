import { pgTable, text, uuid, numeric, timestamp } from "drizzle-orm/pg-core";

export const sentimentAnalyses = pgTable("sentiment_analyses", {
  id: uuid("id").primaryKey().defaultRandom(),
  inputText: text("input_text").notNull(),
  inputType: text("input_type").notNull().default("text"),
  sentiment: text("sentiment").notNull(),
  confidence: numeric("confidence").notNull().default("0"),
  explanation: text("explanation").notNull(),
  fileName: text("file_name"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  ipAddress: text("ip_address"),
});
