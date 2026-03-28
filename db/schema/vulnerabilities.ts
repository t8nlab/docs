import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const vulnerabilities = pgTable("vulnerabilities", {
    id: text("id").primaryKey(), // Custom ID like TPL-EXT-TEST-001-26
    affectedVersions: text("affected_versions").array().notNull(), // PostgreSQL array of strings
    component: text("component", { enum: ["Orbit System", "Gravity Runtime", "TitanPL Core Extension", "Extensions Registry", "Documentation", "Auth Services"] }).notNull(),
    severity: text("severity", { enum: ["high", "medium", "low"] }).notNull(),
    description: text("description").notNull(),
    workaround: text("workaround"),
    status: text("status", { enum: ["active", "resolved"] }).default("active").notNull(),
    devDetails: text("dev_details"), // Active dev details / logs
    createdAt: timestamp("created_at").defaultNow(),
});
