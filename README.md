# Bower Excavation Services

Professional excavation, land improvement, and fire weed abatement website developed for **Bower Company Construction**.

This project is a complete full-stack web application built to provide customers with information about the company's excavation and vegetation management services while allowing visitors to submit quote requests that are securely stored, managed, and organized through an administrative dashboard. The application was designed with scalability, maintainability, performance, and responsive design in mind using modern JavaScript technologies and follows a clean MVC architecture.



# About The Project

Bower Excavation Services was built to modernize the company's online presence while providing an efficient customer management system behind the scenes. Beyond simply advertising services, the application functions as a complete customer request management platform.

Visitors can browse available services, learn about excavation and vegetation management, view project imagery, and submit service requests directly through an online contact form. Submitted requests are stored in a SQLite database and become immediately available inside the private administrative dashboard known as **Big Bull RON**, where customer inquiries can be reviewed, organized, restored, or managed without directly accessing the database.

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
- Modular database layer

---

## Database

Customer information is securely stored using:

- SQLite
- Prepared SQL statements
- Parameterized database queries
- Soft delete functionality
- Customer recovery system
- Administrative data management



# Administrative Dashboard

The application includes a fully custom administrative dashboard called **Big Bull RON**.

Features include:

- View all customer requests
- Track unanswered requests
- Mark requests as responded
- Reopen customer requests
- Soft delete customer submissions
- Recovery dashboard
- Restore deleted customer requests
- Deleted request counter
- Active request counter
- Organized customer management workflow



# Contact Request System

Visitors can submit project requests through an online contact form.

Features include:

- Customer name
- Email address
- Phone number
- Requested service
- Property address
- Customer message
- Automatic SQLite storage
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
- Database backup of every submitted request



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



# Testing

The application has been thoroughly tested using automated unit testing.

Testing technologies include:

- Jest
- Supertest

Current test coverage includes:

- Database operations
- Customer creation
- Customer retrieval
- Soft delete functionality
- Recovery system
- Restore functionality
- Administrative routes
- Express application routes
- Customer workflow testing
- Big Bull RON administrative testing

The project currently contains **51 passing automated unit tests**, helping ensure application stability as new features are added.



# Features

The application currently includes:

- Fully responsive website
- Bootstrap user interface
- Dynamic EJS templates
- Reusable partial components
- MVC architecture
- SQLite database
- Administrative dashboard
- Soft delete customer recovery
- Restore deleted requests
- Contact request management
- Email notifications
- Search engine optimization
- Google Search Console verification
- Environment variable configuration
- Git version control
- GitHub repository integration
- Render cloud deployment
- Automated unit testing
- Modular project organization
- Scalable code structure



# Project Structure

The project follows a clean full-stack, MVC-inspired folder organization separating the database, public assets, routes, automated tests, EJS views, administrative tools, configuration files, and application logic.

```text
excavation-website/
│
├── database/
│   └── bower_company.db
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
│   └── google58598e67e8a0915c.html
│
├── routes/
│   ├── contact.js
│   └── services.js
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
├── database.js
├── package-lock.json
├── package.json
├── Push to GitHub test 4
└── README.md
```

## Structure Overview

The `database` directory contains the SQLite database used to store customer quote requests, response status information, deleted request records, recovery information, and other Big Bull RON customer-management data.

The `public` directory contains all files that are served directly to the browser, including CSS stylesheets, JavaScript, website photographs, the Bower Company logo, and the Google Search Console HTML verification file.

The `routes` directory contains modular Express route files used to separate application routing responsibilities such as contact and service-related requests.

The `test` directory contains the automated Jest and Supertest test suites. `app.test.js` tests the Express application and routes, while `database.test.js` tests customer creation, retrieval, response status, deletion, restoration, counters, and the complete Big Bull RON recovery workflow.

The `views` directory contains the EJS frontend templates used to generate the website. Public pages include the home, contact, and services views.

The `views/admin` directory contains the Big Bull RON administrative dashboard and deleted-request recovery interface.

The `views/partials` directory contains reusable EJS components including the header, navigation bar, hero section, body content, gallery, footer, and JavaScript includes.

`app.js` is the main Express application and contains the application's middleware, page routing, customer submission processing, Big Bull RON routes, email integration, error handling, and server startup configuration.

`database.js` provides the SQLite database layer and contains the functions responsible for creating, reading, updating, soft-deleting, restoring, and counting customer requests.

`package.json` defines the Node.js application, production dependencies, development dependencies, Node version, startup commands, and automated testing commands. `package-lock.json` locks the exact dependency versions used by the application for reproducible installations and deployments.

`.env` contains private local environment configuration such as API credentials and business configuration and is excluded from GitHub through `.gitignore`. The `.gitignore` file also prevents `node_modules` and other local development files from being committed to the repository.

The Google verification HTML file inside `public` is used by Google Search Console to verify ownership of the deployed Bower Company website.

`Push to GitHub test 4` is a personal deployment-tracking file. It has no effect on the application and is used only to verify that new commits and pushes successfully reach the GitHub repository.

`README.md` documents the complete Bower Excavation Services project, including its services, frontend, backend, database, administrative dashboard, email integration, SEO configuration, testing system, deployment process, and project architecture.gh **Google Search Console**, allowing Google to properly index the website and monitor search performance, coverage, and SEO health over time.
