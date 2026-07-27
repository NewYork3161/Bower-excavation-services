// ======================================================
// BOWER COMPANY CONSTRUCTION
// MAIN APPLICATION FILE
// app.js
// ======================================================


// ======================================================
// IMPORT PACKAGES
// ======================================================

const express = require("express");
const path = require("path");
const methodOverride = require("method-override");

require("dotenv").config();


// ======================================================
// DATABASE
// ======================================================

const {
    createContactRequest,
    getAllContactRequests,
    getContactRequestById,
    markRequestResponded,
    markRequestUnanswered,
    deleteContactRequest,
    getDeletedContactRequests,
    restoreContactRequest,
    getUnansweredCount,
    getDeletedCount
} = require("./database");


// ======================================================
// CREATE EXPRESS APPLICATION
// ======================================================

const app = express();


// ======================================================
// PORT
// ======================================================

const PORT = process.env.PORT || 3000;


// ======================================================
// VIEW ENGINE
// ======================================================

app.set("view engine", "ejs");

app.set(
    "views",
    path.join(__dirname, "views")
);


// ======================================================
// STATIC FILES
// ======================================================

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);


// ======================================================
// MIDDLEWARE
// ======================================================

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(
    express.json()
);


// ======================================================
// METHOD OVERRIDE
// ======================================================

app.use(
    methodOverride("_method")
);


// ======================================================
// HOME PAGE
// ======================================================

app.get(
    "/",
    (req, res) => {

        res.render("home");

    }
);


// ======================================================
// SERVICES PAGE
// ======================================================

app.get(
    "/services",
    (req, res) => {

        res.render("services");

    }
);


// ======================================================
// CONTACT PAGE - GET
// ======================================================

app.get(
    "/contact",
    (req, res) => {

        res.render(
            "contact",
            {

                web3formsAccessKey:
                    process.env.WEB3FORMS_ACCESS_KEY,

                businessEmail:
                    process.env.BUSINESS_EMAIL,

                businessPhone:
                    process.env.BUSINESS_PHONE,

                success:
                    req.query.success === "true",

                error:
                    req.query.error === "true"

            }
        );

    }
);


// ======================================================
// CONTACT PAGE - POST
// ======================================================
//
// CUSTOMER
//      ↓
// CONTACT FORM
//      ↓
// SQLITE DATABASE
//      ↓
// BIG BULL RON
//
// ALSO:
//
// CUSTOMER
//      ↓
// CONTACT FORM
//      ↓
// WEB3FORMS
//      ↓
// BOWER COMPANY EMAIL
//
// ======================================================

