-- OpenShelf Database Schema Initialization
-- Paste this script into your Supabase SQL Editor to set up your tables and seed them with initial data.

-- Reset database tables if they exist to prevent foreign key conflicts during fresh setup
DROP TABLE IF EXISTS public.transactions CASCADE;
DROP TABLE IF EXISTS public.digital_resources CASCADE;
DROP TABLE IF EXISTS public.books CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS public.users (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('Student', 'Faculty', 'Librarian', 'Admin')),
    department VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Books Table
CREATE TABLE IF NOT EXISTS public.books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'Available' CHECK (status IN ('Available', 'Issued', 'Reserved')),
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Digital Resources Table
CREATE TABLE IF NOT EXISTS public.digital_resources (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('E-Book', 'Journal', 'Research Paper', 'Thesis')),
    file_url TEXT DEFAULT '#',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Transactions (Circulation) Table
CREATE TABLE IF NOT EXISTS public.transactions (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL REFERENCES public.users(student_id) ON DELETE CASCADE,
    book_id INT NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'Issued' CHECK (status IN ('Issued', 'Returned', 'Overdue')),
    fine INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Disable RLS restrictions by creating simple open policies for development/testing
CREATE POLICY "Allow public read users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow public all users" ON public.users FOR ALL USING (true);

CREATE POLICY "Allow public read books" ON public.books FOR SELECT USING (true);
CREATE POLICY "Allow public all books" ON public.books FOR ALL USING (true);

CREATE POLICY "Allow public read resources" ON public.digital_resources FOR SELECT USING (true);
CREATE POLICY "Allow public all resources" ON public.digital_resources FOR ALL USING (true);

CREATE POLICY "Allow public read transactions" ON public.transactions FOR SELECT USING (true);
CREATE POLICY "Allow public all transactions" ON public.transactions FOR ALL USING (true);

-- 5. Seed Users Data
INSERT INTO public.users (student_id, name, email, role, department) VALUES
('MCA001', 'Snehasri Pati', 'snehasri@openshelf.com', 'Student', 'MCA'),
('MCA002', 'Amit Sharma', 'amit@openshelf.com', 'Student', 'MCA'),
('MCA003', 'Pooja Patel', 'pooja@openshelf.com', 'Student', 'MCA'),
('FAC001', 'Ananya Das', 'ananya@openshelf.com', 'Faculty', 'CSE'),
('LIB001', 'Rahul Kumar', 'rahul@openshelf.com', 'Librarian', 'Library'),
('ADM001', 'Admin User', 'admin@openshelf.com', 'Admin', 'Administration')
ON CONFLICT (student_id) DO NOTHING;

-- 6. Seed Books Data
INSERT INTO public.books (id, title, author, category, status, image_url) VALUES
(1, 'Clean Code', 'Robert Martin', 'Programming', 'Available', 'https://images-na.ssl-images-amazon.com/images/I/41xShCOK5mL._SX379_BO1,204,203,200_.jpg'),
(2, 'Computer Networks', 'Forouzan', 'Networking', 'Available', 'https://images-na.ssl-images-amazon.com/images/I/51-P-H3r6FL._SX383_BO1,204,203,200_.jpg'),
(3, 'Database System Concepts', 'Korth', 'Database', 'Issued', 'https://images-na.ssl-images-amazon.com/images/I/51%2B1eT1rYxL._SX384_BO1,204,203,200_.jpg'),
(4, 'Java Complete Reference', 'Herbert Schildt', 'Programming', 'Available', 'https://images-na.ssl-images-amazon.com/images/I/514mS%2B2aP1L._SX382_BO1,204,203,200_.jpg')
ON CONFLICT (id) DO NOTHING;

-- Adjust identity sequence values for serial ids
SELECT setval('public.books_id_seq', COALESCE((SELECT MAX(id)+1 FROM public.books), 1), false);

-- 7. Seed Digital Resources Data
INSERT INTO public.digital_resources (title, author, department, type, file_url) VALUES
('Database Management System', 'Korth', 'CSE', 'E-Book', '#'),
('Computer Networks', 'Forouzan', 'CSE', 'E-Book', '#'),
('Thermodynamics', 'P.K. Nag', 'CSE', 'E-Book', '#'),
('Machine Design', 'R.S. Khurmi', 'ECE', 'Journal', '#'),
('Digital Electronics', 'Morris Mano', 'ECE', 'E-Book', '#'),
('Structural Analysis', 'R.C. Hibbeler', 'Civil', 'Research Paper', '#');

-- 8. Seed Transactions Data
INSERT INTO public.transactions (student_id, book_id, issue_date, due_date, status, fine) VALUES
('MCA001', 1, '2026-06-14', '2026-06-28', 'Issued', 0),
('MCA002', 4, '2026-06-10', '2026-06-24', 'Returned', 0),
('MCA003', 3, '2026-06-05', '2026-06-19', 'Overdue', 50);
