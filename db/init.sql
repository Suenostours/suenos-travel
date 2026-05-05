CREATE TABLE IF NOT EXISTS users (
  id bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  unionId varchar(255) NOT NULL UNIQUE,
  name varchar(255),
  email varchar(320),
  avatar text,
  role enum('user', 'admin') NOT NULL DEFAULT 'user',
  createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  lastSignInAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admins (
  id bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  email varchar(320) NOT NULL UNIQUE,
  password_hash varchar(255) NOT NULL,
  name varchar(255) NOT NULL,
  role enum('super_admin', 'admin', 'editor') NOT NULL DEFAULT 'editor',
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS site_settings (
  id bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `key` varchar(100) NOT NULL UNIQUE,
  `value` text NOT NULL,
  `group` varchar(50) NOT NULL DEFAULT 'general',
  updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cities (
  id bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  slug varchar(100) NOT NULL UNIQUE,
  main_image text,
  gallery json,
  active tinyint unsigned NOT NULL DEFAULT 1,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS city_translations (
  id bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  city_id bigint unsigned NOT NULL,
  locale enum('fr', 'en') NOT NULL DEFAULT 'en',
  name varchar(255) NOT NULL,
  description text,
  meta_title varchar(255),
  meta_description text
);

CREATE TABLE IF NOT EXISTS tours (
  id bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  slug varchar(100) NOT NULL UNIQUE,
  main_image text,
  gallery json,
  duration varchar(50),
  `type` enum('private', 'small_group', 'corporate', 'desert', 'family', 'luxury', 'cultural', 'adventure', 'short_break', 'coast', 'sports', 'wellness', 'romantic') NOT NULL DEFAULT 'private',
  featured tinyint unsigned NOT NULL DEFAULT 0,
  active tinyint unsigned NOT NULL DEFAULT 1,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tour_translations (
  id bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  tour_id bigint unsigned NOT NULL,
  locale enum('fr', 'en') NOT NULL DEFAULT 'en',
  title varchar(255) NOT NULL,
  description text,
  program text,
  highlights text,
  inclusions text,
  exclusions text,
  meta_title varchar(255),
  meta_description text
);

CREATE TABLE IF NOT EXISTS tour_cities (
  id bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  tour_id bigint unsigned NOT NULL,
  city_id bigint unsigned NOT NULL
);

CREATE TABLE IF NOT EXISTS excursions (
  id bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  slug varchar(100) NOT NULL UNIQUE,
  city_id bigint unsigned,
  main_image text,
  gallery json,
  duration varchar(50),
  active tinyint unsigned NOT NULL DEFAULT 1,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS excursion_translations (
  id bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  excursion_id bigint unsigned NOT NULL,
  locale enum('fr', 'en') NOT NULL DEFAULT 'en',
  title varchar(255) NOT NULL,
  description text,
  highlights text,
  meta_title varchar(255),
  meta_description text
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  slug varchar(100) NOT NULL UNIQUE,
  main_image text,
  category varchar(100),
  tags json,
  `status` enum('draft', 'published') NOT NULL DEFAULT 'draft',
  published_at timestamp NULL,
  active tinyint unsigned NOT NULL DEFAULT 1,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blog_translations (
  id bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  post_id bigint unsigned NOT NULL,
  locale enum('fr', 'en') NOT NULL DEFAULT 'en',
  title varchar(255) NOT NULL,
  content text,
  meta_title varchar(255),
  meta_description text
);

CREATE TABLE IF NOT EXISTS media (
  id bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  filename varchar(255) NOT NULL,
  original_name varchar(255) NOT NULL,
  `path` text NOT NULL,
  mime_type varchar(100),
  `size` int,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contact_requests (
  id bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name varchar(255) NOT NULL,
  email varchar(320) NOT NULL,
  phone varchar(50),
  subject varchar(255),
  message text NOT NULL,
  `status` enum('new', 'treated', 'archived') NOT NULL DEFAULT 'new',
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quote_requests (
  id bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  agency_name varchar(255),
  contact_person varchar(255),
  email varchar(320) NOT NULL,
  whatsapp varchar(50),
  country varchar(100),
  travel_type varchar(50),
  dates varchar(100),
  duration varchar(50),
  adults int,
  children int,
  preferred_destinations text,
  preferred_circuit varchar(255),
  hotel_category varchar(50),
  transport_type varchar(50),
  guide_language varchar(50),
  budget_range varchar(100),
  special_requests text,
  `status` enum('new', 'treated', 'archived') NOT NULL DEFAULT 'new',
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS partner_requests (
  id bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  agency_name varchar(255) NOT NULL,
  country varchar(100),
  website varchar(255),
  contact_person varchar(255) NOT NULL,
  email varchar(320) NOT NULL,
  whatsapp varchar(50),
  business_type varchar(100),
  expected_volume varchar(100),
  `status` enum('new', 'treated', 'archived') NOT NULL DEFAULT 'new',
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS seo_settings (
  id bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `path` varchar(255) NOT NULL UNIQUE,
  meta_title varchar(255),
  meta_description text,
  og_image text,
  canonical text,
  updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
