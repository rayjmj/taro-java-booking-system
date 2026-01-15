-- src/main/resources/db/data.sql

USE `booking_system`;

-- 清除现有数据
DELETE FROM `bookings` WHERE id > 0;
DELETE FROM `users` WHERE id > 0;

-- 重置自增ID
ALTER TABLE `users` AUTO_INCREMENT = 1;
ALTER TABLE `bookings` AUTO_INCREMENT = 1;

-- 插入测试用户
INSERT INTO `users` (`phone`, `nickname`, `created_at`) VALUES
('13800138000', '用户_13800', NOW()),
('13900139000', '用户_13900', NOW()),
('13600136000', '用户_13600', NOW());

-- 插入测试预约数据
INSERT INTO `bookings` (`user_id`, `service_name`, `booking_date`, `time_slot`, `booking_key`, `created_at`) VALUES
(1, '理发服务', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '14:00-15:00',
 CONCAT('key_', UUID_SHORT(), '_理发服务'), NOW()),
(1, '美容服务', DATE_ADD(CURDATE(), INTERVAL 2 DAY), '10:00-11:00',
 CONCAT('key_', UUID_SHORT(), '_美容服务'), NOW()),
(2, '健身指导', DATE_ADD(CURDATE(), INTERVAL 3 DAY), '16:00-17:00',
 CONCAT('key_', UUID_SHORT(), '_健身指导'), NOW()),
(3, '编程教学', CURDATE(), '09:00-10:00',
 CONCAT('key_', UUID_SHORT(), '_编程教学'), NOW());

-- 查看插入的数据
SELECT '用户表数据:' AS '';
SELECT * FROM `users`;

SELECT '预约表数据:' AS '';
SELECT
    b.id,
    b.service_name,
    b.booking_date,
    b.time_slot,
    u.phone,
    u.nickname,
    DATE_FORMAT(b.created_at, '%Y-%m-%d %H:%i:%s') as created_at
FROM `bookings` b
JOIN `users` u ON b.user_id = u.id
ORDER BY b.created_at DESC;