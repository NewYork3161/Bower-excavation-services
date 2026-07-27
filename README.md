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

The project follows a clean MVC-inspired folder organization:

```
excavation-website/
│
├── database/
├── public/
│   ├── css/
│   ├── images/
│   └── js/
│
├── routes/
├── test/
├── views/
│   ├── admin/
│   └── partials/
│
├── app.js
├── package.json
├── package-lock.json
├── .env
└── README.md
```

# Deployment

The application is deployed using **Render**, with source control managed through **GitHub**. Every deployment is version controlled and automatically built from the GitHub repository. Environment variables are securely managed outside the codebase, and the application has been configured for cloud deployment using Node.js, Express, SQLite, and Render's hosting infrastructure.

The project is also verified through **Google Search Console**, allowing Google to properly index the website and monitor search performance, coverage, and SEO health over time.