app.post(
    "/contact",
    async (req, res) => {

        try {


            // ==========================================
            // GET FORM INFORMATION
            // ==========================================

            const {

                name,
                email,
                phone,
                service,
                property_address,
                message,
                website

            } = req.body;


            // ==========================================
            // HONEYPOT SPAM CHECK
            // ==========================================

            if (website) {

                console.log(
                    "Spam submission blocked."
                );

                return res.redirect(
                    "/contact?success=true"
                );

            }


            // ==========================================
            // BASIC VALIDATION
            // ==========================================

            if (
                !name ||
                !email ||
                !message
            ) {

                console.log(
                    "Contact form missing required fields."
                );

                return res.redirect(
                    "/contact?error=true"
                );

            }


            // ==========================================
            // CLEAN CUSTOMER DATA
            // ==========================================

            const cleanName =
                name.trim();

            const cleanEmail =
                email.trim();

            const cleanPhone =
                phone
                    ? phone.trim()
                    : null;

            const cleanService =
                service
                    ? service.trim()
                    : null;

            const cleanPropertyAddress =
                property_address
                    ? property_address.trim()
                    : null;

            const cleanMessage =
                message.trim();


            // ==========================================
            // SAVE CUSTOMER TO SQLITE
            // ==========================================

            const savedRequest =
                await createContactRequest({

                    name:
                        cleanName,

                    email:
                        cleanEmail,

                    phone:
                        cleanPhone,

                    service:
                        cleanService,

                    propertyAddress:
                        cleanPropertyAddress,

                    message:
                        cleanMessage

                });


            console.log("");
            console.log(
                "======================================"
            );

            console.log(
                " NEW CUSTOMER REQUEST"
            );

            console.log(
                "======================================"
            );

            console.log(
                ` Request ID: ${savedRequest.id}`
            );

            console.log(
                ` Customer: ${cleanName}`
            );

            console.log(
                ` Email: ${cleanEmail}`
            );

            console.log(
                "======================================"
            );

            console.log("");


            // ==========================================
            // WEB3FORMS ACCESS KEY
            // ==========================================

            const web3formsAccessKey =
                process.env.WEB3FORMS_ACCESS_KEY;


            // ==========================================
            // SEND BUSINESS NOTIFICATION
            // ==========================================

            if (!web3formsAccessKey) {

                console.error(
                    "WEB3FORMS_ACCESS_KEY is missing."
                );

            } else {

                try {

                    const web3formsResponse =
                        await fetch(
                            "https://api.web3forms.com/submit",
                            {

                                method:
                                    "POST",

                                headers: {

                                    "Content-Type":
                                        "application/json",

                                    Accept:
                                        "application/json"

                                },

                                body:
                                    JSON.stringify({

                                        access_key:
                                            web3formsAccessKey,

                                        subject:
                                            "New Bower Company Quote Request",

                                        from_name:
                                            "Bower Company Website",

                                        name:
                                            cleanName,

                                        email:
                                            cleanEmail,

                                        phone:
                                            cleanPhone ||
                                            "Not provided",

                                        service:
                                            cleanService ||
                                            "Not provided",

                                        property_address:
                                            cleanPropertyAddress ||
                                            "Not provided",

                                        message:
                                            cleanMessage

                                    })

                            }
                        );


                    // ==================================
                    // READ WEB3FORMS RESPONSE
                    // ==================================

                    const web3formsResult =
                        await web3formsResponse.json();


                    // ==================================
                    // WEB3FORMS SUCCESS
                    // ==================================

                    if (
                        web3formsResponse.ok &&
                        web3formsResult.success
                    ) {

                        console.log(
                            "Web3Forms email sent successfully."
                        );

                    }


                    // ==================================
                    // WEB3FORMS FAILURE
                    // ==================================

                    else {

                        console.error(
                            "Web3Forms failed:",
                            web3formsResult
                        );

                    }


                } catch (emailError) {

                    console.error(
                        "Web3Forms email error:",
                        emailError
                    );

                }

            }


            // ==========================================
            // CONTACT FORM SUCCESS
            // ==========================================

            return res.redirect(
                "/contact?success=true"
            );


        } catch (error) {


            console.error("");

            console.error(
                "======================================"
            );

            console.error(
                " CONTACT FORM ERROR"
            );

            console.error(
                "======================================"
            );

            console.error(error);

            console.error(
                "======================================"
            );

            console.error("");


            return res.redirect(
                "/contact?error=true"
            );

        }

    }
);


// ======================================================
// BIG BULL RON
// ======================================================
//
// LOCAL:
//
// http://localhost:3000/BigBullRON
//
// RENDER:
//
// https://bower-excavation-services.onrender.com/BigBullRON
//
// ======================================================

