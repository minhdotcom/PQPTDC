ALTER TABLE "anpr_records" ADD COLUMN "is_accurate" boolean;--> statement-breakpoint
ALTER TABLE "anpr_records" ADD COLUMN "inspected_by" text;--> statement-breakpoint
ALTER TABLE "anpr_records" ADD COLUMN "inspected_at" timestamp;--> statement-breakpoint
ALTER TABLE "anpr_records" ADD COLUMN "approved_by" text;--> statement-breakpoint
ALTER TABLE "anpr_records" ADD COLUMN "approved_at" timestamp;--> statement-breakpoint
ALTER TABLE "anpr_records" DROP COLUMN IF EXISTS "accuracy_percent";