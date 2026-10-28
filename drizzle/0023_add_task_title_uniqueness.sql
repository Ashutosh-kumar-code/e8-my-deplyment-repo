-- 🔥 FIX: Prevent duplicate task names per client per month
-- This addresses the MBTVPage duplicate issue where the same task name is created multiple times
-- when monthly task generation is accidentally re-triggered.
--
-- The constraint ensures that within a client+month combination, no two tasks can have the same title.
-- This is enforced at the database level, making it impossible for duplicates to slip through.

CREATE UNIQUE INDEX "Task_clientId_title_monthFolder_unique" ON "Task" ("clientId", "title", "monthFolder")
WHERE "title" IS NOT NULL AND "monthFolder" IS NOT NULL;

-- Optional: Add a comment explaining the constraint
COMMENT ON INDEX "Task_clientId_title_monthFolder_unique" IS 
'Ensures unique task titles per client per month. Prevents MBTVPage duplicate bug where monthly generation could create duplicate-named tasks.';
