CREATE TABLE `exams` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`class_id` bigint NOT NULL,
	`name` varchar(255) NOT NULL,
	`exam_date` timestamp NOT NULL,
	`total_score` decimal(5,2) NOT NULL DEFAULT '100.00',
	`common_comment` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `exams_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `student_exam_results` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`exam_id` bigint NOT NULL,
	`student_profile_id` bigint NOT NULL,
	`score` decimal(5,2) NOT NULL,
	`individual_comment` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `student_exam_results_id` PRIMARY KEY(`id`),
	CONSTRAINT `student_exam_unq` UNIQUE(`exam_id`,`student_profile_id`)
);
--> statement-breakpoint
ALTER TABLE `sections` ADD `status` enum('UPCOMING','ONGOING','FINISHED') DEFAULT 'UPCOMING' NOT NULL;--> statement-breakpoint
ALTER TABLE `notices` ADD `importance` enum('NORMAL','IMPORTANT') DEFAULT 'NORMAL' NOT NULL;--> statement-breakpoint
ALTER TABLE `exams` ADD CONSTRAINT `exams_class_id_classes_id_fk` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `student_exam_results` ADD CONSTRAINT `student_exam_results_exam_id_exams_id_fk` FOREIGN KEY (`exam_id`) REFERENCES `exams`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `student_exam_results` ADD CONSTRAINT `student_exam_results_student_profile_id_profiles_id_fk` FOREIGN KEY (`student_profile_id`) REFERENCES `profiles`(`id`) ON DELETE no action ON UPDATE no action;