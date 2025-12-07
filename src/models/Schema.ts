// /src/models/Schema.ts

import {
  bigint,
  boolean,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

// This file defines the structure of your database tables using the Drizzle ORM.

// To modify the database schema:
// 1. Update this file with your desired changes.
// 2. Generate a new migration by running: `npm run db:generate`

// The generated migration file will reflect your schema changes.
// The migration is automatically applied during the next database interaction,
// so there's no need to run it manually or restart the Next.js server.

// Need a database for production? Check out https://www.prisma.io/?via=saasboilerplatesrc
// Tested and compatible with Next.js Boilerplate
export const organizationSchema = pgTable(
  'organization',
  {
    id: text('id').primaryKey(),
    stripeCustomerId: text('stripe_customer_id'),
    stripeSubscriptionId: text('stripe_subscription_id'),
    stripeSubscriptionPriceId: text('stripe_subscription_price_id'),
    stripeSubscriptionStatus: text('stripe_subscription_status'),
    stripeSubscriptionCurrentPeriodEnd: bigint(
      'stripe_subscription_current_period_end',
      { mode: 'number' },
    ),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  },
  (table) => {
    return {
      stripeCustomerIdIdx: uniqueIndex('stripe_customer_id_idx').on(
        table.stripeCustomerId,
      ),
    };
  },
);

export const todoSchema = pgTable('todo', {
  id: serial('id').primaryKey(),
  ownerId: text('owner_id').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

export const anpr_records = pgTable('anpr_records', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  created_at: timestamp('created_at').defaultNow(),

  plate_wim: text('plate_wim'),
  plate_camera: text('plate_camera'),
  confidence_wim: numeric('confidence_wim', { precision: 5, scale: 2 }),
  confidence_camera: numeric('confidence_camera', { precision: 5, scale: 2 }),

  image_wim_url: text('image_wim_url'),
  image_camera_url: text('image_camera_url'),
  thumbnail_url: text('thumbnail_url'),

  status: text('status').default('pending'),
  is_accurate: boolean('is_accurate'),
  inspected_by: text('inspected_by'),
  inspected_at: timestamp('inspected_at'),
  reviewed_by: text('reviewed_by'),
  reviewed_at: timestamp('reviewed_at'),
  approved_by: text('approved_by'),
  approved_at: timestamp('approved_at'),
  notes: text('notes'),

  organization_id: text('organization_id'),
});
