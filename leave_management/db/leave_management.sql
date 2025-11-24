-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 24, 2025 at 07:17 AM
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
-- Database: `leave_management`
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
(25, 'Can add blood group', 7, 'add_bloodgroup'),
(26, 'Can change blood group', 7, 'change_bloodgroup'),
(27, 'Can delete blood group', 7, 'delete_bloodgroup'),
(28, 'Can view blood group', 7, 'view_bloodgroup'),
(29, 'Can add country', 8, 'add_country'),
(30, 'Can change country', 8, 'change_country'),
(31, 'Can delete country', 8, 'delete_country'),
(32, 'Can view country', 8, 'view_country'),
(33, 'Can add department', 9, 'add_department'),
(34, 'Can change department', 9, 'change_department'),
(35, 'Can delete department', 9, 'delete_department'),
(36, 'Can view department', 9, 'view_department'),
(37, 'Can add designation', 10, 'add_designation'),
(38, 'Can change designation', 10, 'change_designation'),
(39, 'Can delete designation', 10, 'delete_designation'),
(40, 'Can view designation', 10, 'view_designation'),
(41, 'Can add lov', 11, 'add_lov'),
(42, 'Can change lov', 11, 'change_lov'),
(43, 'Can delete lov', 11, 'delete_lov'),
(44, 'Can view lov', 11, 'view_lov'),
(45, 'Can add projects header', 12, 'add_projectsheader'),
(46, 'Can change projects header', 12, 'change_projectsheader'),
(47, 'Can delete projects header', 12, 'delete_projectsheader'),
(48, 'Can view projects header', 12, 'view_projectsheader'),
(49, 'Can add roles', 13, 'add_roles'),
(50, 'Can change roles', 13, 'change_roles'),
(51, 'Can delete roles', 13, 'delete_roles'),
(52, 'Can view roles', 13, 'view_roles'),
(53, 'Can add city', 14, 'add_city'),
(54, 'Can change city', 14, 'change_city'),
(55, 'Can delete city', 14, 'delete_city'),
(56, 'Can view city', 14, 'view_city'),
(57, 'Can add list type values', 15, 'add_listtypevalues'),
(58, 'Can change list type values', 15, 'change_listtypevalues'),
(59, 'Can delete list type values', 15, 'delete_listtypevalues'),
(60, 'Can view list type values', 15, 'view_listtypevalues'),
(61, 'Can add projects line', 16, 'add_projectsline'),
(62, 'Can change projects line', 16, 'change_projectsline'),
(63, 'Can delete projects line', 16, 'delete_projectsline'),
(64, 'Can view projects line', 16, 'view_projectsline'),
(65, 'Can add state', 17, 'add_state'),
(66, 'Can change state', 17, 'change_state'),
(67, 'Can delete state', 17, 'delete_state'),
(68, 'Can view state', 17, 'view_state'),
(69, 'Can add location', 18, 'add_location'),
(70, 'Can change location', 18, 'change_location'),
(71, 'Can delete location', 18, 'delete_location'),
(72, 'Can view location', 18, 'view_location'),
(73, 'Can add employees', 19, 'add_employees'),
(74, 'Can change employees', 19, 'change_employees'),
(75, 'Can delete employees', 19, 'delete_employees'),
(76, 'Can view employees', 19, 'view_employees'),
(77, 'Can add user headers', 20, 'add_userheaders'),
(78, 'Can change user headers', 20, 'change_userheaders'),
(79, 'Can delete user headers', 20, 'delete_userheaders'),
(80, 'Can view user headers', 20, 'view_userheaders'),
(81, 'Can add user lines', 21, 'add_userlines'),
(82, 'Can change user lines', 21, 'change_userlines'),
(83, 'Can delete user lines', 21, 'delete_userlines'),
(84, 'Can view user lines', 21, 'view_userlines'),
(85, 'Can add user profile', 22, 'add_userprofile'),
(86, 'Can change user profile', 22, 'change_userprofile'),
(87, 'Can delete user profile', 22, 'delete_userprofile'),
(88, 'Can view user profile', 22, 'view_userprofile'),
(89, 'Can add user line', 23, 'add_userline'),
(90, 'Can change user line', 23, 'change_userline'),
(91, 'Can delete user line', 23, 'delete_userline'),
(92, 'Can view user line', 23, 'view_userline');

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

--
-- Dumping data for table `auth_user`
--

