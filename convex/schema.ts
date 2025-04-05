import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema ({
    documents: defineTable({
        title: v.string(),
        userId: v.string(),
        isArchive: v.boolean(),
        parentDocument: v.optional(v.id("documents")),
        content: v.optional(v.string()),
        coverImage: v.optional(v.string()),
        icon: v.optional(v.string()),
        isPublished: v.boolean(),
    })
    .index("by_user",["userId"])
    .index("by_user_parent",["userId","parentDocument"]),

    events: defineTable({
        title: v.string(),
        start: v.string(), // formato ISO
        end: v.optional(v.string()),
        allDay: v.optional(v.boolean()),
        userId: v.string(),
        completed: v.optional(v.boolean()) // Campo adicional para indicar si el evento está completado
      }).index("by_user", ["userId"])
});
