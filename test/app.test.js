// ======================================================
// BOWER COMPANY CONSTRUCTION
// APPLICATION ROUTE TESTS
// test/app.test.js
// ======================================================


// ======================================================
// TEST ENVIRONMENT
// ======================================================

process.env.NODE_ENV = "test";


// ======================================================
// IMPORT SUPERTEST
// ======================================================

const request = require("supertest");


// ======================================================
// MOCK DATABASE
// ======================================================
//
// IMPORTANT:
//
// app.js imports functions from:
//
// ../database
//
// We mock those functions so these tests NEVER modify
// the real Bower Company SQLite database.
//
// ======================================================

jest.mock(
    "../database",
    () => ({

        createContactRequest:
            jest.fn(),

        getAllContactRequests:
            jest.fn(),

        getContactRequestById:
            jest.fn(),

        markRequestResponded:
            jest.fn(),

        markRequestUnanswered:
            jest.fn(),

        deleteContactRequest:
            jest.fn(),

        getDeletedContactRequests:
            jest.fn(),

        restoreContactRequest:
            jest.fn(),

        getUnansweredCount:
            jest.fn(),

        getDeletedCount:
            jest.fn()

    })
);


// ======================================================
// IMPORT MOCKED DATABASE FUNCTIONS
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

} = require("../database");


// ======================================================
// IMPORT EXPRESS APPLICATION
// ======================================================
//
// app.js will need:
//
// module.exports = app;
//
// before this test file can run.
//
// ======================================================

const app = require("../app");


// ======================================================
// RESET MOCKS BEFORE EVERY TEST
// ======================================================

beforeEach(() => {

    jest.clearAllMocks();

});


// ======================================================
// HOME PAGE
// ======================================================

describe(
    "GET /",
    () => {

        test(
            "should load the home page",
            async () => {

                const response =
                    await request(app)
                        .get("/");

                expect(
                    response.statusCode
                ).toBe(200);

            }
        );

    }
);


// ======================================================
// SERVICES PAGE
// ======================================================

describe(
    "GET /services",
    () => {

        test(
            "should load the services page",
            async () => {

                const response =
                    await request(app)
                        .get("/services");

                expect(
                    response.statusCode
                ).toBe(200);

                expect(
                    response.text
                ).toContain(
                    "Our Services"
                );

            }
        );

    }
);


// ======================================================
// CONTACT PAGE
// ======================================================

describe(
    "GET /contact",
    () => {

        test(
            "should load the contact page",
            async () => {

                const response =
                    await request(app)
                        .get("/contact");

                expect(
                    response.statusCode
                ).toBe(200);

                expect(
                    response.text
                ).toContain(
                    "Contact Bower Company"
                );

            }
        );


        test(
            "should display success message when success=true",
            async () => {

                const response =
                    await request(app)
                        .get(
                            "/contact?success=true"
                        );

                expect(
                    response.statusCode
                ).toBe(200);

                expect(
                    response.text
                ).toContain(
                    "Thank you!"
                );

            }
        );


        test(
            "should display error message when error=true",
            async () => {

                const response =
                    await request(app)
                        .get(
                            "/contact?error=true"
                        );

                expect(
                    response.statusCode
                ).toBe(200);

                expect(
                    response.text
                ).toContain(
                    "Something went wrong."
                );

            }
        );

    }
);


// ======================================================
// CONTACT FORM VALIDATION
// ======================================================

describe(
    "POST /contact validation",
    () => {

        test(
            "should reject a request with no name",
            async () => {

                const response =
                    await request(app)
                        .post("/contact")
                        .type("form")
                        .send({

                            email:
                                "customer@example.com",

                            message:
                                "I need property clearing."

                        });

                expect(
                    response.statusCode
                ).toBe(302);

                expect(
                    response.headers.location
                ).toBe(
                    "/contact?error=true"
                );

                expect(
                    createContactRequest
                ).not.toHaveBeenCalled();

            }
        );


        test(
            "should reject a request with no email",
            async () => {

                const response =
                    await request(app)
                        .post("/contact")
                        .type("form")
                        .send({

                            name:
                                "Test Customer",

                            message:
                                "I need disking."

                        });

                expect(
                    response.statusCode
                ).toBe(302);

                expect(
                    response.headers.location
                ).toBe(
                    "/contact?error=true"
                );

                expect(
                    createContactRequest
                ).not.toHaveBeenCalled();

            }
        );


        test(
            "should reject a request with no message",
            async () => {

                const response =
                    await request(app)
                        .post("/contact")
                        .type("form")
                        .send({

                            name:
                                "Test Customer",

                            email:
                                "customer@example.com"

                        });

                expect(
                    response.statusCode
                ).toBe(302);

                expect(
                    response.headers.location
                ).toBe(
                    "/contact?error=true"
                );

                expect(
                    createContactRequest
                ).not.toHaveBeenCalled();

            }
        );

    }
);