INSERT INTO `auth_user` (`id`, `password`, `last_login`, `is_superuser`, `username`, `first_name`, `last_name`, `email`, `is_staff`, `is_active`, `date_joined`) VALUES
(1, 'pbkdf2_sha256$720000$VtyrGpzIeMm5jApF6gfaeg$D4FegxIqLW/J77/oF9F4aC4PTeD0SAuuUa6q5FKjn5Q=', '2025-11-23 07:47:08.993180', 0, 'vetriveltechs@gmail.com', '', '', 'vetriveltechs@gmail.com', 0, 1, '2025-11-17 16:10:41.283224'),
(3, 'pbkdf2_sha256$720000$uTaGHEGDqhpp9GDMzTq55F$DIaWcQ5TLfiThhsH4Fy90srqK1Gtxn/8kmxWGPfkEx0=', '2025-11-23 07:47:47.060145', 0, 'Hasain', '', '', '', 0, 1, '2025-11-18 02:18:21.557907'),
(4, 'pbkdf2_sha256$720000$2QR0fBEksx1St7CGVcrwOD$0ZnPfmQf0Iy83ZpgMj18SahLNjNGaqkMasdM43dZZtk=', NULL, 0, 'dhanush', '', '', 'dhanush@gmail.com', 0, 1, '2025-11-18 02:20:19.383089'),
(5, 'pbkdf2_sha256$720000$vIg4KOeEZhM2PjwQlaaTpD$eVrgFl4Tlimm/01gpvwJchMwxXfHmaMS+sB1YPIbg6E=', '2025-11-23 07:47:36.122467', 0, 'mani@gmail.com', '', '', 'mani@gmail.com', 0, 1, '2025-11-23 07:46:43.119857');

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
-- Table structure for table `blood_groups`
--