app.get(
    "/BigBullRON",
    async (req, res) => {

        try {


            // ==========================================
            // LOAD ACTIVE CUSTOMER REQUESTS
            // ==========================================

            const submissions =
                await getAllContactRequests();


            // ==========================================
            // GET NEW REQUEST COUNT
            // ==========================================

            const unansweredCount =
                await getUnansweredCount();


            // ==========================================
            // GET DELETED REQUEST COUNT
            // ==========================================

            const deletedCount =
                await getDeletedCount();


            // ==========================================
            // DISPLAY BIG BULL RON
            // ==========================================

            return res.render(
                "admin/big_bull_ron",
                {

                    submissions:
                        submissions,

                    unansweredCount:
                        unansweredCount,

                    deletedCount:
                        deletedCount

                }
            );


        } catch (error) {


            console.error("");

            console.error(
                "======================================"
            );

            console.error(
                " BIG BULL RON ERROR"
            );

            console.error(
                "======================================"
            );

            console.error(error);

            console.error(
                "======================================"
            );

            console.error("");


            return res
                .status(500)
                .send(
                    "Unable to load Big Bull Ron."
                );

        }

    }
);


// ======================================================
// MARK CUSTOMER REQUEST RESPONDED
// ======================================================
//
// Gmail itself cannot tell this Express application
// whether Ron actually clicked Send.
//
// Therefore this route is used when Ron manually confirms
// that the customer has been answered.
//
// ======================================================

app.post(
    "/BigBullRON/responded/:id",
    async (req, res) => {

        try {

            const requestId =
                Number(req.params.id);


            if (!Number.isInteger(requestId)) {

                return res
                    .status(400)
                    .send(
                        "Invalid customer request."
                    );

            }


            const request =
                await getContactRequestById(
                    requestId
                );


            if (
                !request ||
                request.deleted
            ) {

                return res
                    .status(404)
                    .send(
                        "Customer request not found."
                    );

            }


            await markRequestResponded(
                requestId
            );


            return res.redirect(
                "/BigBullRON"
            );


        } catch (error) {

            console.error(
                "Error marking request responded:",
                error
            );


            return res
                .status(500)
                .send(
                    "Unable to mark request responded."
                );

        }

    }
);


// ======================================================
// MARK CUSTOMER REQUEST UNANSWERED
// ======================================================
//
// This allows a request to be reopened if necessary.
//
// ======================================================

app.post(
    "/BigBullRON/unanswered/:id",
    async (req, res) => {

        try {

            const requestId =
                Number(req.params.id);


            if (!Number.isInteger(requestId)) {

                return res
                    .status(400)
                    .send(
                        "Invalid customer request."
                    );

            }


            const request =
                await getContactRequestById(
                    requestId
                );


            if (
                !request ||
                request.deleted
            ) {

                return res
                    .status(404)
                    .send(
                        "Customer request not found."
                    );

            }


            await markRequestUnanswered(
                requestId
            );


            return res.redirect(
                "/BigBullRON"
            );


        } catch (error) {

            console.error(
                "Error reopening request:",
                error
            );


            return res
                .status(500)
                .send(
                    "Unable to reopen request."
                );

        }

    }
);


// ======================================================
// DELETE CUSTOMER REQUEST
// ======================================================
//
// IMPORTANT:
//
// This is a SOFT DELETE.
//
// The SQLite row remains in the database.
//
// deleted = 1
//
// The customer request can therefore be restored from:
//
// /BigBullRON/recover
//
// ======================================================

app.post(
    "/BigBullRON/delete/:id",
    async (req, res) => {

        try {

            const requestId =
                Number(req.params.id);


            if (!Number.isInteger(requestId)) {

                return res
                    .status(400)
                    .send(
                        "Invalid customer request."
                    );

            }


            const request =
                await getContactRequestById(
                    requestId
                );


            if (!request) {

                return res
                    .status(404)
                    .send(
                        "Customer request not found."
                    );

            }


            await deleteContactRequest(
                requestId
            );


            console.log(
                `Customer request ${requestId} moved to recovery.`
            );


            return res.redirect(
                "/BigBullRON"
            );


        } catch (error) {

            console.error(
                "Error deleting customer request:",
                error
            );


            return res
                .status(500)
                .send(
                    "Unable to delete customer request."
                );

        }

    }
);


// ======================================================
// RECOVER DELETED FILES PAGE
// ======================================================
//
// LOCAL:
//
// http://localhost:3000/BigBullRON/recover
//
// EJS:
//
// views/admin/big_bull_ron_recover.ejs
//
// ======================================================