// ======================================================
// HONEYPOT SPAM PROTECTION
// ======================================================

describe(
    "POST /contact spam protection",
    () => {

        test(
            "should block honeypot submissions",
            async () => {

                const response =
                    await request(app)
                        .post("/contact")
                        .type("form")
                        .send({

                            name:
                                "Spam Bot",

                            email:
                                "spam@example.com",

                            message:
                                "Spam message",

                            website:
                                "https://spam.example.com"

                        });

                expect(
                    response.statusCode
                ).toBe(302);

                expect(
                    response.headers.location
                ).toBe(
                    "/contact?success=true"
                );

                expect(
                    createContactRequest
                ).not.toHaveBeenCalled();

            }
        );

    }
);


// ======================================================
// VALID CONTACT REQUEST
// ======================================================

describe(
    "POST /contact",
    () => {

        test(
            "should save a valid customer request",
            async () => {

                createContactRequest
                    .mockResolvedValue({

                        id: 1,

                        name:
                            "John Smith",

                        email:
                            "john@example.com",

                        phone:
                            "9255551234",

                        service:
                            "Disking",

                        propertyAddress:
                            "123 Test Road",

                        message:
                            "I need my property disked.",

                        responded:
                            false,

                        deleted:
                            false

                    });


                const response =
                    await request(app)
                        .post("/contact")
                        .type("form")
                        .send({

                            name:
                                " John Smith ",

                            email:
                                " john@example.com ",

                            phone:
                                " 9255551234 ",

                            service:
                                " Disking ",

                            property_address:
                                " 123 Test Road ",

                            message:
                                " I need my property disked. ",

                            website:
                                ""

                        });


                expect(
                    response.statusCode
                ).toBe(302);


                expect(
                    response.headers.location
                ).toBe(
                    "/contact?success=true"
                );


                expect(
                    createContactRequest
                ).toHaveBeenCalledTimes(1);


                expect(
                    createContactRequest
                ).toHaveBeenCalledWith({

                    name:
                        "John Smith",

                    email:
                        "john@example.com",

                    phone:
                        "9255551234",

                    service:
                        "Disking",

                    propertyAddress:
                        "123 Test Road",

                    message:
                        "I need my property disked."

                });

            }
        );

    }
);


// ======================================================
// BIG BULL RON DASHBOARD
// ======================================================

describe(
    "GET /BigBullRON",
    () => {

        test(
            "should load customer requests",
            async () => {

                getAllContactRequests
                    .mockResolvedValue([
                        {

                            id: 1,

                            name:
                                "Test Customer",

                            email:
                                "customer@example.com",

                            phone:
                                "9255551234",

                            service:
                                "Fire Weed Abatement",

                            property_address:
                                "123 Test Road",

                            message:
                                "Please clear my property.",

                            responded:
                                0,

                            deleted:
                                0

                        }
                    ]);


                getUnansweredCount
                    .mockResolvedValue(1);


                getDeletedCount
                    .mockResolvedValue(0);


                const response =
                    await request(app)
                        .get(
                            "/BigBullRON"
                        );


                expect(
                    response.statusCode
                ).toBe(200);


                expect(
                    response.text
                ).toContain(
                    "Test Customer"
                );


                expect(
                    response.text
                ).toContain(
                    "customer@example.com"
                );


                expect(
                    getAllContactRequests
                ).toHaveBeenCalledTimes(1);


                expect(
                    getUnansweredCount
                ).toHaveBeenCalledTimes(1);


                expect(
                    getDeletedCount
                ).toHaveBeenCalledTimes(1);

            }
        );


        test(
            "should show empty state when there are no requests",
            async () => {

                getAllContactRequests
                    .mockResolvedValue([]);


                getUnansweredCount
                    .mockResolvedValue(0);


                getDeletedCount
                    .mockResolvedValue(0);


                const response =
                    await request(app)
                        .get(
                            "/BigBullRON"
                        );


                expect(
                    response.statusCode
                ).toBe(200);


                expect(
                    response.text
                ).toContain(
                    "No Customer Requests"
                );

            }
        );

    }
);


