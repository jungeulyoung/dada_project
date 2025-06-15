CREATE TABLE `classes` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`organization_id` bigint NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` varchar(1000),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `classes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `section_students` (
	`section_id` bigint NOT NULL,
	`student_profile_id` bigint NOT NULL,
	CONSTRAINT `section_students_section_id_student_profile_id_pk` PRIMARY KEY(`section_id`,`student_profile_id`)
);
--> statement-breakpoint
CREATE TABLE `sections` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`class_id` bigint NOT NULL,
	`teacher_profile_id` bigint,
	`name` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sections_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `classes` ADD CONSTRAINT `classes_organization_id_organizations_id_fk` FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `section_students` ADD CONSTRAINT `section_students_section_id_sections_id_fk` FOREIGN KEY (`section_id`) REFERENCES `sections`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `section_students` ADD CONSTRAINT `section_students_student_profile_id_profiles_id_fk` FOREIGN KEY (`student_profile_id`) REFERENCES `profiles`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sections` ADD CONSTRAINT `sections_class_id_classes_id_fk` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sections` ADD CONSTRAINT `sections_teacher_profile_id_profiles_id_fk` FOREIGN KEY (`teacher_profile_id`) REFERENCES `profiles`(`id`) ON DELETE no action ON UPDATE no action;