app.get(
    "/BigBullRON/recover",
    async (req, res) => {

        try {


            // ==========================================
            // LOAD DELETED REQUESTS
            // ==========================================

            const deletedSubmissions =
                await getDeletedContactRequests();


            // ==========================================
            // GET DELETED COUNT
            // ==========================================

            const deletedCount =
                await getDeletedCount();


            // ==========================================
            // DISPLAY RECOVERY PAGE
            // ==========================================

            return res.render(
                "admin/big_bull_ron_recover",
                {

                    deletedSubmissions:
                        deletedSubmissions,

                    deletedCount:
                        deletedCount

                }
            );


        } catch (error) {

            console.error(
                "Big Bull Ron recovery page error:",
                error
            );


            return res
                .status(500)
                .send(
                    "Unable to load deleted customer requests."
                );

        }

    }
);


// ======================================================
// RESTORE DELETED CUSTOMER REQUEST
// ======================================================

app.post(
    "/BigBullRON/restore/:id",
    async (req, res) => {

        try {

            const requestId =
                Number(req.params.id);


            if (!Number.isInteger(requestId)) {

                return res
                    .status(400)
                    .send(
                        "Invalid customer request."
                    );

            }


            const request =
                await getContactRequestById(
                    requestId
                );


            if (!request) {

                return res
                    .status(404)
                    .send(
                        "Customer request not found."
                    );

            }


            await restoreContactRequest(
                requestId
            );


            console.log(
                `Customer request ${requestId} restored.`
            );


            return res.redirect(
                "/BigBullRON/recover"
            );


        } catch (error) {

            console.error(
                "Error restoring customer request:",
                error
            );


            return res
                .status(500)
                .send(
                    "Unable to restore customer request."
                );

        }

    }
);


// ======================================================
// IMPORTANT - GMAIL RESPONSE SYSTEM
// ======================================================
//
// Big Bull RON does NOT send the response itself.
//
// The Send Response button in big_bull_ron.ejs opens
// Gmail and inserts the customer's email address.
//
// Gmail handles the outgoing email.
//
// The website therefore cannot automatically verify
// that Gmail actually sent the message.
//
// The Responded state must be confirmed separately.
//
// ======================================================


// ======================================================
// 404 - PAGE NOT FOUND
// ======================================================
//
// MUST REMAIN BELOW EVERY OTHER ROUTE.
//
// ======================================================

app.use(
    (req, res) => {

        res
            .status(404)
            .send(
                "404 - Page Not Found"
            );

    }
);


// ======================================================
// START SERVER
// ======================================================
//
// IMPORTANT:
//
// When this file is started directly:
//
// npm start
//
// Node starts the real Express server.
//
// When Jest / Supertest imports this file:
//
// const app = require("../app");
//
// the server is NOT started automatically.
// Supertest receives the Express application instead.
//
// ======================================================

if (require.main === module) {

    app.listen(
        PORT,
        () => {


            console.log("");

            console.log(
                "======================================"
            );

            console.log(
                " Bower Company Construction"
            );

            console.log(
                "======================================"
            );

            console.log(
                ` Server running on port ${PORT}`
            );

            console.log(
                ` Local: http://localhost:${PORT}`
            );

            console.log(
                ` Contact: http://localhost:${PORT}/contact`
            );

            console.log(
                ` Big Bull Ron: http://localhost:${PORT}/BigBullRON`
            );

            console.log(
                ` Recovery: http://localhost:${PORT}/BigBullRON/recover`
            );

            console.log(
                "======================================"
            );

            console.log("");


        }
    );

}


// ======================================================
// EXPORT EXPRESS APPLICATION FOR UNIT TESTING
// ======================================================
//
// This allows:
//
// test/app.test.js
//
// to use:
//
// const app = require("../app");
//
// without starting another server.
//
// ======================================================

module.exports = app;