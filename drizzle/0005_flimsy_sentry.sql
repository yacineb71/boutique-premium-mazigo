CREATE TABLE `contactMessageReplies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`messageId` int NOT NULL,
	`adminUserId` int NOT NULL,
	`recipientEmail` varchar(320) NOT NULL,
	`subject` varchar(255) NOT NULL,
	`body` text NOT NULL,
	`deliveryMethod` varchar(32) NOT NULL DEFAULT 'mailto',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contactMessageReplies_id` PRIMARY KEY(`id`)
);
