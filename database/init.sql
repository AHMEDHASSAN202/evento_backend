-- Create database
CREATE DATABASE IF NOT EXISTS evento_db;
USE evento_db;

-- Sample cities
INSERT INTO cities (name, description, isActive, createdAt, updatedAt) VALUES
('New York', 'The Big Apple', true, NOW(), NOW()),
('Los Angeles', 'City of Angels', true, NOW(), NOW()),
('Chicago', 'Windy City', true, NOW(), NOW()),
('Miami', 'Magic City', true, NOW(), NOW()),
('Las Vegas', 'Sin City', true, NOW(), NOW());

-- Sample admin (password: admin123)
INSERT INTO admins (email, password, name, isActive, createdAt, updatedAt) VALUES
('admin@evento.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Super Admin', true, NOW(), NOW());

-- Sample event types
INSERT INTO event_types (name, description, isActive, createdAt, updatedAt) VALUES
('عيد ميلاد', 'Birthday celebrations and parties', true, NOW(), NOW()),
('سبوع', 'Baby celebration (7th day after birth)', true, NOW(), NOW()),
('حفله تخرج', 'Graduation parties and ceremonies', true, NOW(), NOW()),
('زفاف', 'Wedding celebrations and ceremonies', true, NOW(), NOW()),
('حفله خطوبه', 'Engagement parties and celebrations', true, NOW(), NOW()),
('حفله شركه', 'Corporate events and company parties', true, NOW(), NOW()),
('حفله عائليه', 'Family gatherings and celebrations', true, NOW(), NOW());

-- Sample freelancers (created by admin) with bio and gender
INSERT INTO users (phone, name, type, gender, bio, portfolio, isPhoneVerified, isActive, createdAt, updatedAt) VALUES
('+1987654321', 'Alice Photography', 'freelancer', 'female', 'Professional event photographer with 10+ years experience specializing in weddings, corporate events, and portraits. Passionate about capturing beautiful moments.', 'https://alice-photography.com', true, true, NOW(), NOW()),
('+1987654322', 'Mike Videography', 'freelancer', 'male', 'Award-winning videographer specializing in corporate events, commercials, and documentaries. Creative storytelling through visual media.', 'https://mike-videography.com', true, true, NOW(), NOW()),
('+1987654323', 'Sarah DJ', 'freelancer', 'female', 'Professional DJ for all types of events including weddings, corporate parties, and private celebrations. Extensive music collection and professional equipment.', 'https://sarah-dj.com', true, true, NOW(), NOW());

-- Link freelancers to cities (user_cities table)
INSERT INTO user_cities (userId, cityId) VALUES
(1, 1), -- Alice Photography -> New York
(2, 2), -- Mike Videography -> Los Angeles
(3, 3); -- Sarah DJ -> Chicago

-- Sample packages
INSERT INTO packages (name, description, price, freelancerId, isActive, createdAt, updatedAt) VALUES
('Basic Photography Package', '4 hours of photography, 100 edited photos', 299.99, 1, true, NOW(), NOW()),
('Premium Photography Package', '8 hours of photography, 200 edited photos, engagement session', 599.99, 1, true, NOW(), NOW()),
('Basic Videography Package', '4 hours of videography, 5-minute highlight video', 399.99, 2, true, NOW(), NOW()),
('DJ Package', '4 hours of DJ services, sound system included', 199.99, 3, true, NOW(), NOW());

-- Sample events
INSERT INTO events (title, description, images, eventDate, freelancerId, eventTypeId, createdAt, updatedAt) VALUES
('Beautiful Wedding at Central Park', 'A magical wedding celebration with 200 guests in the heart of New York', 'wedding1.jpg,wedding2.jpg,wedding3.jpg', '2024-06-15', 1, 4, NOW(), NOW()),
('Corporate Annual Meeting', 'Professional photography for annual corporate meeting', 'corp1.jpg,corp2.jpg', '2024-07-20', 1, 6, NOW(), NOW()),
('Birthday Party for Sarah', 'Sweet 16 birthday celebration with decorations and cake', 'birthday1.jpg,birthday2.jpg', '2024-08-10', 1, 1, NOW(), NOW()),
('Graduation Ceremony Video', 'Complete graduation ceremony coverage with highlight reel', 'grad1.jpg,grad2.jpg', '2024-05-25', 2, 3, NOW(), NOW()),
('Wedding Video Production', 'Full wedding day coverage from morning to reception', 'wedding_vid1.jpg,wedding_vid2.jpg', '2024-09-30', 2, 4, NOW(), NOW()),
('DJ at Birthday Party', 'High-energy birthday party with custom playlist', 'dj1.jpg,dj2.jpg', '2024-07-15', 3, 1, NOW(), NOW()),
('Corporate Event DJ', 'Professional DJ services for company celebration', 'corp_dj1.jpg', '2024-08-25', 3, 6, NOW(), NOW());

-- Note: Regular users will be created automatically when they first login
-- They will have default names like "User_7890" and default gender "male"
-- Users can update their profiles later with correct information

-- Note: Orders will be created with PENDING status initially
-- Users must pay 10% deposit to move to PAID status
-- Freelancers only see orders that are PAID or beyond
-- Payment records are created when deposit payments are made
