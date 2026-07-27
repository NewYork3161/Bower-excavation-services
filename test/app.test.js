// ======================================================
// BOWER COMPANY CONSTRUCTION
// APPLICATION ROUTE TESTS
// test/app.test.js
// MONGODB / MONGOOSE VERSION
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
// TEST MONGODB OBJECT IDS
// ======================================================
//
// These are valid MongoDB ObjectId strings.
//
// No real MongoDB documents are created.
//
// The Mongoose ContactRequest model is mocked throughout
// this test file so these tests NEVER modify the real
// Bower Company MongoDB Atlas database.
//
// ======================================================

const ACTIVE_REQUEST_ID =
    "507f1f77bcf86cd799439011";

const DELETED_REQUEST_ID =
    "507f1f77bcf86cd799439012";

const MISSING_REQUEST_ID =
    "507f1f77bcf86cd799439099";


// ======================================================
// MOCK CONTACT REQUEST MONGOOSE MODEL
// ======================================================
//
// app.js now imports:
//
// ./models/ContactRequest
//
// There is NO database.js file anymore.
//
// These route tests mock the Mongoose model directly.
//
// ======================================================

jest.mock(
    "../models/ContactRequest",
    () => ({

        create:
            jest.fn(),

        find:
            jest.fn(),

        findById:
            jest.fn(),

        findByIdAndUpdate:
            jest.fn(),

        countDocuments:
            jest.fn()

    })
);


// ======================================================
// IMPORT MOCKED MONGOOSE MODEL
// ======================================================

const ContactRequest =
    require("../models/ContactRequest");


// ======================================================
// IMPORT EXPRESS APPLICATION
// ======================================================

const app =
    require("../app");


// ======================================================
// MOCK FETCH / WEB3FORMS
// ======================================================
//
// Valid contact submissions also attempt to notify
// Bower Company through Web3Forms.
//
// Tests must never make a real external HTTP request.
//
// ======================================================

global.fetch =
    jest.fn();


// ======================================================
// MONGOOSE QUERY HELPERS
// ======================================================
//
// app.js uses:
//
// ContactRequest.find(...).sort(...)
//
// These helpers make the mocked model behave like the
// Mongoose query chain used by app.js.
//
// ======================================================

function mockFindWithSort(result) {

    const sort =
        jest.fn()
            .mockResolvedValue(
                result
            );


    ContactRequest.find
        .mockReturnValue({

            sort:
                sort

        });


    return sort;

}


// ======================================================
// RESET MOCKS BEFORE EVERY TEST
// ======================================================

