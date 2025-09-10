import { integer, pgTable, uuid ,text,timestamp,varchar} from "drizzle-orm/pg-core";
import { usersTable } from "./user.model.js";

export const urlsTable = pgTable("urls", {
  id: uuid().primaryKey().defaultRandom(),
   shortcode:varchar('code',{length:55}).notNull().unique(),
   targetUrl:varchar('target_url',{length:255}).notNull(),
  
   validity:integer('validity').default(30),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').$onUpdate(()=> new Date())
});
