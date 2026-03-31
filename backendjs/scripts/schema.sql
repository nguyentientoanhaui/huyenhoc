-- PostgreSQL Schema for BaZi Application
-- This schema is created automatically by the migration script
-- But can also be run manually if needed

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    credits INTEGER DEFAULT 0,
    is_admin INTEGER DEFAULT 0,
    bazi_data TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    name TEXT,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    day INTEGER NOT NULL,
    hour INTEGER DEFAULT 12,
    minute INTEGER DEFAULT 0,
    gender TEXT DEFAULT 'Nam',
    calendar TEXT DEFAULT 'solar',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Consultations table
CREATE TABLE IF NOT EXISTS consultations (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    theme_id TEXT,
    question_id TEXT NOT NULL,
    question_text TEXT,
    answer TEXT,
    use_ai INTEGER DEFAULT 1,
    credits_used INTEGER DEFAULT 0,
    user_id INTEGER REFERENCES users(id),
    persona TEXT DEFAULT 'huyen_co',
    follow_ups TEXT,
    person1_data TEXT,
    person2_data TEXT,
    metadata TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Question categories table
CREATE TABLE IF NOT EXISTS question_categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT DEFAULT '📋',
    order_index INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Custom questions table
CREATE TABLE IF NOT EXISTS custom_questions (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES question_categories(id),
    text TEXT NOT NULL,
    is_active INTEGER DEFAULT 1,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    user_data TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

-- Credit transactions table
CREATE TABLE IF NOT EXISTS credit_transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    amount INTEGER NOT NULL,
    type TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Credit requests table
CREATE TABLE IF NOT EXISTS credit_requests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    amount INTEGER DEFAULT 100,
    status TEXT DEFAULT 'pending',
    admin_note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP,
    processed_by INTEGER
);

-- Article categories table
CREATE TABLE IF NOT EXISTS article_categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    thumbnail TEXT,
    category_id INTEGER REFERENCES article_categories(id),
    author TEXT DEFAULT 'Huyền Cơ Bát Tự',
    views INTEGER DEFAULT 0,
    is_published INTEGER DEFAULT 1,
    is_featured INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Que history table
CREATE TABLE IF NOT EXISTS que_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    customer_id INTEGER REFERENCES customers(id),
    context_id TEXT,
    bazi_params TEXT,
    que_type TEXT NOT NULL,
    period_key TEXT NOT NULL,
    gua_number INTEGER,
    gua_name TEXT,
    gua_data TEXT,
    user_note TEXT,
    is_verified INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Access logs table
CREATE TABLE IF NOT EXISTS access_logs (
    id SERIAL PRIMARY KEY,
    ip TEXT,
    method TEXT,
    path TEXT,
    status_code INTEGER,
    user_agent TEXT,
    user_id INTEGER REFERENCES users(id),
    user_email TEXT,
    response_time INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

CREATE INDEX IF NOT EXISTS idx_consultations_customer ON consultations(customer_id);
CREATE INDEX IF NOT EXISTS idx_consultations_user ON consultations(user_id);
CREATE INDEX IF NOT EXISTS idx_consultations_created_at ON consultations(created_at);

CREATE INDEX IF NOT EXISTS idx_customers_birth ON customers(year, month, day);
CREATE INDEX IF NOT EXISTS idx_customers_created_at ON customers(created_at);

CREATE INDEX IF NOT EXISTS idx_questions_category ON custom_questions(category_id);

CREATE INDEX IF NOT EXISTS idx_credit_trans_user ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_trans_created_at ON credit_transactions(created_at);

CREATE INDEX IF NOT EXISTS idx_credit_requests_status ON credit_requests(status);
CREATE INDEX IF NOT EXISTS idx_credit_requests_user ON credit_requests(user_id);

CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(is_published);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at);

CREATE INDEX IF NOT EXISTS idx_article_categories_slug ON article_categories(slug);

CREATE INDEX IF NOT EXISTS idx_que_history_user ON que_history(user_id);
CREATE INDEX IF NOT EXISTS idx_que_history_customer ON que_history(customer_id);
CREATE INDEX IF NOT EXISTS idx_que_history_context ON que_history(context_id);
CREATE INDEX IF NOT EXISTS idx_que_history_created_at ON que_history(created_at);

CREATE INDEX IF NOT EXISTS idx_access_logs_created ON access_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_access_logs_ip ON access_logs(ip);
CREATE INDEX IF NOT EXISTS idx_access_logs_path ON access_logs(path);
CREATE INDEX IF NOT EXISTS idx_access_logs_user_id ON access_logs(user_id);

-- Insert default admin users
INSERT INTO users (email, password_hash, name, credits, is_admin)
VALUES 
    ('admin@huyencobattu.vn', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'Administrator', 9999, 1),
    ('admin@admin.com', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'System Admin', 9999, 1)
ON CONFLICT (email) DO NOTHING;

-- Insert default question categories
INSERT INTO question_categories (name, icon, order_index, is_active)
VALUES 
    ('Công danh', '🏛️', 1, 1),
    ('Tình duyên', '❤️', 2, 1),
    ('Tài lộc', '💰', 3, 1),
    ('Sức khỏe', '🏥', 4, 1),
    ('Con cái', '👶', 5, 1),
    ('Đồng nghiệp', '👥', 6, 1),
    ('Hợp tác', '🤝', 7, 1),
    ('Tai họa', '🌪️', 8, 1)
ON CONFLICT DO NOTHING;

-- Insert default article categories
INSERT INTO article_categories (name, slug, description, order_index, is_active)
VALUES 
    ('Kiến thức Bát Tự', 'kien-thuc-bat-tu', 'Các bài viết về kiến thức Bát Tự cơ bản', 1, 1),
    ('Hướng dẫn sử dụng', 'huong-dan-su-dung', 'Hướng dẫn cách sử dụng ứng dụng', 2, 1),
    ('Tin tức', 'tin-tuc', 'Tin tức và cập nhật mới', 3, 1),
    ('Tư vấn', 'tu-van', 'Các bài tư vấn từ chuyên gia', 4, 1)
ON CONFLICT (slug) DO NOTHING;
