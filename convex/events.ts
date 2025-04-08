import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createEvent = mutation({
  args: {
    title: v.string(),
    start: v.string(),
    end: v.optional(v.string()),
    allDay: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("No está autenticado");

    const userId = identity.subject;

    return await ctx.db.insert("events", {
      title: args.title,
      start: args.start,
      end: args.end,
      allDay: args.allDay ?? false,
      completed: false,
      userId
    });
  }
});

export const toggleEventCompletion = mutation({
  args: {
    id: v.id("events"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("No está autenticado");

    const userId = identity.subject;

    const event = await ctx.db.get(args.id);
    if (!event || event.userId !== userId) {
      throw new Error("Evento no encontrado o no autorizado");
    }

    await ctx.db.patch(args.id, {
      completed: !event.completed,
    });

    return !event.completed;
  },
});

export const deleteEvent = mutation({
  args: {
    id: v.id("events"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("No está autenticado");

    const userId = identity.subject;
    const event = await ctx.db.get(args.id);

    if (!event || event.userId !== userId) {
      throw new Error("Evento no encontrado o no autorizado");
    }

    await ctx.db.delete(args.id);
  },
});

export const getUserEvents = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("No está autenticado");

    const userId = identity.subject;

    return await ctx.db
      .query("events")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  }
});

export const updateEventDate = mutation({
  args: {
    id: v.id("events"),
    start: v.string(),
    end: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("No está autenticado");

    const userId = identity.subject;
    const event = await ctx.db.get(args.id);

    if (!event || event.userId !== userId) {
      throw new Error("Evento no encontrado o no autorizado");
    }

    await ctx.db.patch(args.id, {
      start: args.start,
      end: args.end ?? args.start,
    });
  },
});
