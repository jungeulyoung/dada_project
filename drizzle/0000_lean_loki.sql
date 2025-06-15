CREATE TABLE `profiles` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`user_id` bigint NOT NULL,
	`organization_id` bigint NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('STUDENT','PARENT','TEACHER','ADMIN') NOT NULL,
	`parent_profile_id` bigint,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `profiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `organizations` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `organizations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notice_targets` (
	`notice_id` bigint NOT NULL,
	`target_type` enum('ORGANIZATION','CLASS','SECTION') NOT NULL,
	`target_id` bigint NOT NULL,
	CONSTRAINT `notice_targets_notice_id_target_type_target_id_pk` PRIMARY KEY(`notice_id`,`target_type`,`target_id`)
);
--> statement-breakpoint
CREATE TABLE `notices` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`author_profile_id` bigint NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `notices_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `profiles` ADD CONSTRAINT `profiles_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `profiles` ADD CONSTRAINT `profiles_organization_id_organizations_id_fk` FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notice_targets` ADD CONSTRAINT `notice_targets_notice_id_notices_id_fk` FOREIGN KEY (`notice_id`) REFERENCES `notices`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notices` ADD CONSTRAINT `notices_author_profile_id_profiles_id_fk` FOREIGN KEY (`author_profile_id`) REFERENCES `profiles`(`id`) ON DELETE no action ON UPDATE no action;