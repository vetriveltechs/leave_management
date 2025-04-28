-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 28, 2025 at 11:51 AM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 7.4.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hostel_leave_management`
--

-- --------------------------------------------------------

--
-- Table structure for table `auth_group`
--

CREATE TABLE `auth_group` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `auth_group_permissions`
--

CREATE TABLE `auth_group_permissions` (
  `id` bigint(20) NOT NULL,
  `group_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `auth_permission`
--

CREATE TABLE `auth_permission` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `content_type_id` int(11) NOT NULL,
  `codename` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `auth_permission`
--

INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES
(1, 'Can add log entry', 1, 'add_logentry'),
(2, 'Can change log entry', 1, 'change_logentry'),
(3, 'Can delete log entry', 1, 'delete_logentry'),
(4, 'Can view log entry', 1, 'view_logentry'),
(5, 'Can add permission', 2, 'add_permission'),
(6, 'Can change permission', 2, 'change_permission'),
(7, 'Can delete permission', 2, 'delete_permission'),
(8, 'Can view permission', 2, 'view_permission'),
(9, 'Can add group', 3, 'add_group'),
(10, 'Can change group', 3, 'change_group'),
(11, 'Can delete group', 3, 'delete_group'),
(12, 'Can view group', 3, 'view_group'),
(13, 'Can add user', 4, 'add_user'),
(14, 'Can change user', 4, 'change_user'),
(15, 'Can delete user', 4, 'delete_user'),
(16, 'Can view user', 4, 'view_user'),
(17, 'Can add content type', 5, 'add_contenttype'),
(18, 'Can change content type', 5, 'change_contenttype'),
(19, 'Can delete content type', 5, 'delete_contenttype'),
(20, 'Can view content type', 5, 'view_contenttype'),
(21, 'Can add session', 6, 'add_session'),
(22, 'Can change session', 6, 'change_session'),
(23, 'Can delete session', 6, 'delete_session'),
(24, 'Can view session', 6, 'view_session'),
(25, 'Can add department', 7, 'add_department'),
(26, 'Can change department', 7, 'change_department'),
(27, 'Can delete department', 7, 'delete_department'),
(28, 'Can view department', 7, 'view_department'),
(29, 'Can add designation', 8, 'add_designation'),
(30, 'Can change designation', 8, 'change_designation'),
(31, 'Can delete designation', 8, 'delete_designation'),
(32, 'Can view designation', 8, 'view_designation');

-- --------------------------------------------------------

--
-- Table structure for table `auth_user`
--

