-- 创建数据库（如果不存在）
-- 注意：这个脚本需要数据库已存在，或者手动创建数据库
CREATE DATABASE IF NOT EXISTS `booking_system`
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE `booking_system`;

-- 删除已存在的表（可选）
DROP TABLE IF EXISTS `bookings`;
DROP TABLE IF EXISTS `users`;

-- 创建用户表
CREATE TABLE `users` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `phone` VARCHAR(20) NOT NULL UNIQUE,
    `nickname` VARCHAR(100),
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建预约表
CREATE TABLE `bookings` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `service_name` VARCHAR(200) NOT NULL,
    `booking_date` DATE NOT NULL,
    `time_slot` VARCHAR(50) NOT NULL,
    `booking_key` VARCHAR(100) UNIQUE,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    INDEX `idx_user_id` (`user_id`),
    INDEX `idx_booking_date` (`booking_date`),
    INDEX `idx_booking_key` (`booking_key`),
    -- 唯一约束：同一用户不能在同一时间段预约相同服务
    UNIQUE KEY `uk_user_service_time` (`user_id`, `service_name`, `booking_date`, `time_slot`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;