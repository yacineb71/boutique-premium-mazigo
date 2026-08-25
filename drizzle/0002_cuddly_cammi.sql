CREATE TABLE `productSupplierMeta` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`supplierUrl` text,
	`supplierSku` varchar(255),
	`supplierCost` decimal(10,2),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `productSupplierMeta_id` PRIMARY KEY(`id`),
	CONSTRAINT `productSupplierMeta_productId_unique` UNIQUE(`productId`)
);
