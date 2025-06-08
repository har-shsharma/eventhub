EventHub - Project Documentation
Overview
EventHub is a full-stack event management platform designed to enable event owners to create, manage, and share events. Users can RSVP to events, and a role-based system controls access and actions within the app. The application uses Next.js for both frontend and backend (API routes), MongoDB Atlas for the database, and is deployed on Vercel.
________________________________________
Tech Stack
•	Frontend: Next.js (App Router)
•	Backend/API: Next.js API routes
•	Database: MongoDB Atlas
•	Authentication: JWT-based with role-based access
•	Deployment: Vercel
•	Email Notifications: Nodemailer
•	Animations & UX: GSAP, loading animations during API calls
________________________________________
User Roles
1.	Admin
2.	Owner
3.	Staff
4.	Guest
Registration
•	Users can register with 3 roles: Owner, Staff, Guest.
Login
•	Admin
•	Owner
•	Staff
•	Guest
________________________________________



Permissions by Role
Feature	Admin	Owner	Staff	Guest
Create Event	Yes	Yes	No	No
Edit Event	Yes	Yes	Yes	No
Delete Event	Yes	Yes	No	No
Approve/Reject Event	Yes	No	No	No
View All RSVPs	Yes	Own	Yes	No
Download RSVPs (CSV)	Yes	Own	Yes	No
Submit RSVP 	No	No	No	Yes
________________________________________
Features
1. Event Creation and Approval Workflow
•	Only Owners and Admins can create events.
•	Events created by Owners are sent to an "Approve" queue.
•	Admin has access to /approve page to approve/reject pending events.
•	Notifications are sent via email to owners upon event approval or rejection using Nodemailer.
•	Events created by Admins are auto-approved.
2. RSVP Functionality
•	All approved events are listed on the /dashboard page.
•	Users (Owner, Guest) can RSVP to events.
•	Owners can view RSVPs for their events.
•	Admin and Staff can view/download RSVPs for any event.
•	CSV export functionality available for viewing RSVPs.
3. User-Specific Views
•	/dashboard: Public page showing all approved events.
•	/myevents: Shows events created by the logged-in user (Owner/Admin).
•	/approve: Admin-only page to manage pending event approvals.
•	/create: Page for Admins and Owners to create new events.
4. Pagination & Filtering
•	All API endpoints support pagination.
•	/myevents page has filter by status: All, Pending, Approved, Rejected.
•	/dashboard includes a search bar to filter events by keywords.
5. UX Enhancements
•	Preloading animations using GSAP.
•	Loading animations during API calls to improve user experience.
________________________________________
API Summary
EventHub has a total of 12 API endpoints, covering registration, login, CRUD operations for events, RSVP management, and admin controls.
________________________________________
Deployment & Hosting
•	Frontend & Backend hosted via Vercel.
•	Environment variables securely stored for DB, JWT, and email credentials.
________________________________________
Security
•	JWT token-based authentication.
•	Role-based access control enforced in both frontend and backend.
________________________________________
Future Improvements
•	Integrate analytics for event performance.
•	Allow event image uploads (e.g. Cloudinary).
•	Real-time RSVP notifications using WebSockets.
________________________________________
Conclusion
EventHub is a scalable, secure, and user-friendly platform that enables structured event management with a robust admin workflow, tailored experiences per user role, and intuitive UI enhancements.
