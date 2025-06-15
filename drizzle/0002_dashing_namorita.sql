CREATE TABLE `sessions` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`section_id` bigint NOT NULL,
	`title` varchar(255) NOT NULL,
	`session_order` bigint NOT NULL,
	`session_date` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_section_id_sections_id_fk` FOREIGN KEY (`section_id`) REFERENCES `sections`(`id`) ON DELETE no action ON UPDATE no action;