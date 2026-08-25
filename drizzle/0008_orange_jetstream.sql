CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`category` varchar(120) NOT NULL,
	`description` text,
	`price` decimal(10,2) NOT NULL,
	`image` text NOT NULL,
	`popularityRank` int NOT NULL DEFAULT 999,
	`inStock` int NOT NULL DEFAULT 1,
	`active` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
