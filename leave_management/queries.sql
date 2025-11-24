-- 1️⃣ Drop the foreign key constraint from child table
ALTER TABLE projects_line DROP FOREIGN KEY projects_line_header_id_fca9df34_fk_projects_header_id;

-- 2️⃣ Truncate both tables
TRUNCATE TABLE projects_line;
TRUNCATE TABLE projects_header;

-- 3️⃣ Recreate the foreign key constraint
ALTER TABLE projects_line
ADD CONSTRAINT projects_line_header_id_fca9df34_fk_projects_header_id
FOREIGN KEY (header_id) REFERENCES projects_header(id);
