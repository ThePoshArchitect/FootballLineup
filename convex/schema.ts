import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  userData: defineTable({
    userId: v.id("users"),
    state: v.string(),
    matches: v.string(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),
});
