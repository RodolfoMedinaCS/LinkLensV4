-- Seed data for LinkLens

-- Insert a test user
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES 
('d0e7df5e-2e48-4da7-a8a3-8f4b7ac65392', 'test@example.com', '$2a$10$SomeLongHashedPasswordStringForTestUser', NOW(), NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert a profile for the test user
INSERT INTO public.profiles (id, username, full_name, avatar_url, created_at, updated_at)
VALUES 
('d0e7df5e-2e48-4da7-a8a3-8f4b7ac65392', 'testuser', 'Test User', 'https://api.dicebear.com/7.x/initials/svg?seed=TU', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert sample links
INSERT INTO public.links (id, user_id, url, title, description, image_url, summary, created_at, updated_at, last_visited)
VALUES
('a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d', 'd0e7df5e-2e48-4da7-a8a3-8f4b7ac65392', 'https://www.example.com/article1', 'Example Article 1', 'This is an example article about web development', 'https://example.com/image1.jpg', 'A summary of article 1 about web development techniques and best practices.', NOW(), NOW(), NOW()),
('b2c3d4e5-f6a5-4b8c-7d9e-0f1a2b3c4d5e', 'd0e7df5e-2e48-4da7-a8a3-8f4b7ac65392', 'https://www.example.com/article2', 'Example Article 2', 'An article about machine learning', 'https://example.com/image2.jpg', 'A summary of article 2 discussing recent advances in machine learning algorithms.', NOW(), NOW(), NOW()),
('c3d4e5f6-a5b8-4c7d-9e0f-1a2b3c4d5e6f', 'd0e7df5e-2e48-4da7-a8a3-8f4b7ac65392', 'https://www.example.com/article3', 'Example Article 3', 'A guide to TypeScript', 'https://example.com/image3.jpg', 'A comprehensive guide to using TypeScript with modern frameworks.', NOW(), NOW(), NOW()),
('d4e5f6a5-b8c7-4d9e-0f1a-2b3c4d5e6f7a', 'd0e7df5e-2e48-4da7-a8a3-8f4b7ac65392', 'https://www.example.com/article4', 'Example Article 4', 'Introduction to React hooks', 'https://example.com/image4.jpg', 'An introduction to React hooks and how they simplify state management.', NOW(), NOW(), NOW()),
('e5f6a5b8-c7d9-4e0f-1a2b-3c4d5e6f7a8b', 'd0e7df5e-2e48-4da7-a8a3-8f4b7ac65392', 'https://www.example.com/article5', 'Example Article 5', 'Getting started with Next.js', 'https://example.com/image5.jpg', 'A beginner\'s guide to building applications with Next.js.', NOW(), NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert sample folders
INSERT INTO public.folders (id, user_id, name, description, created_at, updated_at)
VALUES
('f6a5b8c7-d9e0-4f1a-2b3c-4d5e6f7a8b9c', 'd0e7df5e-2e48-4da7-a8a3-8f4b7ac65392', 'Web Development', 'Articles about web development', NOW(), NOW()),
('a5b8c7d9-e0f1-4a2b-3c4d-5e6f7a8b9c0d', 'd0e7df5e-2e48-4da7-a8a3-8f4b7ac65392', 'Machine Learning', 'Resources for machine learning', NOW(), NOW()),
('b8c7d9e0-f1a2-4b3c-4d5e-6f7a8b9c0d1e', 'd0e7df5e-2e48-4da7-a8a3-8f4b7ac65392', 'React', 'React tutorials and articles', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert sample clusters (AI-generated)
INSERT INTO public.clusters (id, user_id, name, description, confidence_score, created_at, updated_at)
VALUES
('c7d9e0f1-a2b3-4c4d-5e6f-7a8b9c0d1e2f', 'd0e7df5e-2e48-4da7-a8a3-8f4b7ac65392', 'Frontend Development', 'Articles about frontend development', 0.85, NOW(), NOW()),
('d9e0f1a2-b3c4-4d5e-6f7a-8b9c0d1e2f3a', 'd0e7df5e-2e48-4da7-a8a3-8f4b7ac65392', 'JavaScript Frameworks', 'Resources about JavaScript frameworks', 0.92, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert sample tags
INSERT INTO public.tags (id, user_id, name)
VALUES
('e0f1a2b3-c4d5-4e6f-7a8b-9c0d1e2f3a4b', 'd0e7df5e-2e48-4da7-a8a3-8f4b7ac65392', 'JavaScript'),
('f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', 'd0e7df5e-2e48-4da7-a8a3-8f4b7ac65392', 'React'),
('a2b3c4d5-e6f7-4a8b-9c0d-1e2f3a4b5c6d', 'd0e7df5e-2e48-4da7-a8a3-8f4b7ac65392', 'TypeScript'),
('b3c4d5e6-f7a8-4b9c-0d1e-2f3a4b5c6d7e', 'd0e7df5e-2e48-4da7-a8a3-8f4b7ac65392', 'NextJS'),
('c4d5e6f7-a8b9-4c0d-1e2f-3a4b5c6d7e8f', 'd0e7df5e-2e48-4da7-a8a3-8f4b7ac65392', 'ML')
ON CONFLICT (id) DO NOTHING;

-- Link-folder relationships
INSERT INTO public.link_folders (link_id, folder_id)
VALUES
('a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d', 'f6a5b8c7-d9e0-4f1a-2b3c-4d5e6f7a8b9c'),
('c3d4e5f6-a5b8-4c7d-9e0f-1a2b3c4d5e6f', 'f6a5b8c7-d9e0-4f1a-2b3c-4d5e6f7a8b9c'),
('b2c3d4e5-f6a5-4b8c-7d9e-0f1a2b3c4d5e', 'a5b8c7d9-e0f1-4a2b-3c4d-5e6f7a8b9c0d'),
('d4e5f6a5-b8c7-4d9e-0f1a-2b3c4d5e6f7a', 'b8c7d9e0-f1a2-4b3c-4d5e-6f7a8b9c0d1e'),
('e5f6a5b8-c7d9-4e0f-1a2b-3c4d5e6f7a8b', 'b8c7d9e0-f1a2-4b3c-4d5e-6f7a8b9c0d1e')
ON CONFLICT DO NOTHING;

-- Link-cluster relationships
INSERT INTO public.link_clusters (link_id, cluster_id)
VALUES
('c3d4e5f6-a5b8-4c7d-9e0f-1a2b3c4d5e6f', 'c7d9e0f1-a2b3-4c4d-5e6f-7a8b9c0d1e2f'),
('d4e5f6a5-b8c7-4d9e-0f1a-2b3c4d5e6f7a', 'c7d9e0f1-a2b3-4c4d-5e6f-7a8b9c0d1e2f'),
('e5f6a5b8-c7d9-4e0f-1a2b-3c4d5e6f7a8b', 'c7d9e0f1-a2b3-4c4d-5e6f-7a8b9c0d1e2f'),
('d4e5f6a5-b8c7-4d9e-0f1a-2b3c4d5e6f7a', 'd9e0f1a2-b3c4-4d5e-6f7a-8b9c0d1e2f3a'),
('e5f6a5b8-c7d9-4e0f-1a2b-3c4d5e6f7a8b', 'd9e0f1a2-b3c4-4d5e-6f7a-8b9c0d1e2f3a')
ON CONFLICT DO NOTHING;

-- Link-tag relationships
INSERT INTO public.link_tags (link_id, tag_id)
VALUES
('a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d', 'e0f1a2b3-c4d5-4e6f-7a8b-9c0d1e2f3a4b'),
('c3d4e5f6-a5b8-4c7d-9e0f-1a2b3c4d5e6f', 'a2b3c4d5-e6f7-4a8b-9c0d-1e2f3a4b5c6d'),
('d4e5f6a5-b8c7-4d9e-0f1a-2b3c4d5e6f7a', 'f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c'),
('e5f6a5b8-c7d9-4e0f-1a2b-3c4d5e6f7a8b', 'b3c4d5e6-f7a8-4b9c-0d1e-2f3a4b5c6d7e'),
('b2c3d4e5-f6a5-4b8c-7d9e-0f1a2b3c4d5e', 'c4d5e6f7-a8b9-4c0d-1e2f-3a4b5c6d7e8f')
ON CONFLICT DO NOTHING; 