// ======================================================
// MARK CUSTOMER RESPONDED
// ======================================================

describe(
    "POST /BigBullRON/responded/:id",
    () => {

        test(
            "should mark a customer request responded",
            async () => {

                getContactRequestById
                    .mockResolvedValue({

                        id: 1,

                        name:
                            "Test Customer",

                        deleted:
                            0

                    });


                markRequestResponded
                    .mockResolvedValue({

                        id: 1,

                        responded:
                            true,

                        changes:
                            1

                    });


                const response =
                    await request(app)
                        .post(
                            "/BigBullRON/responded/1"
                        );


                expect(
                    response.statusCode
                ).toBe(302);


                expect(
                    response.headers.location
                ).toBe(
                    "/BigBullRON"
                );


                expect(
                    markRequestResponded
                ).toHaveBeenCalledWith(1);

            }
        );


        test(
            "should reject an invalid request ID",
            async () => {

                const response =
                    await request(app)
                        .post(
                            "/BigBullRON/responded/not-a-number"
                        );


                expect(
                    response.statusCode
                ).toBe(400);


                expect(
                    markRequestResponded
                ).not.toHaveBeenCalled();

            }
        );

    }
);


// ======================================================
// MARK CUSTOMER UNANSWERED
// ======================================================

describe(
    "POST /BigBullRON/unanswered/:id",
    () => {

        test(
            "should reopen a responded customer request",
            async () => {

                getContactRequestById
                    .mockResolvedValue({

                        id: 1,

                        deleted:
                            0

                    });


                markRequestUnanswered
                    .mockResolvedValue({

                        id: 1,

                        responded:
                            false,

                        changes:
                            1

                    });


                const response =
                    await request(app)
                        .post(
                            "/BigBullRON/unanswered/1"
                        );


                expect(
                    response.statusCode
                ).toBe(302);


                expect(
                    response.headers.location
                ).toBe(
                    "/BigBullRON"
                );


                expect(
                    markRequestUnanswered
                ).toHaveBeenCalledWith(1);

            }
        );

    }
);


// ======================================================
// DELETE CUSTOMER REQUEST
// ======================================================

describe(
    "POST /BigBullRON/delete/:id",
    () => {

        test(
            "should soft delete a customer request",
            async () => {

                getContactRequestById
                    .mockResolvedValue({

                        id: 1,

                        name:
                            "Test Customer",

                        deleted:
                            0

                    });


                deleteContactRequest
                    .mockResolvedValue({

                        id: 1,

                        deleted:
                            true,

                        changes:
                            1

                    });


                const response =
                    await request(app)
                        .post(
                            "/BigBullRON/delete/1"
                        );


                expect(
                    response.statusCode
                ).toBe(302);


                expect(
                    response.headers.location
                ).toBe(
                    "/BigBullRON"
                );


                expect(
                    deleteContactRequest
                ).toHaveBeenCalledWith(1);

            }
        );


        test(
            "should return 404 when customer does not exist",
            async () => {

                getContactRequestById
                    .mockResolvedValue(
                        undefined
                    );


                const response =
                    await request(app)
                        .post(
                            "/BigBullRON/delete/999"
                        );


                expect(
                    response.statusCode
                ).toBe(404);


                expect(
                    deleteContactRequest
                ).not.toHaveBeenCalled();

            }
        );


        test(
            "should reject invalid delete ID",
            async () => {

                const response =
                    await request(app)
                        .post(
                            "/BigBullRON/delete/abc"
                        );


                expect(
                    response.statusCode
                ).toBe(400);


                expect(
                    deleteContactRequest
                ).not.toHaveBeenCalled();

            }
        );

    }
);


// ======================================================
// RECOVER DELETED REQUESTS PAGE
// ======================================================