CREATE TABLE `auth_user` (
  `id` int(11) NOT NULL,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `auth_user_groups`
--

CREATE TABLE `auth_user_groups` (
  `id` bigint(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `auth_user_user_permissions`
--

CREATE TABLE `auth_user_user_permissions` (
  `id` bigint(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `django_admin_log`
--

CREATE TABLE `django_admin_log` (
  `id` int(11) NOT NULL,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext DEFAULT NULL,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint(5) UNSIGNED NOT NULL CHECK (`action_flag` >= 0),
  `change_message` longtext NOT NULL,
  `content_type_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `django_content_type`
--

CREATE TABLE `django_content_type` (
  `id` int(11) NOT NULL,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `django_content_type`
--

INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES
(1, 'admin', 'logentry'),
(3, 'auth', 'group'),
(2, 'auth', 'permission'),
(4, 'auth', 'user'),
(5, 'contenttypes', 'contenttype'),
(7, 'hostel_leave_management', 'department'),
(8, 'hostel_leave_management', 'designation'),
(6, 'sessions', 'session');

-- --------------------------------------------------------

--
-- Table structure for table `django_migrations`
--

CREATE TABLE `django_migrations` (
  `id` bigint(20) NOT NULL,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `django_migrations`
--

INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES
(1, 'contenttypes', '0001_initial', '2025-04-23 05:15:54.863553'),
(2, 'auth', '0001_initial', '2025-04-23 05:15:55.362322'),
(3, 'admin', '0001_initial', '2025-04-23 05:15:55.508102'),
(4, 'admin', '0002_logentry_remove_auto_add', '2025-04-23 05:15:55.514181'),
(5, 'admin', '0003_logentry_add_action_flag_choices', '2025-04-23 05:15:55.521166'),
(6, 'contenttypes', '0002_remove_content_type_name', '2025-04-23 05:15:55.583010'),
(7, 'auth', '0002_alter_permission_name_max_length', '2025-04-23 05:15:55.611282'),
(8, 'auth', '0003_alter_user_email_max_length', '2025-04-23 05:15:55.626460'),
(9, 'auth', '0004_alter_user_username_opts', '2025-04-23 05:15:55.634132'),
(10, 'auth', '0005_alter_user_last_login_null', '2025-04-23 05:15:55.676217'),
(11, 'auth', '0006_require_contenttypes_0002', '2025-04-23 05:15:55.679215'),
(12, 'auth', '0007_alter_validators_add_error_messages', '2025-04-23 05:15:55.686223'),
(13, 'auth', '0008_alter_user_username_max_length', '2025-04-23 05:15:55.697674'),
(14, 'auth', '0009_alter_user_last_name_max_length', '2025-04-23 05:15:55.708672'),
(15, 'auth', '0010_alter_group_name_max_length', '2025-04-23 05:15:55.722644'),
(16, 'auth', '0011_update_proxy_permissions', '2025-04-23 05:15:55.729902'),
(17, 'auth', '0012_alter_user_first_name_max_length', '2025-04-23 05:15:55.743807'),
(18, 'hostel_leave_management', '0001_initial', '2025-04-23 05:15:55.764806'),
(19, 'sessions', '0001_initial', '2025-04-23 05:15:55.793399'),
(20, 'hostel_leave_management', '0002_designation', '2025-04-25 06:00:59.122446');

-- --------------------------------------------------------

--
-- Table structure for table `django_session`
--

CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `hostel_leave_management_department`
--

CREATE TABLE `hostel_leave_management_department` (
  `id` bigint(20) NOT NULL,
  `department_name` varchar(255) DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `active_flag` varchar(1) NOT NULL DEFAULT 'Y',
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime(6) DEFAULT NULL,
  `last_updated_by` int(11) DEFAULT NULL,
  `last_updated_date` datetime(6) DEFAULT NULL,
  `inactive_date` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `hostel_leave_management_department`
--

INSERT INTO `hostel_leave_management_department` (`id`, `department_name`, `description`, `active_flag`, `created_by`, `created_date`, `last_updated_by`, `last_updated_date`, `inactive_date`) VALUES
(1, 'B.E Civil Engineering', 'Specializes in designing, constructing, and maintaining infrastructure like bridges, roads, buildings, and dams.', 'Y', NULL, NULL, NULL, NULL, NULL),
(2, 'Chemical Engineering', 'Combines chemistry, physics, and biology to develop processes for manufacturing chemicals, fuels, foods, and pharmaceuticals.', 'Y', NULL, NULL, NULL, NULL, NULL),
(3, 'Computer Science and Engineering', 'Focuses on computing theory, programming, software development, artificial intelligence, and computer systems.', 'Y', NULL, NULL, NULL, NULL, NULL),
(4, 'Mechanical Engineering', 'Deals with the design, manufacturing, and maintenance of mechanical systems, machines, and engines.', 'Y', NULL, NULL, NULL, NULL, NULL),
(5, 'Electrical and Electronics Engineering', 'Covers electricity, electronics, electromagnetism, circuit design, and power generation technologies.', 'Y', NULL, NULL, NULL, NULL, NULL),
(6, 'Aerospace Engineering', 'Focuses on the design, development, and production of aircraft, spacecraft, and related systems and technologies.', 'Y', NULL, NULL, NULL, NULL, NULL),
(7, 'Industrial Engineering', 'Involves optimizing complex processes, systems, and organizations by integrating people, materials, and technology.', 'Y', NULL, NULL, NULL, NULL, NULL),
(8, 'Environmental Engineering', 'Specializes in developing technologies and processes to protect and improve the environment, including waste management and pollution control.', 'Y', NULL, NULL, NULL, NULL, NULL),
(9, 'Biomedical Engineering', 'Combines principles of engineering with biological and medical sciences to develop technologies for healthcare applications, such as medical devices and prosthetics.', 'Y', NULL, NULL, NULL, NULL, NULL),
(10, 'Robotics Engineering', 'Focuses on the design, construction, and operation of robots, combining fields like mechanical, electrical, and software engineering.', 'Y', NULL, NULL, NULL, NULL, NULL),
(11, 'Nuclear Engineering', 'Involves the design and application of nuclear reactors, radiation, and the management of nuclear materials and energy.', 'Y', NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `hostel_leave_management_designation`
--

CREATE TABLE `hostel_leave_management_designation` (
  `id` bigint(20) NOT NULL,
  `designation_name` varchar(255) DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `active_flag` varchar(1) NOT NULL,
  `inactive_date` datetime(6) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime(6) DEFAULT NULL,
  `last_updated_by` int(11) DEFAULT NULL,
  `last_updated_date` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `sm_list_types`
--

CREATE TABLE `sm_list_types` (
  `list_type_id` int(11) NOT NULL,
  `list_name` varchar(255) DEFAULT NULL,
  `list_description` text DEFAULT NULL,
  `list_type_status` int(11) DEFAULT NULL,
  `active_flag` varchar(1) NOT NULL DEFAULT 'Y',
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `deleted_flag` varchar(1) DEFAULT 'N',
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `last_updated_by` int(11) DEFAULT NULL,
  `last_updated_date` datetime DEFAULT NULL,
  `attribute1` varchar(150) DEFAULT NULL,
  `attribute2` varchar(150) DEFAULT NULL,
  `attribute3` varchar(150) DEFAULT NULL,
  `attribute4` varchar(150) DEFAULT NULL,
  `attribute5` varchar(150) DEFAULT NULL,
  `attribute6` varchar(150) DEFAULT NULL,
  `attribute7` varchar(150) DEFAULT NULL,
  `attribute8` varchar(150) DEFAULT NULL,
  `attribute9` varchar(150) DEFAULT NULL,
  `attribute10` varchar(150) DEFAULT NULL,
  `attribute_date1` date DEFAULT NULL,
  `attribute_date2` date DEFAULT NULL,
  `attribute_date3` date DEFAULT NULL,
  `attribute_date4` date DEFAULT NULL,
  `attribute_date5` date DEFAULT NULL,
  `attribute_number1` int(11) DEFAULT NULL,
  `attribute_number2` int(11) DEFAULT NULL,
  `attribute_number3` int(11) DEFAULT NULL,
  `attribute_number4` int(11) DEFAULT NULL,
  `attribute_number5` int(11) DEFAULT NULL,
  `inactive_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `sm_list_types`
--

INSERT INTO `sm_list_types` (`list_type_id`, `list_name`, `list_description`, `list_type_status`, `active_flag`, `start_date`, `end_date`, `deleted_flag`, `created_by`, `created_date`, `last_updated_by`, `last_updated_date`, `attribute1`, `attribute2`, `attribute3`, `attribute4`, `attribute5`, `attribute6`, `attribute7`, `attribute8`, `attribute9`, `attribute10`, `attribute_date1`, `attribute_date2`, `attribute_date3`, `attribute_date4`, `attribute_date5`, `attribute_number1`, `attribute_number2`, `attribute_number3`, `attribute_number4`, `attribute_number5`, `inactive_date`) VALUES
(1, 'ACTIVESTATUS', 'Activestatus', NULL, 'Y', '2025-03-26', NULL, 'N', 1, '2025-03-26 21:12:41', 1, '2025-03-26 21:12:41', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2, 'USERTYPE', 'Usertype', NULL, 'Y', '2025-03-26', NULL, 'N', 1, '2025-03-26 21:24:48', 1, '2025-03-26 21:24:48', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, 'LEAVE-APPROVED-STATUS', 'Leave Approved Status', NULL, 'Y', '2025-03-26', NULL, 'N', 1, '2025-03-26 23:13:45', 1, '2025-03-26 23:13:45', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(4, 'ACADEMIC-YEAR', 'Academic Year', NULL, 'Y', '2025-03-27', NULL, 'N', 1, '2025-03-27 06:48:50', 1, '2025-03-27 06:48:50', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(5, 'MODULES', 'Modules', NULL, 'Y', '2025-03-27', NULL, 'N', 1, '2025-03-27 06:55:07', 1, '2025-03-27 06:56:23', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(6, 'POSITION', 'Position', NULL, 'Y', '2025-03-27', NULL, 'N', 1, '2025-03-27 10:08:30', 1, '2025-03-27 10:08:30', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sm_list_type_values`
--

CREATE TABLE `sm_list_type_values` (
  `list_type_value_id` int(11) NOT NULL,
  `list_type_id` int(11) NOT NULL COMMENT 'Foreign Key',
  `list_code` varchar(150) DEFAULT NULL,
  `list_value` varchar(150) DEFAULT NULL,
  `order_sequence` int(11) DEFAULT NULL,
  `short_description` text DEFAULT NULL,
  `list_type_status` int(11) DEFAULT NULL,
  `active_flag` varchar(1) NOT NULL DEFAULT 'Y',
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `deleted_flag` varchar(1) DEFAULT 'N',
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `last_updated_by` int(11) DEFAULT NULL,
  `last_updated_date` datetime DEFAULT NULL,
  `attribute1` varchar(150) DEFAULT NULL,
  `attribute2` varchar(150) DEFAULT NULL,
  `attribute3` varchar(150) DEFAULT NULL,
  `attribute4` varchar(150) DEFAULT NULL,
  `attribute5` varchar(150) DEFAULT NULL,
  `attribute6` varchar(150) DEFAULT NULL,
  `attribute7` varchar(150) DEFAULT NULL,
  `attribute8` varchar(150) DEFAULT NULL,
  `attribute9` varchar(150) DEFAULT NULL,
  `attribute10` varchar(150) DEFAULT NULL,
  `attribute_date1` date DEFAULT NULL,
  `attribute_date2` date DEFAULT NULL,
  `attribute_date3` date DEFAULT NULL,
  `attribute_date4` date DEFAULT NULL,
  `attribute_date5` date DEFAULT NULL,
  `attribute_number1` int(11) DEFAULT NULL,
  `attribute_number2` int(11) DEFAULT NULL,
  `attribute_number3` int(11) DEFAULT NULL,
  `attribute_number4` int(11) DEFAULT NULL,
  `attribute_number5` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `sm_list_type_values`
--

INSERT INTO `sm_list_type_values` (`list_type_value_id`, `list_type_id`, `list_code`, `list_value`, `order_sequence`, `short_description`, `list_type_status`, `active_flag`, `start_date`, `end_date`, `deleted_flag`, `created_by`, `created_date`, `last_updated_by`, `last_updated_date`, `attribute1`, `attribute2`, `attribute3`, `attribute4`, `attribute5`, `attribute6`, `attribute7`, `attribute8`, `attribute9`, `attribute10`, `attribute_date1`, `attribute_date2`, `attribute_date3`, `attribute_date4`, `attribute_date5`, `attribute_number1`, `attribute_number2`, `attribute_number3`, `attribute_number4`, `attribute_number5`) VALUES
(1, 1, 'Y', 'Active', 1, '', NULL, 'Y', '2025-03-26', NULL, 'N', 1, '2025-03-26 21:12:56', 1, '2025-03-26 21:12:56', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2, 1, 'N', 'Inactive', 2, '', NULL, 'Y', '2025-03-26', NULL, 'N', 1, '2025-03-26 21:13:08', 1, '2025-03-26 21:13:08', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, 1, 'ALL', 'All', 3, '', NULL, 'Y', '2025-03-26', NULL, 'N', 1, '2025-03-26 21:13:23', 1, '2025-03-26 21:13:23', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(4, 2, 'STUDENT', 'Student', 1, '', NULL, 'Y', '2025-03-26', NULL, 'N', 1, '2025-03-26 21:24:58', 1, '2025-03-27 10:34:08', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(5, 3, 'PENDING', 'Pending', 1, '', NULL, 'Y', '2025-03-26', NULL, 'N', 1, '2025-03-26 23:13:56', 1, '2025-03-26 23:13:56', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(6, 3, 'IN-PROGRESS', 'In Progress', 2, '', NULL, 'Y', '2025-03-26', NULL, 'N', 1, '2025-03-26 23:14:08', 1, '2025-03-26 23:14:08', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(7, 3, 'APPROVED', 'Approved', 3, '', NULL, 'Y', '2025-03-26', NULL, 'N', 1, '2025-03-26 23:14:19', 1, '2025-03-26 23:14:19', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(8, 4, 'I-YEAR', 'I Year', 1, '', NULL, 'Y', '2025-03-27', NULL, 'N', 1, '2025-03-27 06:49:01', 1, '2025-03-27 06:49:53', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(9, 4, 'II-YEAR', 'II Year', 2, '', NULL, 'Y', '2025-03-27', NULL, 'N', 1, '2025-03-27 06:49:11', 1, '2025-03-27 06:49:44', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(10, 4, 'III-YEAR', 'III Year', 3, '', NULL, 'Y', '2025-03-27', NULL, 'N', 1, '2025-03-27 06:49:31', 1, '2025-03-27 06:49:31', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(11, 5, 'STUDENT', 'Student', 1, '', NULL, 'Y', '2025-03-27', NULL, 'N', 1, '2025-03-27 06:55:24', 1, '2025-03-27 06:55:24', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(12, 5, 'STAFF', 'Staff', 2, '', NULL, 'Y', '2025-03-27', NULL, 'N', 1, '2025-03-27 06:55:43', 1, '2025-03-27 06:55:43', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(13, 6, 'CA', 'CA', 1, '', NULL, 'Y', '2025-03-27', NULL, 'N', 1, '2025-03-27 10:08:38', 1, '2025-03-27 10:08:38', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(14, 6, 'HOD', 'HOD', 2, '', NULL, 'Y', '2025-03-27', NULL, 'N', 1, '2025-03-27 10:08:45', 1, '2025-03-27 10:09:06', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(15, 6, 'WARDEN', 'WARDEN', 3, '', NULL, 'Y', '2025-03-27', NULL, 'N', 1, '2025-03-27 10:09:00', 1, '2025-03-27 10:09:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(16, 2, 'STAFF', 'Staff', 2, '', NULL, 'Y', '2025-03-27', NULL, 'N', 1, '2025-03-27 10:36:17', 1, '2025-03-27 10:36:17', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `auth_group`
--
ALTER TABLE `auth_group`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  ADD KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`);

--
-- Indexes for table `auth_permission`
--
ALTER TABLE `auth_permission`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`);

--
-- Indexes for table `auth_user`
--
ALTER TABLE `auth_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `auth_user_groups`
--
ALTER TABLE `auth_user_groups`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  ADD KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`);

--
-- Indexes for table `auth_user_user_permissions`
--
ALTER TABLE `auth_user_user_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  ADD KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`);

--
-- Indexes for table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  ADD KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`);

--
-- Indexes for table `django_content_type`
--
ALTER TABLE `django_content_type`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`);

--
-- Indexes for table `django_migrations`
--
ALTER TABLE `django_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `django_session`
--
ALTER TABLE `django_session`
  ADD PRIMARY KEY (`session_key`),
  ADD KEY `django_session_expire_date_a5c62663` (`expire_date`);

--
-- Indexes for table `hostel_leave_management_department`
--
ALTER TABLE `hostel_leave_management_department`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `hostel_leave_management_designation`
--
ALTER TABLE `hostel_leave_management_designation`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sm_list_types`
--
ALTER TABLE `sm_list_types`
  ADD PRIMARY KEY (`list_type_id`),
  ADD KEY `list_type_id` (`list_type_id`,`active_flag`,`created_by`,`created_date`,`last_updated_by`,`last_updated_date`),
  ADD KEY `list_name` (`list_name`(191),`list_type_status`,`active_flag`,`start_date`,`end_date`,`deleted_flag`,`created_by`,`created_date`,`last_updated_by`,`last_updated_date`,`inactive_date`);

--
-- Indexes for table `sm_list_type_values`
--
ALTER TABLE `sm_list_type_values`
  ADD PRIMARY KEY (`list_type_value_id`),
  ADD KEY `list_type_value_id` (`list_type_value_id`),
  ADD KEY `list_type_id` (`list_type_id`,`active_flag`,`created_by`,`created_date`,`last_updated_by`,`last_updated_date`),
  ADD KEY `list_type_id_2` (`list_type_id`,`list_code`,`list_value`,`order_sequence`,`list_type_status`,`active_flag`,`start_date`,`end_date`,`deleted_flag`,`created_by`,`created_date`,`last_updated_by`,`last_updated_date`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `auth_group`
--
ALTER TABLE `auth_group`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auth_permission`
--
ALTER TABLE `auth_permission`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `auth_user`
--
ALTER TABLE `auth_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auth_user_groups`
--
ALTER TABLE `auth_user_groups`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auth_user_user_permissions`
--
ALTER TABLE `auth_user_user_permissions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `django_content_type`
--
ALTER TABLE `django_content_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `django_migrations`
--
ALTER TABLE `django_migrations`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `hostel_leave_management_department`
--
ALTER TABLE `hostel_leave_management_department`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `hostel_leave_management_designation`
--
ALTER TABLE `hostel_leave_management_designation`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sm_list_types`
--
ALTER TABLE `sm_list_types`
  MODIFY `list_type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `sm_list_type_values`
--
ALTER TABLE `sm_list_type_values`
  MODIFY `list_type_value_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  ADD CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  ADD CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`);

--
-- Constraints for table `auth_permission`
--
ALTER TABLE `auth_permission`
  ADD CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`);

--
-- Constraints for table `auth_user_groups`
--
ALTER TABLE `auth_user_groups`
  ADD CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  ADD CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Constraints for table `auth_user_user_permissions`
--
ALTER TABLE `auth_user_user_permissions`
  ADD CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  ADD CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Constraints for table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  ADD CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  ADD CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