beforeEach(() => {

    jest.clearAllMocks();


    global.fetch
        .mockResolvedValue({

            ok:
                true,

            json:
                jest.fn()
                    .mockResolvedValue({

                        success:
                            true

                    })

        });

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
                    ContactRequest.create
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
                    ContactRequest.create
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
                    ContactRequest.create
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
                    ContactRequest.create
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
            "should save a valid customer request to MongoDB",
            async () => {

                ContactRequest.create
                    .mockResolvedValue({

                        _id:
                            ACTIVE_REQUEST_ID,

                        id:
                            ACTIVE_REQUEST_ID,

                        name:
                            "John Smith",

                        email:
                            "john@example.com",

                        phone:
                            "9255551234",

                        service:
                            "Disking",

                        property_address:
                            "123 Test Road",

                        message:
                            "I need my property disked.",

                        responded:
                            false,

                        responded_at:
                            null,

                        deleted:
                            false,

                        deleted_at:
                            null,

                        createdAt:
                            new Date(
                                "2026-07-27T12:00:00.000Z"
                            ),

                        updatedAt:
                            new Date(
                                "2026-07-27T12:00:00.000Z"
                            )

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
                    ContactRequest.create
                ).toHaveBeenCalledTimes(1);


                expect(
                    ContactRequest.create
                ).toHaveBeenCalledWith({

                    name:
                        "John Smith",

                    email:
                        "john@example.com",

                    phone:
                        "9255551234",

                    service:
                        "Disking",

                    property_address:
                        "123 Test Road",

                    message:
                        "I need my property disked."

                });

            }
        );


        test(
            "should save optional fields as null when not provided",
            async () => {

                ContactRequest.create
                    .mockResolvedValue({

                        _id:
                            ACTIVE_REQUEST_ID,

                        id:
                            ACTIVE_REQUEST_ID,

                        name:
                            "Jane Customer",

                        email:
                            "jane@example.com",

                        phone:
                            null,

                        service:
                            null,

                        property_address:
                            null,

                        message:
                            "Please contact me.",

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
                                "Jane Customer",

                            email:
                                "jane@example.com",

                            message:
                                "Please contact me.",

                            website:
                                ""

                        });


                expect(
                    response.statusCode
                ).toBe(302);


                expect(
                    ContactRequest.create
                ).toHaveBeenCalledWith({

                    name:
                        "Jane Customer",

                    email:
                        "jane@example.com",

                    phone:
                        null,

                    service:
                        null,

                    property_address:
                        null,

                    message:
                        "Please contact me."

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
            "should load active MongoDB customer requests",
            async () => {

                mockFindWithSort([
                    {

                        _id:
                            ACTIVE_REQUEST_ID,

                        id:
                            ACTIVE_REQUEST_ID,

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
                            false,

                        responded_at:
                            null,

                        deleted:
                            false,

                        deleted_at:
                            null,

                        createdAt:
                            new Date(
                                "2026-07-27T12:00:00.000Z"
                            )

                    }
                ]);


                ContactRequest.countDocuments
                    .mockResolvedValueOnce(1)
                    .mockResolvedValueOnce(0);


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
                    response.text
                ).toContain(
                    "123 Test Road"
                );


                expect(
                    ContactRequest.find
                ).toHaveBeenCalledWith({

                    deleted:
                        false

                });


                expect(
                    ContactRequest.countDocuments
                ).toHaveBeenNthCalledWith(
                    1,
                    {

                        deleted:
                            false,

                        responded:
                            false

                    }
                );


                expect(
                    ContactRequest.countDocuments
                ).toHaveBeenNthCalledWith(
                    2,
                    {

                        deleted:
                            true

                    }
                );

            }
        );


        test(
            "should show empty state when there are no requests",
            async () => {

                mockFindWithSort([]);


                ContactRequest.countDocuments
                    .mockResolvedValueOnce(0)
                    .mockResolvedValueOnce(0);


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

                ContactRequest.findById
                    .mockResolvedValue({

                        _id:
                            ACTIVE_REQUEST_ID,

                        id:
                            ACTIVE_REQUEST_ID,

                        name:
                            "Test Customer",

                        responded:
                            false,

                        deleted:
                            false

                    });


                ContactRequest.findByIdAndUpdate
                    .mockResolvedValue({

                        _id:
                            ACTIVE_REQUEST_ID,

                        id:
                            ACTIVE_REQUEST_ID,

                        responded:
                            true,

                        responded_at:
                            new Date()

                    });


                const response =
                    await request(app)
                        .post(
                            `/BigBullRON/responded/${ACTIVE_REQUEST_ID}`
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
                    ContactRequest.findById
                ).toHaveBeenCalledWith(
                    ACTIVE_REQUEST_ID
                );


                expect(
                    ContactRequest.findByIdAndUpdate
                ).toHaveBeenCalledTimes(1);


                expect(
                    ContactRequest.findByIdAndUpdate
                ).toHaveBeenCalledWith(
                    ACTIVE_REQUEST_ID,
                    {
                        $set: {
                            responded:
                                true,

                            responded_at:
                                expect.any(Date)
                        }
                    },
                    {
                        new:
                            true
                    }
                );

            }
        );


        test(
            "should reject an invalid MongoDB request ID",
            async () => {

                const response =
                    await request(app)
                        .post(
                            "/BigBullRON/responded/not-a-valid-object-id"
                        );


                expect(
                    response.statusCode
                ).toBe(400);


                expect(
                    ContactRequest.findById
                ).not.toHaveBeenCalled();


                expect(
                    ContactRequest.findByIdAndUpdate
                ).not.toHaveBeenCalled();

            }
        );


        test(
            "should return 404 when request does not exist",
            async () => {

                ContactRequest.findById
                    .mockResolvedValue(
                        null
                    );


                const response =
                    await request(app)
                        .post(
                            `/BigBullRON/responded/${MISSING_REQUEST_ID}`
                        );


                expect(
                    response.statusCode
                ).toBe(404);


                expect(
                    ContactRequest.findByIdAndUpdate
                ).not.toHaveBeenCalled();

            }
        );


        test(
            "should return 404 when request is deleted",
            async () => {

                ContactRequest.findById
                    .mockResolvedValue({

                        _id:
                            DELETED_REQUEST_ID,

                        id:
                            DELETED_REQUEST_ID,

                        deleted:
                            true

                    });


                const response =
                    await request(app)
                        .post(
                            `/BigBullRON/responded/${DELETED_REQUEST_ID}`
                        );


                expect(
                    response.statusCode
                ).toBe(404);


                expect(
                    ContactRequest.findByIdAndUpdate
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

                ContactRequest.findById
                    .mockResolvedValue({

                        _id:
                            ACTIVE_REQUEST_ID,

                        id:
                            ACTIVE_REQUEST_ID,

                        responded:
                            true,

                        deleted:
                            false

                    });


                ContactRequest.findByIdAndUpdate
                    .mockResolvedValue({

                        _id:
                            ACTIVE_REQUEST_ID,

                        id:
                            ACTIVE_REQUEST_ID,

                        responded:
                            false,

                        responded_at:
                            null

                    });


                const response =
                    await request(app)
                        .post(
                            `/BigBullRON/unanswered/${ACTIVE_REQUEST_ID}`
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
                    ContactRequest.findByIdAndUpdate
                ).toHaveBeenCalledWith(
                    ACTIVE_REQUEST_ID,
                    {
                        $set: {
                            responded:
                                false,

                            responded_at:
                                null
                        }
                    },
                    {
                        new:
                            true
                    }
                );

            }
        );


        test(
            "should reject an invalid MongoDB request ID",
            async () => {

                const response =
                    await request(app)
                        .post(
                            "/BigBullRON/unanswered/abc"
                        );


                expect(
                    response.statusCode
                ).toBe(400);


                expect(
                    ContactRequest.findByIdAndUpdate
                ).not.toHaveBeenCalled();

            }
        );


        test(
            "should return 404 when request does not exist",
            async () => {

                ContactRequest.findById
                    .mockResolvedValue(
                        null
                    );


                const response =
                    await request(app)
                        .post(
                            `/BigBullRON/unanswered/${MISSING_REQUEST_ID}`
                        );


                expect(
                    response.statusCode
                ).toBe(404);


                expect(
                    ContactRequest.findByIdAndUpdate
                ).not.toHaveBeenCalled();

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

                ContactRequest.findById
                    .mockResolvedValue({

                        _id:
                            ACTIVE_REQUEST_ID,

                        id:
                            ACTIVE_REQUEST_ID,

                        name:
                            "Test Customer",

                        deleted:
                            false

                    });


                ContactRequest.findByIdAndUpdate
                    .mockResolvedValue({

                        _id:
                            ACTIVE_REQUEST_ID,

                        id:
                            ACTIVE_REQUEST_ID,

                        deleted:
                            true,

                        deleted_at:
                            new Date()

                    });


                const response =
                    await request(app)
                        .post(
                            `/BigBullRON/delete/${ACTIVE_REQUEST_ID}`
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
                    ContactRequest.findByIdAndUpdate
                ).toHaveBeenCalledWith(
                    ACTIVE_REQUEST_ID,
                    {
                        $set: {
                            deleted:
                                true,

                            deleted_at:
                                expect.any(Date)
                        }
                    },
                    {
                        new:
                            true
                    }
                );

            }
        );


        test(
            "should return 404 when customer does not exist",
            async () => {

                ContactRequest.findById
                    .mockResolvedValue(
                        null
                    );


                const response =
                    await request(app)
                        .post(
                            `/BigBullRON/delete/${MISSING_REQUEST_ID}`
                        );


                expect(
                    response.statusCode
                ).toBe(404);


                expect(
                    ContactRequest.findByIdAndUpdate
                ).not.toHaveBeenCalled();

            }
        );


        test(
            "should reject invalid MongoDB delete ID",
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
                    ContactRequest.findById
                ).not.toHaveBeenCalled();


                expect(
                    ContactRequest.findByIdAndUpdate
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
            "should load deleted MongoDB customer requests",
            async () => {

                const deletedAt =
                    new Date(
                        "2026-07-27T12:00:00.000Z"
                    );


                mockFindWithSort([
                    {

                        _id:
                            DELETED_REQUEST_ID,

                        id:
                            DELETED_REQUEST_ID,

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
                            false,

                        responded_at:
                            null,

                        deleted:
                            true,

                        deleted_at:
                            deletedAt,

                        createdAt:
                            new Date(
                                "2026-07-27T11:00:00.000Z"
                            )

                    }
                ]);


                ContactRequest.countDocuments
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
                    response.text
                ).toContain(
                    "456 Recovery Road"
                );


                expect(
                    ContactRequest.find
                ).toHaveBeenCalledWith({

                    deleted:
                        true

                });


                expect(
                    ContactRequest.countDocuments
                ).toHaveBeenCalledWith({

                    deleted:
                        true

                });

            }
        );


        test(
            "should show empty recovery state",
            async () => {

                mockFindWithSort([]);


                ContactRequest.countDocuments
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

                ContactRequest.findById
                    .mockResolvedValue({

                        _id:
                            DELETED_REQUEST_ID,

                        id:
                            DELETED_REQUEST_ID,

                        name:
                            "Deleted Customer",

                        deleted:
                            true,

                        deleted_at:
                            new Date()

                    });


                ContactRequest.findByIdAndUpdate
                    .mockResolvedValue({

                        _id:
                            DELETED_REQUEST_ID,

                        id:
                            DELETED_REQUEST_ID,

                        deleted:
                            false,

                        deleted_at:
                            null

                    });


                const response =
                    await request(app)
                        .post(
                            `/BigBullRON/restore/${DELETED_REQUEST_ID}`
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
                    ContactRequest.findByIdAndUpdate
                ).toHaveBeenCalledWith(
                    DELETED_REQUEST_ID,
                    {
                        $set: {
                            deleted:
                                false,

                            deleted_at:
                                null
                        }
                    },
                    {
                        new:
                            true
                    }
                );

            }
        );


        test(
            "should return 404 when restore request does not exist",
            async () => {

                ContactRequest.findById
                    .mockResolvedValue(
                        null
                    );


                const response =
                    await request(app)
                        .post(
                            `/BigBullRON/restore/${MISSING_REQUEST_ID}`
                        );


                expect(
                    response.statusCode
                ).toBe(404);


                expect(
                    ContactRequest.findByIdAndUpdate
                ).not.toHaveBeenCalled();

            }
        );


        test(
            "should reject invalid MongoDB restore ID",
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
                    ContactRequest.findById
                ).not.toHaveBeenCalled();


                expect(
                    ContactRequest.findByIdAndUpdate
                ).not.toHaveBeenCalled();

            }
        );

    }
);