describe(
    "GET /BigBullRON/recover",
    () => {

        test(
            "should load deleted customer requests",
            async () => {

                getDeletedContactRequests
                    .mockResolvedValue([
                        {

                            id: 2,

                            name:
                                "Deleted Customer",

                            email:
                                "deleted@example.com",

                            phone:
                                "9255555678",

                            service:
                                "Brush Clearing",

                            property_address:
                                "456 Recovery Road",

                            message:
                                "Please clear the brush.",

                            responded:
                                0,

                            deleted:
                                1,

                            deleted_at:
                                "2026-07-27 12:00:00"

                        }
                    ]);


                getDeletedCount
                    .mockResolvedValue(1);


                const response =
                    await request(app)
                        .get(
                            "/BigBullRON/recover"
                        );


                expect(
                    response.statusCode
                ).toBe(200);


                expect(
                    response.text
                ).toContain(
                    "Recover Deleted Requests"
                );


                expect(
                    response.text
                ).toContain(
                    "Deleted Customer"
                );


                expect(
                    response.text
                ).toContain(
                    "deleted@example.com"
                );


                expect(
                    getDeletedContactRequests
                ).toHaveBeenCalledTimes(1);


                expect(
                    getDeletedCount
                ).toHaveBeenCalledTimes(1);

            }
        );


        test(
            "should show empty recovery state",
            async () => {

                getDeletedContactRequests
                    .mockResolvedValue([]);


                getDeletedCount
                    .mockResolvedValue(0);


                const response =
                    await request(app)
                        .get(
                            "/BigBullRON/recover"
                        );


                expect(
                    response.statusCode
                ).toBe(200);


                expect(
                    response.text
                ).toContain(
                    "No Deleted Requests"
                );

            }
        );

    }
);


// ======================================================
// RESTORE CUSTOMER REQUEST
// ======================================================

describe(
    "POST /BigBullRON/restore/:id",
    () => {

        test(
            "should restore a deleted customer request",
            async () => {

                getContactRequestById
                    .mockResolvedValue({

                        id: 2,

                        name:
                            "Deleted Customer",

                        deleted:
                            1

                    });


                restoreContactRequest
                    .mockResolvedValue({

                        id: 2,

                        restored:
                            true,

                        changes:
                            1

                    });


                const response =
                    await request(app)
                        .post(
                            "/BigBullRON/restore/2"
                        );


                expect(
                    response.statusCode
                ).toBe(302);


                expect(
                    response.headers.location
                ).toBe(
                    "/BigBullRON/recover"
                );


                expect(
                    restoreContactRequest
                ).toHaveBeenCalledWith(2);

            }
        );


        test(
            "should return 404 when restore request does not exist",
            async () => {

                getContactRequestById
                    .mockResolvedValue(
                        undefined
                    );


                const response =
                    await request(app)
                        .post(
                            "/BigBullRON/restore/999"
                        );


                expect(
                    response.statusCode
                ).toBe(404);


                expect(
                    restoreContactRequest
                ).not.toHaveBeenCalled();

            }
        );


        test(
            "should reject invalid restore ID",
            async () => {

                const response =
                    await request(app)
                        .post(
                            "/BigBullRON/restore/abc"
                        );


                expect(
                    response.statusCode
                ).toBe(400);


                expect(
                    restoreContactRequest
                ).not.toHaveBeenCalled();

            }
        );

    }
);


// ======================================================
// DATABASE ERROR HANDLING
// ======================================================

describe(
    "Database error handling",
    () => {

        test(
            "Big Bull RON should return 500 when database fails",
            async () => {

                getAllContactRequests
                    .mockRejectedValue(
                        new Error(
                            "Test database failure"
                        )
                    );


                const response =
                    await request(app)
                        .get(
                            "/BigBullRON"
                        );


                expect(
                    response.statusCode
                ).toBe(500);


                expect(
                    response.text
                ).toContain(
                    "Unable to load Big Bull Ron."
                );

            }
        );


        test(
            "recovery page should return 500 when database fails",
            async () => {

                getDeletedContactRequests
                    .mockRejectedValue(
                        new Error(
                            "Test database failure"
                        )
                    );


                const response =
                    await request(app)
                        .get(
                            "/BigBullRON/recover"
                        );


                expect(
                    response.statusCode
                ).toBe(500);


                expect(
                    response.text
                ).toContain(
                    "Unable to load deleted customer requests."
                );

            }
        );

    }
);


// ======================================================
// 404 PAGE
// ======================================================

describe(
    "404 handler",
    () => {

        test(
            "should return 404 for unknown routes",
            async () => {

                const response =
                    await request(app)
                        .get(
                            "/this-route-does-not-exist"
                        );


                expect(
                    response.statusCode
                ).toBe(404);


                expect(
                    response.text
                ).toContain(
                    "404 - Page Not Found"
                );

            }
        );

    }
);