# Bower Excavation Services

Professional excavation, land improvement, and fire weed abatement website developed for **Bower Company Construction**.

This project is a complete full-stack web application built to provide customers with information about the company's excavation and vegetation management services while allowing visitors to submit quote requests that are securely stored, managed, and organized through an administrative dashboard. The application was designed with scalability, maintainability, performance, and responsive design in mind using modern JavaScript technologies and follows a clean MVC-inspired architecture.


# About The Project

Bower Excavation Services was built to modernize the company's online presence while providing an efficient customer management system behind the scenes. Beyond simply advertising services, the application functions as a complete customer request management platform.

Visitors can browse available services, learn about excavation and vegetation management, view project imagery, and submit service requests directly through an online contact form. Submitted requests are stored in **MongoDB through Mongoose** and become immediately available inside the private administrative dashboard known as **Big Bull RON**, where customer inquiries can be reviewed, organized, restored, or managed without directly accessing the database.

The project emphasizes clean code organization, reusable templates, responsive layouts, accessibility, and future expansion for additional construction services.


# Services

## Excavation Services

Professional excavation solutions including:

- Residential excavation
- Commercial excavation
- Site excavation
- Dirt removal
- Ground leveling
- Trenching
- Utility preparation
- Rough grading
- Final grading
- Site cleanup


---

## Fire Weed Abatement

Professional vegetation management services including:

- Fire weed abatement
- Brush removal
- Dry vegetation removal
- Fuel reduction
- Property cleanup
- Hillside clearing
- Seasonal maintenance
- Fire prevention preparation


---

## Disking Services

Land preparation and agricultural maintenance including:

- Agricultural discing
- Field preparation
- Soil conditioning
- Property restoration
- Ground improvement
- Weed control
- Vegetation management
- Large acreage maintenance


---

## Brush Clearing & Vegetation Removal

Heavy vegetation management services including:

- Brush clearing
- Small tree removal
- Stump removal
- Property access clearing
- Vacant lot cleanup
- Overgrowth removal
- Mulching
- Land restoration


---

## Concrete Breaking & Removal

Construction demolition services including:

- Concrete breaking
- Slab removal
- Foundation demolition
- Site cleanup
- Construction preparation
- Debris removal


---

## Site Preparation

Preparing land for future development including:

- Construction site preparation
- Foundation preparation
- Ground leveling
- Dirt work
- Property grading
- Building pad preparation


# Technology Stack

## Frontend

The customer-facing website was developed using modern frontend technologies including:

- HTML5
- CSS3
- Bootstrap 5
- JavaScript (ES6)
- Responsive Design
- EJS Template Engine
- Modular Partial Views


---

## Backend

The server-side application was built with:

- Node.js
- Express.js
- REST-style routing
- Middleware architecture
- Environment variable support using Dotenv
- Method Override support
- MongoDB integration
- Mongoose ODM
- Modular application architecture


---

## Database

Customer information is securely stored using:

- MongoDB
- Mongoose ODM
- Mongoose schemas and models
- MongoDB ObjectId document identifiers
- Automatic document timestamps
- Indexed customer request fields
- Soft delete functionality
- Customer recovery system
- Administrative data management


# MongoDB & Mongoose

The application uses **MongoDB** as its primary database and **Mongoose** as the Object Data Modeling layer between the Express application and MongoDB.

Customer requests are represented through the `ContactRequest` Mongoose model.

The model manages information including:

- Customer name
- Customer email
- Customer phone number
- Requested service
- Property address
- Customer message
- Responded status
- Responded date
- Deleted status
- Deleted date
- Creation timestamp
- Update timestamp

MongoDB automatically assigns each customer request a unique `_id` using an ObjectId.

The Mongoose model also exposes the standard `id` virtual so existing EJS templates can continue using:

```ejs
<%= submission.id %>
```

This allows Big Bull RON routes and EJS templates to work naturally with MongoDB ObjectIds without exposing database-specific implementation details throughout the frontend.


# Administrative Dashboard

The application includes a fully custom administrative dashboard called **Big Bull RON**.

Features include:

- View all customer requests
- Track unanswered requests
- Mark requests as responded
- Mark requests as unanswered
- Reopen customer requests
- Soft delete customer submissions
- Recovery dashboard
- Restore deleted customer requests
- Deleted request counter
- Active request counter
- Organized customer management workflow


# Big Bull RON Recovery System

Customer requests are not immediately permanently removed when deleted from the administrative dashboard.

Instead, the application uses a **soft delete system** backed by MongoDB.

When a request is deleted:

- The `deleted` field is changed to `true`
- The `deleted_at` field records the deletion date
- The request disappears from the active Big Bull RON dashboard
- The document remains safely stored in MongoDB
- The request becomes available inside the recovery dashboard

The administrator can then restore the customer request.

When restored:

- `deleted` returns to `false`
- `deleted_at` is cleared
- The customer request returns to the active Big Bull RON dashboard

This provides an additional layer of protection against accidentally losing customer information.


# Contact Request System

Visitors can submit project requests through an online contact form.

Features include:

- Customer name
- Email address
- Phone number
- Requested service
- Property address
- Customer message
- Automatic MongoDB storage through Mongoose
- Server-side validation
- Error handling


# Email Integration

The project integrates with **Web3Forms** to deliver customer inquiries directly to the business email account.

Features include:

- Secure API integration
- Environment variable protection
- Email delivery
- Customer request notifications
- Contact form processing
- Graceful error handling
- MongoDB storage of submitted customer requests

The Big Bull RON dashboard also allows the administrator to respond to customers using their submitted email address.

The response system can open Gmail with the customer's email address already populated, allowing the business owner to quickly respond to individual customer inquiries.


# Environment Configuration

Private application configuration is managed using environment variables through **Dotenv**.

The application can use environment variables including:

```env
PORT=3000

MONGODB_URI=your_mongodb_connection_string

WEB3FORMS_ACCESS_KEY=your_web3forms_access_key

BUSINESS_EMAIL=your_business_email

BUSINESS_PHONE=your_business_phone
```

The actual `.env` file should remain private and should not be committed to the public GitHub repository.

The `.gitignore` file is used to prevent sensitive configuration and local development files from being committed.


# Search Engine Optimization (SEO)

The website has been optimized for modern search engines.

Implemented features include:

- SEO optimized page titles
- Meta descriptions
- Keyword optimization
- Local Walnut Creek search targeting
- Construction service keywords
- Fire weed abatement optimization
- Excavation service optimization
- Responsive mobile support
- Favicon support
- Google Search Console verification
- Search indexing readiness
- Sitemap support


# Testing

The application has been thoroughly tested using automated testing.

Testing technologies include:

- Jest
- Supertest

Current test coverage includes:

- MongoDB/Mongoose operations
- Customer creation
- Customer retrieval
- Customer response status
- Mark responded functionality
- Mark unanswered functionality
- Soft delete functionality
- Recovery system
- Restore functionality
- Administrative routes
- Express application routes
- Customer workflow testing
- Big Bull RON administrative testing

The project currently contains **95 passing automated tests**, helping ensure application stability as new features are added.

Current test result:

```text
Test Suites: 2 passed, 2 total
Tests:       95 passed, 95 total
Snapshots:   0 total
```

This automated test suite helps verify that the customer request workflow, MongoDB/Mongoose operations, administrative routes, deletion system, and recovery system continue functioning correctly as the application evolves.


# Features

The application currently includes:

- Fully responsive website
- Bootstrap user interface
- Dynamic EJS templates
- Reusable partial components
- MVC-inspired architecture
- MongoDB database
- Mongoose ODM
- Mongoose customer request model
- MongoDB ObjectId support
- Administrative dashboard
- Big Bull RON customer management
- Responded/unanswered request tracking
- Soft delete customer recovery
- Restore deleted requests
- Contact request management
- Email notifications
- Gmail response workflow
- Web3Forms integration
- Search engine optimization
- Google Search Console verification
- Sitemap support
- Environment variable configuration
- Git version control
- GitHub repository integration
- Render cloud deployment
- Automated unit/integration testing
- Modular project organization
- Scalable code structure


# Project Structure

The project follows a clean full-stack, MVC-inspired folder organization separating MongoDB models, public assets, automated tests, EJS views, administrative tools, configuration files, and application logic.

```text
excavation-website/
│
├── models/
│   └── ContactRequest.js
│
├── node_modules/
│
├── public/
│   │
│   ├── css/
│   │   ├── BigBullRon.css
│   │   └── home.css
│   │
│   ├── images/
│   │   ├── hero_page.png
│   │   ├── image_1.jpg
│   │   ├── image_2.png
│   │   ├── image_3.png
│   │   ├── image_4.png
│   │   └── Logo.png
│   │
│   ├── js/
│   │   └── main.js
│   │
│   ├── google58598e67e8a0915c.html
│   ├── sitemap.xml
│   └── Test_001
│
├── test/
│   ├── app.test.js
│   └── database.test.js
│
├── views/
│   │
│   ├── admin/
│   │   ├── big_bull_ron_recover.ejs
│   │   └── big_bull_ron.ejs
│   │
│   ├── partials/
│   │   ├── body.ejs
│   │   ├── footer.ejs
│   │   ├── gallery.ejs
│   │   ├── header.ejs
│   │   ├── hero.ejs
│   │   ├── navbar.ejs
│   │   └── scripts.ejs
│   │
│   ├── contact.ejs
│   ├── home.ejs
│   └── services.ejs
│
├── .env
├── .gitignore
├── app.js
├── package-lock.json
├── package.json
├── Push to GitHub test 5
└── README.md
```


# Structure Overview

The `models` directory contains the Mongoose data models used by the application.

`models/ContactRequest.js` defines the MongoDB/Mongoose schema for customer quote requests and contains fields used by the complete Big Bull RON workflow, including customer information, response status, deletion status, recovery information, and timestamps.

The `public` directory contains all files that are served directly to the browser, including CSS stylesheets, JavaScript, website photographs, the Bower Company logo, sitemap, and Google Search Console HTML verification file.