// ======================================================
// MONGOOSE ERROR HANDLING
// ======================================================

describe(
    "MongoDB / Mongoose error handling",
    () => {

        test(
            "Big Bull RON should return 500 when MongoDB query fails",
            async () => {

                const sort =
                    jest.fn()
                        .mockRejectedValue(
                            new Error(
                                "Test MongoDB failure"
                            )
                        );


                ContactRequest.find
                    .mockReturnValue({

                        sort:
                            sort

                    });


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
            "recovery page should return 500 when MongoDB query fails",
            async () => {

                const sort =
                    jest.fn()
                        .mockRejectedValue(
                            new Error(
                                "Test MongoDB failure"
                            )
                        );


                ContactRequest.find
                    .mockReturnValue({

                        sort:
                            sort

                    });


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


        test(
            "contact form should redirect to error when MongoDB save fails",
            async () => {

                ContactRequest.create
                    .mockRejectedValue(
                        new Error(
                            "Test MongoDB save failure"
                        )
                    );


                const response =
                    await request(app)
                        .post("/contact")
                        .type("form")
                        .send({

                            name:
                                "Test Customer",

                            email:
                                "customer@example.com",

                            message:
                                "Please contact me.",

                            website:
                                ""

                        });


                expect(
                    response.statusCode
                ).toBe(302);


                expect(
                    response.headers.location
                ).toBe(
                    "/contact?error=true"
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