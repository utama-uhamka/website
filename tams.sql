/*
 Navicat Premium Dump SQL

 Source Server         : LOCALHOST
 Source Server Type    : MySQL
 Source Server Version : 80403 (8.4.3)
 Source Host           : localhost:3306
 Source Schema         : tams

 Target Server Type    : MySQL
 Target Server Version : 80403 (8.4.3)
 File Encoding         : 65001

 Date: 01/01/2026 10:46:46
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for accounts
-- ----------------------------
DROP TABLE IF EXISTS `accounts`;
CREATE TABLE `accounts`  (
  `account_id` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `campus_id` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `type` enum('PLN','PDAM') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `account_number` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `account_name` varchar(150) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `address` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`account_id`) USING BTREE,
  UNIQUE INDEX `account_id`(`account_id` ASC) USING BTREE,
  INDEX `accounts_campus_id`(`campus_id` ASC) USING BTREE,
  CONSTRAINT `accounts_ibfk_1` FOREIGN KEY (`campus_id`) REFERENCES `campuses` (`campus_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for activities
-- ----------------------------
DROP TABLE IF EXISTS `activities`;
CREATE TABLE `activities`  (
  `activity_id` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `campus_id` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `user_id` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `title` varchar(200) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `description` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `location` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `date` date NOT NULL,
  `time_start` time NOT NULL,
  `time_end` time NOT NULL,
  `photo_1` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`activity_id`) USING BTREE,
  UNIQUE INDEX `activity_id`(`activity_id` ASC) USING BTREE,
  INDEX `activities_campus_id`(`campus_id` ASC) USING BTREE,
  INDEX `activities_user_id`(`user_id` ASC) USING BTREE,
  CONSTRAINT `activities_ibfk_1` FOREIGN KEY (`campus_id`) REFERENCES `campuses` (`campus_id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `activities_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for attendances
-- ----------------------------
DROP TABLE IF EXISTS `attendances`;
CREATE TABLE `attendances`  (
  `attendance_id` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `building_id` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `user_id` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `type` enum('IN','OUT') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `address` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `photo_1` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `longitude` decimal(12, 9) NULL DEFAULT NULL,
  `latitude` decimal(12, 9) NULL DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`attendance_id`) USING BTREE,
  UNIQUE INDEX `attendance_id`(`attendance_id` ASC) USING BTREE,
  INDEX `attendances_ibfk_1`(`building_id` ASC) USING BTREE,
  INDEX `attendances_ibfk_2`(`user_id` ASC) USING BTREE,
  CONSTRAINT `attendances_ibfk_1` FOREIGN KEY (`building_id`) REFERENCES `buildings` (`building_id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `attendances_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for billings
-- ----------------------------
DROP TABLE IF EXISTS `billings`;
CREATE TABLE `billings`  (
  `billing_id` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `item_id` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `campus_id` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `date` datetime NOT NULL,
  `total_billing` float(10, 2) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`billing_id`) USING BTREE,
  UNIQUE INDEX `billing_id`(`billing_id` ASC) USING BTREE,
  INDEX `item_id`(`item_id` ASC) USING BTREE,
  INDEX `campus_id`(`campus_id` ASC) USING BTREE,
  CONSTRAINT `billings_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `billings_ibfk_2` FOREIGN KEY (`campus_id`) REFERENCES `campuses` (`campus_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for buildings
-- ----------------------------
DROP TABLE IF EXISTS `buildings`;
CREATE TABLE `buildings`  (
  `building_id` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `campus_id` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `building_name` varchar(150) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `photo_1` varchar(155) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `longitude` decimal(12, 9) NULL DEFAULT NULL,
  `latitude` decimal(12, 9) NULL DEFAULT NULL,
  `radius` int NULL DEFAULT 100,
  PRIMARY KEY (`building_id`) USING BTREE,
  UNIQUE INDEX `building_id`(`building_id` ASC) USING BTREE,
  INDEX `campus_id`(`campus_id` ASC) USING BTREE,
  CONSTRAINT `buildings_ibfk_1` FOREIGN KEY (`campus_id`) REFERENCES `campuses` (`campus_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for campuses
-- ----------------------------
DROP TABLE IF EXISTS `campuses`;
CREATE TABLE `campuses`  (
  `campus_id` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `campus_name` varchar(150) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `photo_1` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `alamat` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `cover` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `kata_pengantar` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`campus_id`) USING BTREE,
  UNIQUE INDEX `campus_id`(`campus_id` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for category_items
-- ----------------------------
DROP TABLE IF EXISTS `category_items`;
CREATE TABLE `category_items`  (
  `category_item_id` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `category_item_name` varchar(150) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `photo_1` varchar(155) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `type` varchar(15) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`category_item_id`) USING BTREE,
  UNIQUE INDEX `category_item_id`(`category_item_id` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for evaluations
-- ----------------------------
DROP TABLE IF EXISTS `evaluations`;
CREATE TABLE `evaluations`  (
  `evaluation_id` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `user_id` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `evaluator_id` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `period` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `category` enum('Kinerja','Kedisiplinan','Kerjasama','Inisiatif','Tanggung Jawab') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `score` decimal(5, 2) NOT NULL,
  `notes` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`evaluation_id`) USING BTREE,
  UNIQUE INDEX `evaluation_id`(`evaluation_id` ASC) USING BTREE,
  INDEX `evaluations_user_id`(`user_id` ASC) USING BTREE,
  INDEX `evaluations_evaluator_id`(`evaluator_id` ASC) USING BTREE,
  CONSTRAINT `evaluations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `evaluations_ibfk_2` FOREIGN KEY (`evaluator_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for event_categories
-- ----------------------------
DROP TABLE IF EXISTS `event_categories`;
CREATE TABLE `event_categories`  (
  `event_category_id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `description` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`event_category_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for events
-- ----------------------------
DROP TABLE IF EXISTS `events`;
CREATE TABLE `events`  (
  `event_id` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `campus_id` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `event_title` varchar(200) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `event_description` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `date` datetime NOT NULL,
  `time_1` time NOT NULL,
  `time_2` time NOT NULL,
  `photo_1` varchar(155) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `tempat` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `event_kategori` int NOT NULL,
  `petugas` varchar(250) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT '',
  `user_id` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  PRIMARY KEY (`event_id`) USING BTREE,
  INDEX `campus_id`(`campus_id` ASC) USING BTREE,
  INDEX `events_user_id_foreign_idx`(`user_id` ASC) USING BTREE,
  CONSTRAINT `events_ibfk_1` FOREIGN KEY (`campus_id`) REFERENCES `campuses` (`campus_id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `events_user_id_foreign_idx` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for floors
-- ----------------------------
DROP TABLE IF EXISTS `floors`;
CREATE TABLE `floors`  (
  `floor_id` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `building_id` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `floor_name` varchar(150) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `photo_1` varchar(155) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`floor_id`) USING BTREE,
  INDEX `floors_ibfk_1`(`building_id` ASC) USING BTREE,
  CONSTRAINT `floors_ibfk_1` FOREIGN KEY (`building_id`) REFERENCES `buildings` (`building_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for issue_histories
-- ----------------------------
DROP TABLE IF EXISTS `issue_histories`;
CREATE TABLE `issue_histories`  (
  `issue_history_id` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `user_id` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `item_id` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `campus_id` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `issue_title` varchar(200) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `issue_description` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `item_condition` enum('Baik','Menunggu Diperbaiki','Diperbaiki','Rusak') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'Menunggu Diperbaiki',
  `status` int NOT NULL,
  `photo_1` varchar(155) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `photo_2` varchar(155) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `oleh` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `teknisi_lainnya` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `status_maintenance` int NOT NULL DEFAULT 0,
  PRIMARY KEY (`issue_history_id`) USING BTREE,
  UNIQUE INDEX `issue_history_id`(`issue_history_id` ASC) USING BTREE,
  INDEX `user_id`(`user_id` ASC) USING BTREE,
  INDEX `item_id`(`item_id` ASC) USING BTREE,
  INDEX `campus_id`(`campus_id` ASC) USING BTREE,
  CONSTRAINT `issue_histories_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `issue_histories_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `issue_histories_ibfk_3` FOREIGN KEY (`campus_id`) REFERENCES `campuses` (`campus_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for items
-- ----------------------------
DROP TABLE IF EXISTS `items`;
CREATE TABLE `items`  (
  `item_id` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `building_id` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `floor_id` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `room_id` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `category_item_id` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `campus_id` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `item_name` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `item_description` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `item_code` varchar(64) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `item_condition` enum('Baik','Menunggu Diperbaiki','Diperbaiki','Rusak') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'Baik',
  `photo_1` varchar(155) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `photo_2` varchar(155) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `category_pln_pdam` int NOT NULL DEFAULT 0,
  `no_subcription` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `total` int NOT NULL,
  `brand` varchar(150) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `maintenance` enum('1 Minggu','2 Minggu','1 Bulan','3 Bulan','6 Bulan','1 Tahun') CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `maintenance_date` datetime NULL DEFAULT NULL,
  `pembelian` date NULL DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`item_id`) USING BTREE,
  UNIQUE INDEX `item_id`(`item_id` ASC) USING BTREE,
  INDEX `building_id`(`building_id` ASC) USING BTREE,
  INDEX `floor_id`(`floor_id` ASC) USING BTREE,
  INDEX `room_id`(`room_id` ASC) USING BTREE,
  INDEX `category_item_id`(`category_item_id` ASC) USING BTREE,
  INDEX `campus_id`(`campus_id` ASC) USING BTREE,
  CONSTRAINT `items_ibfk_1` FOREIGN KEY (`building_id`) REFERENCES `buildings` (`building_id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `items_ibfk_2` FOREIGN KEY (`floor_id`) REFERENCES `floors` (`floor_id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `items_ibfk_3` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `items_ibfk_4` FOREIGN KEY (`category_item_id`) REFERENCES `category_items` (`category_item_id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `items_ibfk_5` FOREIGN KEY (`campus_id`) REFERENCES `campuses` (`campus_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for leaves
-- ----------------------------
DROP TABLE IF EXISTS `leaves`;
CREATE TABLE `leaves`  (
  `leave_id` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `user_id` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `leave_type` enum('Cuti Tahunan','Cuti Sakit','Cuti Melahirkan','Cuti Khusus') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `reason` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `status` enum('Pending','Approved','Rejected') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'Pending',
  `approved_by` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `approved_at` datetime NULL DEFAULT NULL,
  `attachment` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`leave_id`) USING BTREE,
  UNIQUE INDEX `leave_id`(`leave_id` ASC) USING BTREE,
  INDEX `leaves_user_id`(`user_id` ASC) USING BTREE,
  INDEX `leaves_approved_by`(`approved_by` ASC) USING BTREE,
  CONSTRAINT `leaves_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `leaves_ibfk_2` FOREIGN KEY (`approved_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for notifications
-- ----------------------------
DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications`  (
  `notification_id` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `campus_id` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `notification_title` varchar(200) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `notification_description` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`notification_id`) USING BTREE,
  INDEX `campus_id`(`campus_id` ASC) USING BTREE,
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`campus_id`) REFERENCES `campuses` (`campus_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for push_notification_logs
-- ----------------------------
DROP TABLE IF EXISTS `push_notification_logs`;
CREATE TABLE `push_notification_logs`  (
  `log_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `target_type` enum('all','roles','units','users') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'all',
  `target_ids` json NULL,
  `sent_by` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `success_count` int NOT NULL DEFAULT 0,
  `failure_count` int NOT NULL DEFAULT 0,
  `total_recipients` int NOT NULL DEFAULT 0,
  `status` enum('pending','sent','failed','partial') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'pending',
  `error_message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `sent_at` datetime NULL DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`log_id`) USING BTREE,
  INDEX `push_notification_logs_sent_by`(`sent_by` ASC) USING BTREE,
  INDEX `push_notification_logs_target_type`(`target_type` ASC) USING BTREE,
  INDEX `push_notification_logs_status`(`status` ASC) USING BTREE,
  INDEX `push_notification_logs_created_at`(`createdAt` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for roles
-- ----------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles`  (
  `role_id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `description` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`role_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for rooms
-- ----------------------------
DROP TABLE IF EXISTS `rooms`;
CREATE TABLE `rooms`  (
  `room_id` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `floor_id` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `room_name` varchar(150) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `photo_1` varchar(155) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`room_id`) USING BTREE,
  UNIQUE INDEX `room_id`(`room_id` ASC) USING BTREE,
  INDEX `floor_id`(`floor_id` ASC) USING BTREE,
  CONSTRAINT `rooms_ibfk_1` FOREIGN KEY (`floor_id`) REFERENCES `floors` (`floor_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for sequelizemeta
-- ----------------------------
DROP TABLE IF EXISTS `sequelizemeta`;
CREATE TABLE `sequelizemeta`  (
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`) USING BTREE,
  UNIQUE INDEX `name`(`name` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for shifts
-- ----------------------------
DROP TABLE IF EXISTS `shifts`;
CREATE TABLE `shifts`  (
  `shift_id` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `name` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `timeStart` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `timeEnd` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`shift_id`) USING BTREE,
  UNIQUE INDEX `shift_id`(`shift_id` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for task_logs
-- ----------------------------
DROP TABLE IF EXISTS `task_logs`;
CREATE TABLE `task_logs`  (
  `task_log_id` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `user_id` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `activity_id` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `title` varchar(200) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `description` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `date` date NOT NULL,
  `duration` int NULL DEFAULT NULL COMMENT 'dalam menit',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`task_log_id`) USING BTREE,
  UNIQUE INDEX `task_log_id`(`task_log_id` ASC) USING BTREE,
  INDEX `task_logs_user_id`(`user_id` ASC) USING BTREE,
  INDEX `task_logs_activity_id`(`activity_id` ASC) USING BTREE,
  CONSTRAINT `task_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `task_logs_ibfk_2` FOREIGN KEY (`activity_id`) REFERENCES `activities` (`activity_id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for trainings
-- ----------------------------
DROP TABLE IF EXISTS `trainings`;
CREATE TABLE `trainings`  (
  `training_id` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `user_id` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `training_name` varchar(200) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `description` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `organizer` varchar(150) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `location` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `start_date` date NOT NULL,
  `end_date` date NULL DEFAULT NULL,
  `status` enum('Pending','Approved','Completed','Rejected') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'Pending',
  `certificate` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`training_id`) USING BTREE,
  UNIQUE INDEX `training_id`(`training_id` ASC) USING BTREE,
  INDEX `trainings_user_id`(`user_id` ASC) USING BTREE,
  CONSTRAINT `trainings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `user_id` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `campus_id` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `full_name` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `email` varchar(200) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `password` varchar(200) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `phone_number` varchar(15) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `role_id` int NOT NULL,
  `photo_1` varchar(155) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `is_active` int NOT NULL DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `longitude` decimal(18, 9) NULL DEFAULT NULL,
  `latitude` decimal(18, 9) NULL DEFAULT NULL,
  `address` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `position` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `fcm_token` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`) USING BTREE,
  UNIQUE INDEX `user_id`(`user_id` ASC) USING BTREE,
  UNIQUE INDEX `email`(`email` ASC) USING BTREE,
  INDEX `campus_id`(`campus_id` ASC) USING BTREE,
  INDEX `users_email`(`email` ASC) USING BTREE,
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`campus_id`) REFERENCES `campuses` (`campus_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = DYNAMIC;

SET FOREIGN_KEY_CHECKS = 1;