The `public/js/main.js` file controls client-side functionality including the homepage scroll reveal animations.

The `test` directory contains the automated Jest and Supertest test suites.

`app.test.js` tests the Express application and routes.

`database.test.js` tests customer creation, retrieval, response status, deletion, restoration, counters, and the complete Big Bull RON recovery workflow using the application's MongoDB/Mongoose architecture.

The `views` directory contains the EJS frontend templates used to generate the website. Public pages include the home, contact, and services views.

The `views/admin` directory contains the Big Bull RON administrative dashboard and deleted-request recovery interface.

The `views/partials` directory contains reusable EJS components including the header, navigation bar, hero section, body content, gallery, footer, and JavaScript includes.

`app.js` is the main Express application and contains the application's middleware, MongoDB/Mongoose connection setup, page routing, customer submission processing, Big Bull RON routes, email integration, error handling, and server startup configuration.

`models/ContactRequest.js` provides the Mongoose model used by the application to create, read, update, soft-delete, restore, and manage customer requests in MongoDB.

`package.json` defines the Node.js application, production dependencies, development dependencies, Node version, startup commands, and automated testing commands.

`package-lock.json` locks the exact dependency versions used by the application for reproducible installations and deployments.

`.env` contains private local environment configuration such as the MongoDB connection string, API credentials, and business configuration and is excluded from GitHub through `.gitignore`.

The `.gitignore` file also prevents `node_modules` and other local development files from being committed to the repository.

The Google verification HTML file inside `public` is used by Google Search Console to verify ownership of the deployed Bower Company website.

The sitemap file provides search engines with information about the website's public pages to assist with indexing.

`Push to GitHub test 5` is a personal deployment-tracking file. It has no effect on the application and is used only to verify that new commits and pushes successfully reach the GitHub repository.

`README.md` documents the complete Bower Excavation Services project, including its services, frontend, backend, MongoDB/Mongoose database architecture, administrative dashboard, email integration, SEO configuration, testing system, deployment process, and project architecture.


# MongoDB Data Architecture

Customer requests are stored as MongoDB documents through the Mongoose `ContactRequest` model.

The schema supports the complete customer-management lifecycle:

```text
Customer submits request
        ↓
Express receives form
        ↓
Mongoose validates request
        ↓
MongoDB stores document
        ↓
Big Bull RON displays request
        ↓
Administrator responds
        ↓
Request can be marked responded/unanswered
        ↓
Administrator can soft-delete request
        ↓
Request moves to Recovery
        ↓
Administrator can restore request
        ↓
Request returns to Big Bull RON
```

This architecture allows customer information to remain persistent while providing the business with a simple administrative interface for managing requests.


# Soft Delete Architecture

Instead of permanently deleting MongoDB documents, customer requests use a soft-delete system.

A deleted request maintains its MongoDB document while changing its state:

```js
deleted: true
```

The deletion timestamp is stored using:

```js
deleted_at: Date
```

Restoring the request changes the document back to:

```js
deleted: false
```

and clears the deletion timestamp.

This allows deleted customer requests to be recovered without recreating the original submission.


# Response Tracking

Big Bull RON tracks whether each customer request has been answered.

New requests begin with:

```js
responded: false
```

After the administrator responds, the request can be changed to:

```js
responded: true
```

The application can also record the response date using:

```js
responded_at: Date
```

Requests can later be returned to unanswered status if additional follow-up is required.


# Deployment

The application is designed for deployment as a Node.js web service.

Production configuration is provided through environment variables rather than hard-coded credentials.

The application uses:

- Node.js
- Express.js
- MongoDB
- Mongoose
- EJS
- Web3Forms
- Environment variables
- Render cloud hosting
- GitHub source control

MongoDB provides persistent customer-request storage independently of the application server's local filesystem, making the database architecture appropriate for cloud deployment.


# Security & Configuration

Sensitive application information should never be committed directly into the repository.

Private values are stored through environment variables, including:

- MongoDB connection credentials
- Web3Forms access credentials
- Business configuration

The `.env` file should remain excluded through `.gitignore`.

Production environment variables should be configured directly through the hosting provider.


# Google Search Console

The website includes Google Search Console verification, allowing Google to verify ownership of the website, properly index public pages, and provide information about search performance, indexing coverage, and SEO health.


# Future Development

The application's MongoDB/Mongoose architecture provides room for future expansion.

Potential additions include:

- Administrator authentication
- Customer search
- Request filtering
- Pagination
- Additional request statuses
- Customer notes
- Project scheduling
- Job tracking
- Customer accounts
- Automated email responses
- Additional administrative reporting
- Expanded analytics
- Additional construction service pages


# Bower Company Construction

Bower Excavation Services provides a modern online platform for presenting Bower Company Construction's excavation, fire weed abatement, disking, vegetation management, brush clearing, mulching, and property improvement services.

The combination of a responsive customer-facing website, MongoDB-backed request management, email integration, automated testing, SEO configuration, and the Big Bull RON administrative dashboard creates a complete full-stack system for managing customer inquiries and supporting the company's online operations.
