import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const MAX_BYTES = 900_000;

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not signed in");
    const row = await ctx.db
      .query("userData")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
    return row
      ? { state: row.state, matches: row.matches, updatedAt: row.updatedAt }
      : null;
  },
});

export const save = mutation({
  args: { state: v.string(), matches: v.string() },
  handler: async (ctx, { state, matches }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not signed in");
    if (state.length + matches.length > MAX_BYTES) throw new Error("Data too large");
    JSON.parse(state);
    JSON.parse(matches);
    const updatedAt = Date.now();
    const row = await ctx.db
      .query("userData")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
    if (row) await ctx.db.patch(row._id, { state, matches, updatedAt });
    else await ctx.db.insert("userData", { userId, state, matches, updatedAt });
    return updatedAt;
  },
});