CREATE TABLE `blood_groups` (
  `id` bigint(20) NOT NULL,
  `blood_group_name` varchar(100) NOT NULL,
  `description` longtext DEFAULT NULL,
  `active_flag` varchar(1) NOT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `created_date` datetime(6) NOT NULL,
  `last_updated_by` varchar(50) DEFAULT NULL,
  `last_updated_date` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `blood_groups`
--

INSERT INTO `blood_groups` (`id`, `blood_group_name`, `description`, `active_flag`, `created_by`, `created_date`, `last_updated_by`, `last_updated_date`) VALUES
(1, 'AB +', '', 'Y', NULL, '2025-11-04 16:03:02.908050', NULL, '2025-11-14 00:51:59.757470');

-- --------------------------------------------------------

--
-- Table structure for table `cities`
--

CREATE TABLE `cities` (
  `id` bigint(20) NOT NULL,
  `city_name` varchar(100) NOT NULL,
  `description` longtext DEFAULT NULL,
  `active_flag` varchar(1) NOT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `created_date` datetime(6) NOT NULL,
  `last_updated_by` varchar(50) DEFAULT NULL,
  `last_updated_date` datetime(6) NOT NULL,
  `country_id` bigint(20) NOT NULL,
  `state_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `cities`
--

INSERT INTO `cities` (`id`, `city_name`, `description`, `active_flag`, `created_by`, `created_date`, `last_updated_by`, `last_updated_date`, `country_id`, `state_id`) VALUES
(1, 'Hosur', '', 'Y', NULL, '2025-11-04 16:01:57.146664', NULL, '2025-11-04 16:01:57.146664', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `countries`
--

CREATE TABLE `countries` (
  `id` bigint(20) NOT NULL,
  `country_name` varchar(100) NOT NULL,
  `country_code` varchar(10) NOT NULL,
  `currency_symbol` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `currency_code` varchar(10) NOT NULL,
  `country_flag` varchar(100) DEFAULT NULL,
  `active_flag` varchar(1) NOT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `created_date` datetime(6) NOT NULL,
  `last_updated_by` varchar(50) DEFAULT NULL,
  `last_updated_date` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `countries`
--

INSERT INTO `countries` (`id`, `country_name`, `country_code`, `currency_symbol`, `currency_code`, `country_flag`, `active_flag`, `created_by`, `created_date`, `last_updated_by`, `last_updated_date`) VALUES
(1, 'India', '+91', '₹', 'INR', 'temp_cYX6LMp.png', 'Y', NULL, '2025-11-04 16:00:52.763477', NULL, '2025-11-17 11:55:28.589118');

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `id` bigint(20) NOT NULL,
  `department_name` varchar(100) NOT NULL,
  `description` longtext DEFAULT NULL,
  `active_flag` varchar(1) NOT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `created_date` datetime(6) NOT NULL,
  `last_updated_by` varchar(50) DEFAULT NULL,
  `last_updated_date` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `department_name`, `description`, `active_flag`, `created_by`, `created_date`, `last_updated_by`, `last_updated_date`) VALUES
(1, 'IT', '', 'Y', NULL, '2025-11-05 00:39:43.518004', NULL, '2025-11-14 00:23:38.987461');

-- --------------------------------------------------------

--
-- Table structure for table `designations`
--

CREATE TABLE `designations` (
  `designation_id` int(11) NOT NULL,
  `designation_name` varchar(255) DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `active_flag` varchar(1) NOT NULL,
  `inactive_date` datetime(6) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime(6) NOT NULL,
  `last_updated_by` int(11) DEFAULT NULL,
  `last_updated_date` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `designations`
--

INSERT INTO `designations` (`designation_id`, `designation_name`, `description`, `active_flag`, `inactive_date`, `created_by`, `created_date`, `last_updated_by`, `last_updated_date`) VALUES
(1, 'Employee', '', 'Y', NULL, NULL, '2025-11-04 16:03:17.955239', NULL, '2025-11-14 00:23:24.026145');

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
(7, 'hostel_leave_management', 'bloodgroup'),
(14, 'hostel_leave_management', 'city'),
(8, 'hostel_leave_management', 'country'),
(9, 'hostel_leave_management', 'department'),
(10, 'hostel_leave_management', 'designation'),
(19, 'hostel_leave_management', 'employees'),
(15, 'hostel_leave_management', 'listtypevalues'),
(18, 'hostel_leave_management', 'location'),
(11, 'hostel_leave_management', 'lov'),
(12, 'hostel_leave_management', 'projectsheader'),
(16, 'hostel_leave_management', 'projectsline'),
(13, 'hostel_leave_management', 'roles'),
(17, 'hostel_leave_management', 'state'),
(20, 'hostel_leave_management', 'userheaders'),
(23, 'hostel_leave_management', 'userline'),
(21, 'hostel_leave_management', 'userlines'),
(22, 'hostel_leave_management', 'userprofile'),
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
(1, 'contenttypes', '0001_initial', '2025-11-02 10:38:15.422677'),
(2, 'auth', '0001_initial', '2025-11-02 10:38:15.869366'),
(3, 'admin', '0001_initial', '2025-11-02 10:38:15.968701'),
(4, 'admin', '0002_logentry_remove_auto_add', '2025-11-02 10:38:15.974711'),
(5, 'admin', '0003_logentry_add_action_flag_choices', '2025-11-02 10:38:15.980716'),
(6, 'contenttypes', '0002_remove_content_type_name', '2025-11-02 10:38:16.026838'),
(7, 'auth', '0002_alter_permission_name_max_length', '2025-11-02 10:38:16.051213'),
(8, 'auth', '0003_alter_user_email_max_length', '2025-11-02 10:38:16.063498'),
(9, 'auth', '0004_alter_user_username_opts', '2025-11-02 10:38:16.069060'),
(10, 'auth', '0005_alter_user_last_login_null', '2025-11-02 10:38:16.112204'),
(11, 'auth', '0006_require_contenttypes_0002', '2025-11-02 10:38:16.113586'),
(12, 'auth', '0007_alter_validators_add_error_messages', '2025-11-02 10:38:16.119086'),
(13, 'auth', '0008_alter_user_username_max_length', '2025-11-02 10:38:16.129781'),
(14, 'auth', '0009_alter_user_last_name_max_length', '2025-11-02 10:38:16.139347'),
(15, 'auth', '0010_alter_group_name_max_length', '2025-11-02 10:38:16.151049'),
(16, 'auth', '0011_update_proxy_permissions', '2025-11-02 10:38:16.158236'),
(17, 'auth', '0012_alter_user_first_name_max_length', '2025-11-02 10:38:16.164412'),
(18, 'hostel_leave_management', '0001_initial', '2025-11-02 10:38:17.484525'),
(19, 'sessions', '0001_initial', '2025-11-02 10:38:17.523549'),
(20, 'hostel_leave_management', '0002_alter_employees_active_flag_and_more', '2025-11-04 16:36:27.597935'),
(21, 'hostel_leave_management', '0003_alter_employees_blood_group_and_more', '2025-11-05 00:29:19.445814'),
(22, 'hostel_leave_management', '0004_alter_employees_department_and_more', '2025-11-05 01:49:45.721708'),
(23, 'hostel_leave_management', '0005_alter_employees_previous_experience', '2025-11-06 01:17:34.867906'),
(24, 'hostel_leave_management', '0006_userheaders_userlines', '2025-11-14 01:40:34.903824'),
(25, 'hostel_leave_management', '0007_remove_userheaders_employee_id_and_more', '2025-11-14 02:08:30.931183'),
(26, 'hostel_leave_management', '0008_remove_userlines_header_remove_userlines_role_and_more', '2025-11-17 16:00:03.386793'),
(27, 'hostel_leave_management', '0009_alter_userline_options_alter_userprofile_options_and_more', '2025-11-17 16:01:41.314361');

-- --------------------------------------------------------

--
-- Table structure for table `django_session`
--

CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `django_session`
--

INSERT INTO `django_session` (`session_key`, `session_data`, `expire_date`) VALUES
('ht2qszfb5pib9lmehklo8mbt2wzm2rid', '.eJxVjEsOAiEQBe_C2hA-w0C7dO8ZSEM3Mmogmc_KeHedZBa6fVX1XiLitta4LTzHicRZGHH63RLmB7cd0B3brcvc2zpPSe6KPOgir534eTncv4OKS_3WCnUGHsh6oJEZU4JBleKLHTAFBdrlkb0uISARgEdLyZlgCIKy2QXx_gACJzhN:1vLBBV:Xa5d_G8w8q8hZIPsyndiNd54WpK_7Ou5f74Okul3Al8', '2025-12-02 02:11:09.377580'),
('w8gtiwc49o9gbb270r3rqbrxq77cikwt', '.eJxVjssOgyAQRf-FtTEIiOiyq278gqYxA4yP1kIiujL-e321aXc3d86cmZlUMI1tNQUcqs6SgnAS_XYazBPdNrAPcI2PjXfj0Ol4Q-JzGuLSW-wvJ_snaCG063ZNa8WVEYpmvMZEyVyhTa1k0uSSA8Mcco2YCAFac2qzJGU1S6mgQqRKbNLeNw3a3UqKmXxf5tGRHbxwvXSFAJ1b-cH3GEhxm_e0o8nRftASHDSrbbkvyxtfZFeG:1vN4p1:t6B1FksHnWq32ERFc6pLOa5kthk_7XS7Mg_2Hr8T48U', '2025-12-07 07:47:47.065656');

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` bigint(20) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `middle_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `mobile_number` varchar(20) DEFAULT NULL,
  `alt_mobile_number` varchar(20) DEFAULT NULL,
  `email` varchar(254) DEFAULT NULL,
  `alt_email` varchar(254) DEFAULT NULL,
  `father_name` varchar(100) DEFAULT NULL,
  `mother_name` varchar(100) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `profile_image` varchar(100) DEFAULT NULL,
  `date_of_joining` date DEFAULT NULL,
  `date_of_releaving` date DEFAULT NULL,
  `previous_experience` int(11) DEFAULT NULL,
  `rate_per_hour` decimal(10,2) DEFAULT NULL,
  `rate_per_day` decimal(10,2) DEFAULT NULL,
  `aadhar_no` varchar(30) DEFAULT NULL,
  `pan_number` varchar(30) DEFAULT NULL,
  `driving_licence` varchar(50) DEFAULT NULL,
  `passport_no` varchar(30) DEFAULT NULL,
  `passport_issue_date` date DEFAULT NULL,
  `passport_expiry_date` date DEFAULT NULL,
  `pf_no` varchar(50) DEFAULT NULL,
  `esi_no` varchar(50) DEFAULT NULL,
  `uan_no` varchar(50) DEFAULT NULL,
  `current_address1` varchar(255) DEFAULT NULL,
  `current_address2` varchar(255) DEFAULT NULL,
  `current_address3` varchar(255) DEFAULT NULL,
  `current_postal_code` varchar(20) DEFAULT NULL,
  `permanent_address1` varchar(255) DEFAULT NULL,
  `permanent_address2` varchar(255) DEFAULT NULL,
  `permanent_address3` varchar(255) DEFAULT NULL,
  `permanent_postal_code` varchar(20) DEFAULT NULL,
  `account_number` varchar(50) DEFAULT NULL,
  `account_holder_name` varchar(150) DEFAULT NULL,
  `bank_name` varchar(150) DEFAULT NULL,
  `bank_branch` varchar(150) DEFAULT NULL,
  `ifsc_code` varchar(15) DEFAULT NULL,
  `micr_code` varchar(15) DEFAULT NULL,
  `bank_address` longtext DEFAULT NULL,
  `active_flag` varchar(1) NOT NULL,
  `created_date` datetime(6) NOT NULL,
  `last_updated_date` datetime(6) NOT NULL,
  `blood_group_id` int(11) DEFAULT NULL,
  `current_city_id` bigint(20) DEFAULT NULL,
  `current_country_id` bigint(20) DEFAULT NULL,
  `department_id` bigint(20) DEFAULT NULL,
  `designation_id` int(11) DEFAULT NULL,
  `permanent_city_id` bigint(20) DEFAULT NULL,
  `permanent_country_id` bigint(20) DEFAULT NULL,
  `employment_type_id` int(11) DEFAULT NULL,
  `gender_id` int(11) DEFAULT NULL,
  `pay_frequency_id` int(11) DEFAULT NULL,
  `location_id` bigint(20) DEFAULT NULL,
  `current_state_id` bigint(20) DEFAULT NULL,
  `permanent_state_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `first_name`, `middle_name`, `last_name`, `mobile_number`, `alt_mobile_number`, `email`, `alt_email`, `father_name`, `mother_name`, `date_of_birth`, `profile_image`, `date_of_joining`, `date_of_releaving`, `previous_experience`, `rate_per_hour`, `rate_per_day`, `aadhar_no`, `pan_number`, `driving_licence`, `passport_no`, `passport_issue_date`, `passport_expiry_date`, `pf_no`, `esi_no`, `uan_no`, `current_address1`, `current_address2`, `current_address3`, `current_postal_code`, `permanent_address1`, `permanent_address2`, `permanent_address3`, `permanent_postal_code`, `account_number`, `account_holder_name`, `bank_name`, `bank_branch`, `ifsc_code`, `micr_code`, `bank_address`, `active_flag`, `created_date`, `last_updated_date`, `blood_group_id`, `current_city_id`, `current_country_id`, `department_id`, `designation_id`, `permanent_city_id`, `permanent_country_id`, `employment_type_id`, `gender_id`, `pay_frequency_id`, `location_id`, `current_state_id`, `permanent_state_id`) VALUES
(1, 'vetrivel', 'M', 'M', '06380394289', '9087334690', 'vetriveltech@gmail.com', 'vetriveltech@gmail.com', NULL, NULL, '2025-11-03', '', '2025-11-03', '2025-11-04', 3, '80.00', '800.00', '12525656665', '262626', 'TN1255', 'A!(@@wfe', '2025-11-02', '2025-11-03', '97989898', '8489618741', '123456', '1/209 Tank Street', 'JR Plaza', 'Hosur', '636135', '1/209 Tank Street', 'JR Plaza', 'Hosur', '636135', '848561', '8456132', '74512', '784512', 'IFSC4596', 'MICR774851', '1/209 Tank Street\nJR Plaza\nHosur', 'Y', '2025-11-05 01:50:18.058485', '2025-11-05 04:23:43.078799', 1, 1, 1, 1, 1, NULL, 1, 4, 6, 8, 1, 1, 1),
(2, 'Hasain', '', '', '9965650079', '', 'hasain@gmail.com', '', NULL, NULL, '2025-11-05', '', '2025-11-05', '2025-11-05', 5, '400.00', '400.00', '12525656665', '262626', 'TN1255', 'A!(@@wfe', '2025-11-03', '2025-11-05', '97989898', '8489618741', '123456', '1/209 Tank Street', 'JR Plaza', 'Hosur', '636135', '1/209 Tank Street', 'JR Plaza', 'Hosur', '636135', '848561', '8456132', '74512', '784512', 'IFSC4596', 'MICR774851', '', 'Y', '2025-11-06 01:12:57.927436', '2025-11-07 01:11:51.642872', 1, 1, 1, 1, 1, 1, 1, 4, 6, 8, 1, 1, 1),
(3, 'Dhanush', '', '', '9087334690', '', 'dhanush@gmail.com', '', NULL, NULL, '2025-11-17', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Y', '2025-11-18 02:19:46.126736', '2025-11-18 02:19:46.126736', 1, NULL, NULL, NULL, NULL, NULL, NULL, 4, 6, NULL, NULL, NULL, NULL),
(4, 'Mani', '', '', '06380394289', '', 'mani@gmail.com', 'mani@gmail.com', NULL, NULL, '2025-11-08', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Y', '2025-11-23 07:46:02.769884', '2025-11-23 07:46:02.769884', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 4, 6, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `list_type_values`
--

CREATE TABLE `list_type_values` (
  `list_type_value_id` int(11) NOT NULL,
  `list_code` varchar(150) DEFAULT NULL,
  `list_value` varchar(150) DEFAULT NULL,
  `order_sequence` int(11) DEFAULT NULL,
  `short_description` varchar(255) DEFAULT NULL,
  `active_flag` varchar(1) NOT NULL,
  `inactive_date` date DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime(6) DEFAULT NULL,
  `last_updated_by` int(11) DEFAULT NULL,
  `last_updated_date` datetime(6) DEFAULT NULL,
  `deleted_flag` varchar(1) NOT NULL,
  `list_type_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `list_type_values`
--

INSERT INTO `list_type_values` (`list_type_value_id`, `list_code`, `list_value`, `order_sequence`, `short_description`, `active_flag`, `inactive_date`, `start_date`, `end_date`, `created_by`, `created_date`, `last_updated_by`, `last_updated_date`, `deleted_flag`, `list_type_id`) VALUES
(1, 'Y', 'Active', 1, '', 'Y', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'N', 1),
(2, 'N', 'Inactive', 2, '', 'Y', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'N', 1),
(3, 'ALL', 'All', 3, '', 'Y', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'N', 1),
(4, 'PERMANENT', 'Permanent', 1, '', 'Y', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'N', 2),
(5, 'TEMPORARY', 'Temporary', 2, '', 'Y', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'N', 2),
(6, 'MALE', 'Male', 1, '', 'Y', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'N', 3),
(7, 'FEMALE', 'Female', 2, '', 'Y', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'N', 3),
(8, 'MONTHLY', 'Monthly', 1, '', 'Y', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'N', 4),
(9, 'WEEKLY', 'Weekly', 2, '', 'Y', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'N', 4),
(10, 'DAY', 'Day', 3, '', 'Y', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'N', 4),
(11, 'CUSTOMER', 'Customer', 1, '', 'Y', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'N', 5),
(12, 'EMPLOYEE', 'Employee', 2, '', 'Y', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'N', 5);

-- --------------------------------------------------------

--
-- Table structure for table `locations`
--

CREATE TABLE `locations` (
  `id` bigint(20) NOT NULL,
  `location_name` varchar(200) NOT NULL,
  `description` longtext DEFAULT NULL,
  `active_flag` varchar(1) NOT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `created_date` datetime(6) NOT NULL,
  `last_updated_by` varchar(50) DEFAULT NULL,
  `last_updated_date` datetime(6) NOT NULL,
  `city_id` bigint(20) NOT NULL,
  `country_id` bigint(20) NOT NULL,
  `state_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `locations`
--

INSERT INTO `locations` (`id`, `location_name`, `description`, `active_flag`, `created_by`, `created_date`, `last_updated_by`, `last_updated_date`, `city_id`, `country_id`, `state_id`) VALUES
(1, 'Hosur', '', 'Y', NULL, '2025-11-04 16:02:28.088829', NULL, '2025-11-14 00:29:38.637310', 1, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `lov`
--

CREATE TABLE `lov` (
  `list_type_id` int(11) NOT NULL,
  `list_name` varchar(255) DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `active_flag` varchar(1) NOT NULL,
  `inactive_date` datetime(6) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime(6) DEFAULT NULL,
  `last_updated_by` int(11) DEFAULT NULL,
  `last_updated_date` datetime(6) DEFAULT NULL,
  `deleted_flag` varchar(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `lov`
--

INSERT INTO `lov` (`list_type_id`, `list_name`, `description`, `active_flag`, `inactive_date`, `created_by`, `created_date`, `last_updated_by`, `last_updated_date`, `deleted_flag`) VALUES
(1, 'ACTIVESTATUS', '', 'Y', NULL, NULL, NULL, NULL, NULL, 'N'),
(2, 'EMPLOYMENT-TYPE', '', 'Y', NULL, NULL, NULL, NULL, NULL, 'N'),
(3, 'GENDER', '', 'Y', NULL, NULL, NULL, NULL, NULL, 'N'),
(4, 'PAY-FREQUENCIES', '', 'Y', NULL, NULL, NULL, NULL, NULL, 'N'),
(5, 'USER-TYPE', '', 'Y', NULL, NULL, NULL, NULL, NULL, 'N');

-- --------------------------------------------------------

--
-- Table structure for table `projects_header`
--

CREATE TABLE `projects_header` (
  `id` bigint(20) NOT NULL,
  `project_name` varchar(255) NOT NULL,
  `project_description` longtext DEFAULT NULL,
  `active_flag` varchar(1) NOT NULL,
  `created_by` varchar(100) DEFAULT NULL,
  `created_date` datetime(6) NOT NULL,
  `last_updated_by` varchar(100) DEFAULT NULL,
  `last_updated_date` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `projects_line`
--

CREATE TABLE `projects_line` (
  `id` bigint(20) NOT NULL,
  `line_title` varchar(255) NOT NULL,
  `line_description` longtext DEFAULT NULL,
  `active_flag` varchar(1) NOT NULL,
  `created_by` varchar(100) DEFAULT NULL,
  `created_date` datetime(6) NOT NULL,
  `last_updated_by` varchar(100) DEFAULT NULL,
  `last_updated_date` datetime(6) NOT NULL,
  `header_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) NOT NULL,
  `role_name` varchar(100) NOT NULL,
  `description` longtext DEFAULT NULL,
  `active_flag` varchar(1) NOT NULL,
  `created_by` varchar(100) DEFAULT NULL,
  `created_date` datetime(6) NOT NULL,
  `last_updated_by` varchar(100) DEFAULT NULL,
  `last_updated_date` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `role_name`, `description`, `active_flag`, `created_by`, `created_date`, `last_updated_by`, `last_updated_date`) VALUES
(1, 'Manager', '', 'Y', NULL, '2025-11-07 01:19:44.120295', NULL, '2025-11-14 00:22:55.334544'),
(2, 'Admin', '', 'Y', NULL, '2025-11-07 01:19:49.588233', NULL, '2025-11-07 01:19:49.588233'),
(3, 'Networking', '', 'Y', NULL, '2025-11-14 00:17:31.373413', NULL, '2025-11-14 00:17:31.373413');

-- --------------------------------------------------------

--
-- Table structure for table `states`
--

CREATE TABLE `states` (
  `id` bigint(20) NOT NULL,
  `state_name` varchar(100) NOT NULL,
  `state_code` varchar(10) DEFAULT NULL,
  `state_number` varchar(20) DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `active_flag` varchar(1) NOT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `created_date` datetime(6) NOT NULL,
  `last_updated_by` varchar(50) DEFAULT NULL,
  `last_updated_date` datetime(6) NOT NULL,
  `country_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `states`
--

INSERT INTO `states` (`id`, `state_name`, `state_code`, `state_number`, `description`, `active_flag`, `created_by`, `created_date`, `last_updated_by`, `last_updated_date`, `country_id`) VALUES
(1, 'Tamilnadu', 'TN', '33', '', 'Y', NULL, '2025-11-04 16:01:43.391549', NULL, '2025-11-14 00:29:11.051895', 1),
(2, 'Delhi', 'DL', '93', '', 'Y', NULL, '2025-11-14 00:38:24.385939', NULL, '2025-11-14 00:38:24.385939', 1);

-- --------------------------------------------------------

--
-- Table structure for table `user_lines`
--

CREATE TABLE `user_lines` (
  `id` bigint(20) NOT NULL,
  `active_flag` varchar(1) NOT NULL,
  `created_date` datetime(6) NOT NULL,
  `last_updated_date` datetime(6) NOT NULL,
  `header_id` int(11) NOT NULL,
  `role_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_lines`
--

INSERT INTO `user_lines` (`id`, `active_flag`, `created_date`, `last_updated_date`, `header_id`, `role_id`) VALUES
(5, 'Y', '2025-11-18 02:18:21.879384', '2025-11-18 02:18:21.879384', 3, 1),
(7, 'Y', '2025-11-23 07:03:20.453278', '2025-11-23 07:03:20.453278', 1, 1),
(8, 'N', '2025-11-23 07:03:20.470545', '2025-11-23 07:03:20.470545', 1, 2),
(9, 'N', '2025-11-23 07:04:32.197221', '2025-11-23 07:04:32.197221', 4, 1),
(10, 'Y', '2025-11-23 07:04:32.197221', '2025-11-23 07:04:32.197221', 4, 2),
(11, 'Y', '2025-11-23 07:46:43.497079', '2025-11-23 07:46:43.497079', 5, 2);

-- --------------------------------------------------------

--
-- Table structure for table `user_profiles`
--

CREATE TABLE `user_profiles` (
  `id` bigint(20) NOT NULL,
  `from_date` date DEFAULT NULL,
  `to_date` date DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `active_flag` varchar(1) NOT NULL DEFAULT 'Y',
  `employee_id` bigint(20) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `user_type_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_profiles`
--

INSERT INTO `user_profiles` (`id`, `from_date`, `to_date`, `description`, `active_flag`, `employee_id`, `user_id`, `user_type_id`) VALUES
(1, '2025-11-10', '2025-11-13', NULL, 'Y', 1, 1, 12),
(2, '2025-11-17', '2025-11-17', NULL, 'Y', 2, 3, 12),
(3, '2025-11-17', '2025-11-17', NULL, 'Y', 3, 4, 12),
(4, '2025-11-08', NULL, NULL, 'Y', 4, 5, 12);

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
-- Indexes for table `blood_groups`
--
ALTER TABLE `blood_groups`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `blood_group_name` (`blood_group_name`);

--
-- Indexes for table `cities`
--
ALTER TABLE `cities`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cities_state_id_24484747_fk_states_id` (`state_id`),
  ADD KEY `cities_country_id_1e7b9101_fk_countries_id` (`country_id`);

--
-- Indexes for table `countries`
--
ALTER TABLE `countries`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `department_name` (`department_name`);

--
-- Indexes for table `designations`
--
ALTER TABLE `designations`
  ADD PRIMARY KEY (`designation_id`);

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
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employees_current_city_id_086c68b9_fk_cities_id` (`current_city_id`),
  ADD KEY `employees_current_country_id_87c47c47_fk_countries_id` (`current_country_id`),
  ADD KEY `employees_permanent_city_id_a1d4e2c3_fk_cities_id` (`permanent_city_id`),
  ADD KEY `employees_permanent_country_id_cc9a840e_fk_countries_id` (`permanent_country_id`),
  ADD KEY `employees_current_state_id_d2ea20c8_fk_states_id` (`current_state_id`),
  ADD KEY `employees_permanent_state_id_27d09f1c_fk_states_id` (`permanent_state_id`),
  ADD KEY `employees_blood_group_id_1b5b5ab2` (`blood_group_id`),
  ADD KEY `employees_department_id_e0a596e3` (`department_id`),
  ADD KEY `employees_designation_id_a28644df` (`designation_id`),
  ADD KEY `employees_employment_type_id_12623e38` (`employment_type_id`),
  ADD KEY `employees_gender_id_e97881db` (`gender_id`),
  ADD KEY `employees_location_id_dbe1ef61` (`location_id`),
  ADD KEY `employees_pay_frequency_id_eb35a120` (`pay_frequency_id`);

--
-- Indexes for table `list_type_values`
--
ALTER TABLE `list_type_values`
  ADD PRIMARY KEY (`list_type_value_id`),
  ADD KEY `list_type_values_list_type_id_9e32e15f_fk_lov_list_type_id` (`list_type_id`);

--
-- Indexes for table `locations`
--
ALTER TABLE `locations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `locations_city_id_4e0f7782_fk_cities_id` (`city_id`),
  ADD KEY `locations_country_id_61641535_fk_countries_id` (`country_id`),
  ADD KEY `locations_state_id_8eb0fd5d_fk_states_id` (`state_id`);

--
-- Indexes for table `lov`
--
ALTER TABLE `lov`
  ADD PRIMARY KEY (`list_type_id`);

--
-- Indexes for table `projects_header`
--
ALTER TABLE `projects_header`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `projects_line`
--
ALTER TABLE `projects_line`
  ADD PRIMARY KEY (`id`),
  ADD KEY `projects_line_header_id_fca9df34_fk_projects_header_id` (`header_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `states`
--
ALTER TABLE `states`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `state_name` (`state_name`),
  ADD KEY `states_country_id_bdb47937_fk_countries_id` (`country_id`);

--
-- Indexes for table `user_lines`
--
ALTER TABLE `user_lines`
  ADD PRIMARY KEY (`id`),
  ADD KEY `hostel_leave_managem_header_id_6989a4c8_fk_auth_user` (`header_id`),
  ADD KEY `hostel_leave_management_userline_role_id_ad8db767_fk_roles_id` (`role_id`);

--
-- Indexes for table `user_profiles`
--
ALTER TABLE `user_profiles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD KEY `hostel_leave_managem_employee_id_5545b40c_fk_employees` (`employee_id`),
  ADD KEY `hostel_leave_managem_user_type_id_5a301e5b_fk_list_type` (`user_type_id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=93;

--
-- AUTO_INCREMENT for table `auth_user`
--
ALTER TABLE `auth_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

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
-- AUTO_INCREMENT for table `blood_groups`
--
ALTER TABLE `blood_groups`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `cities`
--
ALTER TABLE `cities`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `countries`
--
ALTER TABLE `countries`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `designations`
--
ALTER TABLE `designations`
  MODIFY `designation_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `django_content_type`
--
ALTER TABLE `django_content_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `django_migrations`
--
ALTER TABLE `django_migrations`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `list_type_values`
--
ALTER TABLE `list_type_values`
  MODIFY `list_type_value_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `locations`
--
ALTER TABLE `locations`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `lov`
--
ALTER TABLE `lov`
  MODIFY `list_type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `projects_header`
--
ALTER TABLE `projects_header`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `projects_line`
--
ALTER TABLE `projects_line`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `states`
--
ALTER TABLE `states`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `user_lines`
--
ALTER TABLE `user_lines`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `user_profiles`
--
ALTER TABLE `user_profiles`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
-- Constraints for table `cities`
--
ALTER TABLE `cities`
  ADD CONSTRAINT `cities_country_id_1e7b9101_fk_countries_id` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`),
  ADD CONSTRAINT `cities_state_id_24484747_fk_states_id` FOREIGN KEY (`state_id`) REFERENCES `states` (`id`);

--
-- Constraints for table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  ADD CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  ADD CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Constraints for table `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `employees_blood_group_id_1b5b5ab2_fk_list_type` FOREIGN KEY (`blood_group_id`) REFERENCES `list_type_values` (`list_type_value_id`),
  ADD CONSTRAINT `employees_current_city_id_086c68b9_fk_cities_id` FOREIGN KEY (`current_city_id`) REFERENCES `cities` (`id`),
  ADD CONSTRAINT `employees_current_country_id_87c47c47_fk_countries_id` FOREIGN KEY (`current_country_id`) REFERENCES `countries` (`id`),
  ADD CONSTRAINT `employees_current_state_id_d2ea20c8_fk_states_id` FOREIGN KEY (`current_state_id`) REFERENCES `states` (`id`),
  ADD CONSTRAINT `employees_department_id_e0a596e3_fk_departments_id` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`),
  ADD CONSTRAINT `employees_designation_id_a28644df_fk_designations_designation_id` FOREIGN KEY (`designation_id`) REFERENCES `designations` (`designation_id`),
  ADD CONSTRAINT `employees_employment_type_id_12623e38_fk_list_type` FOREIGN KEY (`employment_type_id`) REFERENCES `list_type_values` (`list_type_value_id`),
  ADD CONSTRAINT `employees_gender_id_e97881db_fk_list_type` FOREIGN KEY (`gender_id`) REFERENCES `list_type_values` (`list_type_value_id`),
  ADD CONSTRAINT `employees_location_id_dbe1ef61_fk_locations_id` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`),
  ADD CONSTRAINT `employees_pay_frequency_id_eb35a120_fk_list_type` FOREIGN KEY (`pay_frequency_id`) REFERENCES `list_type_values` (`list_type_value_id`),
  ADD CONSTRAINT `employees_permanent_city_id_a1d4e2c3_fk_cities_id` FOREIGN KEY (`permanent_city_id`) REFERENCES `cities` (`id`),
  ADD CONSTRAINT `employees_permanent_country_id_cc9a840e_fk_countries_id` FOREIGN KEY (`permanent_country_id`) REFERENCES `countries` (`id`),
  ADD CONSTRAINT `employees_permanent_state_id_27d09f1c_fk_states_id` FOREIGN KEY (`permanent_state_id`) REFERENCES `states` (`id`);

--
-- Constraints for table `list_type_values`
--
ALTER TABLE `list_type_values`
  ADD CONSTRAINT `list_type_values_list_type_id_9e32e15f_fk_lov_list_type_id` FOREIGN KEY (`list_type_id`) REFERENCES `lov` (`list_type_id`);

--
-- Constraints for table `locations`
--
ALTER TABLE `locations`
  ADD CONSTRAINT `locations_city_id_4e0f7782_fk_cities_id` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`),
  ADD CONSTRAINT `locations_country_id_61641535_fk_countries_id` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`),
  ADD CONSTRAINT `locations_state_id_8eb0fd5d_fk_states_id` FOREIGN KEY (`state_id`) REFERENCES `states` (`id`);

--
-- Constraints for table `projects_line`
--
ALTER TABLE `projects_line`
  ADD CONSTRAINT `projects_line_header_id_fca9df34_fk_projects_header_id` FOREIGN KEY (`header_id`) REFERENCES `projects_header` (`id`);

--
-- Constraints for table `states`
--
ALTER TABLE `states`
  ADD CONSTRAINT `states_country_id_bdb47937_fk_countries_id` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`);

--
-- Constraints for table `user_lines`
--
ALTER TABLE `user_lines`
  ADD CONSTRAINT `hostel_leave_managem_header_id_6989a4c8_fk_auth_user` FOREIGN KEY (`header_id`) REFERENCES `auth_user` (`id`),
  ADD CONSTRAINT `hostel_leave_management_userline_role_id_ad8db767_fk_roles_id` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);

--
-- Constraints for table `user_profiles`
--
ALTER TABLE `user_profiles`
  ADD CONSTRAINT `hostel_leave_managem_employee_id_5545b40c_fk_employees` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  ADD CONSTRAINT `hostel_leave_managem_user_id_56e3a130_fk_auth_user` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`),
  ADD CONSTRAINT `hostel_leave_managem_user_type_id_5a301e5b_fk_list_type` FOREIGN KEY (`user_type_id`) REFERENCES `list_type_values` (`list_type_value_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
