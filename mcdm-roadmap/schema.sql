-- Database Schema for MCDM/MCDA Roadmap Platform
-- Suitable for standard PostgreSQL and Supabase integration

-- Enable UUID extension if needed, though we will use SERIAL/VARCHAR for simple compatibility
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table for User Accounts
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table for User Learning Roadmap Progress
CREATE TABLE IF NOT EXISTS user_progress (
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    node_id VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('not_started', 'in_progress', 'completed')),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, node_id)
);

-- Table for Cached OpenAlex Publications/Articles (for the auto-update statistics and search)
CREATE TABLE IF NOT EXISTS synced_articles (
    id VARCHAR(255) PRIMARY KEY, -- OpenAlex ID or Work ID URL
    title TEXT NOT NULL,
    authors TEXT[] NOT NULL,
    journal TEXT,
    year INT,
    citation_count INT DEFAULT 0,
    link TEXT,
    synced_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for quickly fetching progress by user
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id);
