# youtube
A clone of youtube

This project is a simplified version of YouTube, designed to help developers learn full-stack concepts including:

JWT authentication

Protected backend routes

Channel page with user-owned videos

Video uploading, editing, deleting

Comments system

Search functionality

Responsive UI similar to YouTube

The code is organized cleanly to support future expansion like playlists, subscriptions, and watch history.

 Features
 User Authentication

Register & Login

JWT-based session

Token saved to localStorage

Protected pages (e.g., channel page, video upload)
 User Channel

Each user has:

Channel page: /channel/:id

Ability to upload, edit, delete their own videos

Display channel name, avatar, and video count

 Video Management

Upload videos (title, description, thumbnail URL, video URL)

Edit video metadata

Delete videos

View a video in a dedicated player page

 Comments System

Add comments to videos

Display comments with timestamps

Remove comments by owner (optional)

 Search

Search videos by title

API returns flexible results (array or nested keys)

 Responsive UI

YouTube-style Navbar

Collapsible Sidebar

Responsive grid layout

Mobile-friendly design

 Tech Stack
Frontend

React (Hooks)

React Router

CSS (component-based styles)

react-icons

Backend

Node.js

Express

MongoDB + Mongoose

JWT Authentication
