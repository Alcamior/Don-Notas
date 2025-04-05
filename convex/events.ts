import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createEvent = mutation({
  args: {
    title: v.string(),
    start: v.string(), // formato ISO
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
      completed: false, // <--- campo nuevo
      userId
    });
  }
});
export const toggleEventCompletion = mutation({
    args: {
      id: v.id("events"), // ¡Usa v.id("events") en lugar de v.string()!
    },
    handler: async (ctx, args) => {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) throw new Error("No está autenticado");
  
      const userId = identity.subject;
  
      // Obtener el evento actual
      const event = await ctx.db.get(args.id); // Usar get() para buscar por ID directamente
      if (!event || event.userId !== userId) {
        throw new Error("Evento no encontrado o no autorizado");
      }
  
      // Actualizar el campo "completed" usando patch
      await ctx.db.patch(args.id, {
        completed: !event.completed,
      });
  
      // Retorna el nuevo estado (opcional)
      return !event.completed;
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