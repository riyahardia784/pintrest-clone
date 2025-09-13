# pintrest-clone
# pintrest-clone

## Description

A Pinterest-like web application where users can register, log in, create posts (pins), save posts, edit their profile, and view feeds. Built with Node.js, Express, MongoDB, Passport.js, EJS, and Tailwind CSS.

---

## Features

- **User Registration & Login**: Secure authentication using Passport.js.
- **Profile Management**: Edit profile details and upload profile images.
- **Create Posts**: Upload images with title and description.
- **Feed**: View all posts from all users.
- **Save Posts**: Save pins to your profile.
- **View Created & Saved Pins**: Separate views for your created and saved posts.
- **Responsive UI**: Built with Tailwind CSS and EJS templates.
- **Flash Messages**: Error handling and feedback for authentication.

---

## API Endpoints

### Authentication

- `GET /`  
  Login page.

- `POST /login`  
  Login with username and password.

- `GET /register`  
  Registration page.

- `POST /register`  
  Register a new user.

- `GET /logout`  
  Log out the current user.

---

### Profile

- `GET /profile`  
  View user profile (requires authentication).

- `POST /fileupload`  
  Upload/change profile image.

- `GET /edit`  
  Edit profile page.

- `POST /edit`  
  Update profile details.

- `POST /editfileupload`  
  Upload profile image from edit page.

---

### Posts

- `GET /feed`  
  View all posts (feed).

- `GET /upload`  
  Create new post page.

- `POST /createpost`  
  Create a new post (upload image, title, description).

- `GET /show/posts`  
  View all posts created by the user.

- `GET /show/posts/:imageId`  
  View details of a single post.

---

### Saved Posts

- `POST /save/:postId`  
  Save a post to your profile.

- `GET /save`  
  View all saved posts.

---

## Backend

- **Express.js**: Handles routing and middleware.
- **MongoDB & Mongoose**: Data storage for users and posts.
- **Passport.js**: Authentication (local strategy).
- **Multer**: Handles image uploads.
- **Session & Flash**: User sessions and error messages.

### Models

- `user`: Stores user info, posts, and saved posts.
- `post`: Stores post info (image, title, description, user).
- `save`: (Unused, legacy) Model for saved posts.

---

## Frontend

- **EJS Templates**: Dynamic HTML rendering.
- **Tailwind CSS**: Responsive and modern UI.
- **Client-side JS**: Handles UI interactions (image upload, navigation).
- **GSAP Animations**: Smooth transitions and effects.

### Main Views

- `index.ejs`: Login page.
- `register.ejs`: Registration page.
- `profile.ejs`: User profile.
- `edit.ejs`: Edit profile.
- `feed.ejs`: All posts.
- `upload.ejs`: Create post.
- `show.ejs`: User's created posts.
- `save.ejs`: User's saved posts.
- `card.ejs`: Single post detail.

---

## How to Run

1. Install dependencies:  
   `npm install`
2. Start MongoDB locally.
3. Run the app:  
   `npm start`
4. Visit `http://localhost:3000` in your browser.

---





