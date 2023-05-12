CREATE TABLE `todos` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`status` text DEFAULT ('progress') NOT NULL,
	`created_at` text DEFAULT (DATETIME('now', 'localtime')) NOT NULL,
	`updated_at` text,
	`deleted_at` text
);
