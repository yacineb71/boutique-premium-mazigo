CREATE TABLE `mediaAssets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`url` text NOT NULL,
	`storageKey` varchar(500),
	`filename` varchar(255),
	`mimeType` varchar(100),
	`altText` varchar(255),
	`kind` varchar(32) NOT NULL DEFAULT 'image',
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `mediaAssets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `productMedia` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`mediaId` int NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `productMedia_id` PRIMARY KEY(`id`)
);
