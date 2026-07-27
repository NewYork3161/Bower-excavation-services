// ======================================================
// BOWER COMPANY CONSTRUCTION
// CONTACT REQUEST MODEL TESTS
// test/contactRequest.test.js
// MONGODB / MONGOOSE VERSION
// ======================================================


// ======================================================
// TEST ENVIRONMENT
// ======================================================

process.env.NODE_ENV = "test";


// ======================================================
// IMPORT MONGOOSE
// ======================================================

const mongoose =
    require("mongoose");


// ======================================================
// IMPORT CONTACT REQUEST MODEL
// ======================================================

const ContactRequest =
    require("../models/ContactRequest");


// ======================================================
// TEST OBJECT IDS
// ======================================================

const ACTIVE_REQUEST_ID =
    new mongoose.Types.ObjectId(
        "507f1f77bcf86cd799439011"
    );


const SECOND_REQUEST_ID =
    new mongoose.Types.ObjectId(
        "507f1f77bcf86cd799439012"
    );


// ======================================================
// CONTACT REQUEST MODEL
// ======================================================

describe(
    "ContactRequest Mongoose Model",
    () => {


        // ==================================================
        // MODEL EXISTS
        // ==================================================

        test(
            "should create the ContactRequest Mongoose model",
            () => {

                expect(
                    ContactRequest
                ).toBeDefined();


                expect(
                    ContactRequest.modelName
                ).toBe(
                    "ContactRequest"
                );

            }
        );


        // ==================================================
        // COLLECTION EXISTS
        // ==================================================

        test(
            "should have a MongoDB collection name",
            () => {

                expect(
                    ContactRequest.collection
                ).toBeDefined();


                expect(
                    ContactRequest.collection.name
                ).toBeDefined();

            }
        );

    }
);


// ======================================================
// SCHEMA FIELDS
// ======================================================

describe(
    "ContactRequest Schema Fields",
    () => {

        const schema =
            ContactRequest.schema;


        test(
            "should contain the name field",
            () => {

                expect(
                    schema.path("name")
                ).toBeDefined();

            }
        );


        test(
            "should contain the email field",
            () => {

                expect(
                    schema.path("email")
                ).toBeDefined();

            }
        );


        test(
            "should contain the phone field",
            () => {

                expect(
                    schema.path("phone")
                ).toBeDefined();

            }
        );


        test(
            "should contain the service field",
            () => {

                expect(
                    schema.path("service")
                ).toBeDefined();

            }
        );


        test(
            "should contain the property_address field",
            () => {

                expect(
                    schema.path(
                        "property_address"
                    )
                ).toBeDefined();

            }
        );


        test(
            "should contain the message field",
            () => {

                expect(
                    schema.path("message")
                ).toBeDefined();

            }
        );


        test(
            "should contain the responded field",
            () => {

                expect(
                    schema.path("responded")
                ).toBeDefined();

            }
        );


        test(
            "should contain the responded_at field",
            () => {

                expect(
                    schema.path(
                        "responded_at"
                    )
                ).toBeDefined();

            }
        );


        test(
            "should contain the deleted field",
            () => {

                expect(
                    schema.path("deleted")
                ).toBeDefined();

            }
        );


        test(
            "should contain the deleted_at field",
            () => {

                expect(
                    schema.path(
                        "deleted_at"
                    )
                ).toBeDefined();

            }
        );


        test(
            "should contain createdAt from timestamps",
            () => {

                expect(
                    schema.path("createdAt")
                ).toBeDefined();

            }
        );


        test(
            "should contain updatedAt from timestamps",
            () => {

                expect(
                    schema.path("updatedAt")
                ).toBeDefined();

            }
        );

    }
);


// ======================================================
// REQUIRED FIELDS
// ======================================================

describe(
    "ContactRequest Required Fields",
    () => {

        const schema =
            ContactRequest.schema;


        test(
            "name should be required",
            () => {

                expect(
                    schema.path("name")
                        .options
                        .required
                ).toBe(true);

            }
        );


        test(
            "email should be required",
            () => {

                expect(
                    schema.path("email")
                        .options
                        .required
                ).toBe(true);

            }
        );


        test(
            "message should be required",
            () => {

                expect(
                    schema.path("message")
                        .options
                        .required
                ).toBe(true);

            }
        );


        test(
            "phone should not be required",
            () => {

                expect(
                    schema.path("phone")
                        .options
                        .required
                ).not.toBe(true);

            }
        );


        test(
            "service should not be required",
            () => {

                expect(
                    schema.path("service")
                        .options
                        .required
                ).not.toBe(true);

            }
        );


        test(
            "property_address should not be required",
            () => {

                expect(
                    schema.path(
                        "property_address"
                    )
                        .options
                        .required
                ).not.toBe(true);

            }
        );

    }
);


// ======================================================
// DEFAULT VALUES
// ======================================================

describe(
    "ContactRequest Default Values",
    () => {

        test(
            "should use the correct defaults",
            () => {

                const customer =
                    new ContactRequest({

                        name:
                            "Test Customer",

                        email:
                            "test@example.com",

                        message:
                            "Please contact me."

                    });


                expect(
                    customer.phone
                ).toBeNull();


                expect(
                    customer.service
                ).toBeNull();


                expect(
                    customer.property_address
                ).toBeNull();


                expect(
                    customer.responded
                ).toBe(false);


                expect(
                    customer.responded_at
                ).toBeNull();


                expect(
                    customer.deleted
                ).toBe(false);


                expect(
                    customer.deleted_at
                ).toBeNull();

            }
        );

    }
);


// ======================================================
// CUSTOMER NAME
// ======================================================

describe(
    "Customer Name",
    () => {

        test(
            "should trim the customer name",
            () => {

                const customer =
                    new ContactRequest({

                        name:
                            "  John Smith  ",

                        email:
                            "john@example.com",

                        message:
                            "Test message"

                    });


                expect(
                    customer.name
                ).toBe(
                    "John Smith"
                );

            }
        );


        test(
            "should reject names over 150 characters",
            async () => {

                const customer =
                    new ContactRequest({

                        name:
                            "A".repeat(151),

                        email:
                            "john@example.com",

                        message:
                            "Test message"

                    });


                const error =
                    customer.validateSync();


                expect(
                    error
                ).toBeDefined();


                expect(
                    error.errors.name
                ).toBeDefined();

            }
        );

    }
);


// ======================================================
// CUSTOMER EMAIL
// ======================================================

describe(
    "Customer Email",
    () => {

        test(
            "should trim and lowercase email",
            () => {

                const customer =
                    new ContactRequest({

                        name:
                            "John Smith",

                        email:
                            "  JOHN@EXAMPLE.COM  ",

                        message:
                            "Test message"

                    });


                expect(
                    customer.email
                ).toBe(
                    "john@example.com"
                );

            }
        );


        test(
            "should reject email over 254 characters",
            () => {

                const customer =
                    new ContactRequest({

                        name:
                            "John Smith",

                        email:
                            `${"a".repeat(250)}@example.com`,

                        message:
                            "Test message"

                    });


                const error =
                    customer.validateSync();


                expect(
                    error
                ).toBeDefined();


                expect(
                    error.errors.email
                ).toBeDefined();

            }
        );

    }
);


// ======================================================
// PHONE
// ======================================================

describe(
    "Customer Phone",
    () => {

        test(
            "should trim phone number",
            () => {

                const customer =
                    new ContactRequest({

                        name:
                            "John Smith",

                        email:
                            "john@example.com",

                        phone:
                            "  925-555-1234  ",

                        message:
                            "Test message"

                    });


                expect(
                    customer.phone
                ).toBe(
                    "925-555-1234"
                );

            }
        );


        test(
            "should reject phone numbers over 50 characters",
            () => {

                const customer =
                    new ContactRequest({

                        name:
                            "John Smith",

                        email:
                            "john@example.com",

                        phone:
                            "1".repeat(51),

                        message:
                            "Test message"

                    });


                const error =
                    customer.validateSync();


                expect(
                    error
                ).toBeDefined();


                expect(
                    error.errors.phone
                ).toBeDefined();

            }
        );

    }
);


// ======================================================
// SERVICE
// ======================================================

describe(
    "Requested Service",
    () => {

        test(
            "should trim requested service",
            () => {

                const customer =
                    new ContactRequest({

                        name:
                            "John Smith",

                        email:
                            "john@example.com",

                        service:
                            "  Fire Weed Abatement  ",

                        message:
                            "Test message"

                    });


                expect(
                    customer.service
                ).toBe(
                    "Fire Weed Abatement"
                );

            }
        );


        test(
            "should reject service over 200 characters",
            () => {

                const customer =
                    new ContactRequest({

                        name:
                            "John Smith",

                        email:
                            "john@example.com",

                        service:
                            "A".repeat(201),

                        message:
                            "Test message"

                    });


                const error =
                    customer.validateSync();


                expect(
                    error
                ).toBeDefined();


                expect(
                    error.errors.service
                ).toBeDefined();

            }
        );

    }
);


// ======================================================
// PROPERTY ADDRESS
// ======================================================

describe(
    "Property Address",
    () => {

        test(
            "should use property_address",
            () => {

                const customer =
                    new ContactRequest({

                        name:
                            "John Smith",

                        email:
                            "john@example.com",

                        property_address:
                            "123 Test Road",

                        message:
                            "Test message"

                    });


                expect(
                    customer.property_address
                ).toBe(
                    "123 Test Road"
                );

            }
        );


        test(
            "should trim property_address",
            () => {

                const customer =
                    new ContactRequest({

                        name:
                            "John Smith",

                        email:
                            "john@example.com",

                        property_address:
                            "  123 Test Road  ",

                        message:
                            "Test message"

                    });


                expect(
                    customer.property_address
                ).toBe(
                    "123 Test Road"
                );

            }
        );


        test(
            "should reject property_address over 500 characters",
            () => {

                const customer =
                    new ContactRequest({

                        name:
                            "John Smith",

                        email:
                            "john@example.com",

                        property_address:
                            "A".repeat(501),

                        message:
                            "Test message"

                    });


                const error =
                    customer.validateSync();


                expect(
                    error
                ).toBeDefined();


                expect(
                    error.errors.property_address
                ).toBeDefined();

            }
        );

    }
);


// ======================================================
// MESSAGE
// ======================================================

describe(
    "Customer Message",
    () => {

        test(
            "should trim customer message",
            () => {

                const customer =
                    new ContactRequest({

                        name:
                            "John Smith",

                        email:
                            "john@example.com",

                        message:
                            "  Please clear my property.  "

                    });


                expect(
                    customer.message
                ).toBe(
                    "Please clear my property."
                );

            }
        );


        test(
            "should reject messages over 10000 characters",
            () => {

                const customer =
                    new ContactRequest({

                        name:
                            "John Smith",

                        email:
                            "john@example.com",

                        message:
                            "A".repeat(10001)

                    });


                const error =
                    customer.validateSync();


                expect(
                    error
                ).toBeDefined();


                expect(
                    error.errors.message
                ).toBeDefined();

            }
        );

    }
);


// ======================================================
// VALID CUSTOMER REQUEST
// ======================================================

describe(
    "Valid Contact Request",
    () => {

        test(
            "should validate a complete customer request",
            () => {

                const customer =
                    new ContactRequest({

                        _id:
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
                            "I need my property disked."

                    });


                const error =
                    customer.validateSync();


                expect(
                    error
                ).toBeUndefined();


                expect(
                    customer.name
                ).toBe(
                    "John Smith"
                );


                expect(
                    customer.email
                ).toBe(
                    "john@example.com"
                );


                expect(
                    customer.phone
                ).toBe(
                    "9255551234"
                );


                expect(
                    customer.service
                ).toBe(
                    "Disking"
                );


                expect(
                    customer.property_address
                ).toBe(
                    "123 Test Road"
                );


                expect(
                    customer.message
                ).toBe(
                    "I need my property disked."
                );


                expect(
                    customer.responded
                ).toBe(false);


                expect(
                    customer.deleted
                ).toBe(false);

            }
        );

    }
);


// ======================================================
// REQUIRED FIELD VALIDATION
// ======================================================

describe(
    "Required Field Validation",
    () => {

        test(
            "should reject customer without name",
            () => {

                const customer =
                    new ContactRequest({

                        email:
                            "customer@example.com",

                        message:
                            "Test message"

                    });


                const error =
                    customer.validateSync();


                expect(
                    error
                ).toBeDefined();


                expect(
                    error.errors.name
                ).toBeDefined();

            }
        );


        test(
            "should reject customer without email",
            () => {

                const customer =
                    new ContactRequest({

                        name:
                            "Test Customer",

                        message:
                            "Test message"

                    });


                const error =
                    customer.validateSync();


                expect(
                    error
                ).toBeDefined();


                expect(
                    error.errors.email
                ).toBeDefined();

            }
        );


        test(
            "should reject customer without message",
            () => {

                const customer =
                    new ContactRequest({

                        name:
                            "Test Customer",

                        email:
                            "customer@example.com"

                    });


                const error =
                    customer.validateSync();


                expect(
                    error
                ).toBeDefined();


                expect(
                    error.errors.message
                ).toBeDefined();

            }
        );

    }
);


// ======================================================
// RESPONDED STATUS
// ======================================================

describe(
    "Responded Status",
    () => {

        test(
            "new request should start unanswered",
            () => {

                const customer =
                    new ContactRequest({

                        name:
                            "Test Customer",

                        email:
                            "customer@example.com",

                        message:
                            "Test message"

                    });


                expect(
                    customer.responded
                ).toBe(false);


                expect(
                    customer.responded_at
                ).toBeNull();

            }
        );


        test(
            "request can be marked responded",
            () => {

                const respondedDate =
                    new Date(
                        "2026-07-27T13:00:00.000Z"
                    );


                const customer =
                    new ContactRequest({

                        name:
                            "Test Customer",

                        email:
                            "customer@example.com",

                        message:
                            "Test message",

                        responded:
                            true,

                        responded_at:
                            respondedDate

                    });


                expect(
                    customer.responded
                ).toBe(true);


                expect(
                    customer.responded_at
                ).toEqual(
                    respondedDate
                );

            }
        );


        test(
            "request can be marked unanswered again",
            () => {

                const customer =
                    new ContactRequest({

                        name:
                            "Test Customer",

                        email:
                            "customer@example.com",

                        message:
                            "Test message",

                        responded:
                            false,

                        responded_at:
                            null

                    });


                expect(
                    customer.responded
                ).toBe(false);


                expect(
                    customer.responded_at
                ).toBeNull();

            }
        );

    }
);


// ======================================================
// SOFT DELETE STATUS
// ======================================================

describe(
    "Soft Delete Status",
    () => {

        test(
            "new request should not be deleted",
            () => {

                const customer =
                    new ContactRequest({

                        name:
                            "Test Customer",

                        email:
                            "customer@example.com",

                        message:
                            "Test message"

                    });


                expect(
                    customer.deleted
                ).toBe(false);


                expect(
                    customer.deleted_at
                ).toBeNull();

            }
        );


        test(
            "request can be soft deleted",
            () => {

                const deletedDate =
                    new Date(
                        "2026-07-27T14:00:00.000Z"
                    );


                const customer =
                    new ContactRequest({

                        name:
                            "Delete Test",

                        email:
                            "delete@example.com",

                        message:
                            "Test message",

                        deleted:
                            true,

                        deleted_at:
                            deletedDate

                    });


                expect(
                    customer.deleted
                ).toBe(true);


                expect(
                    customer.deleted_at
                ).toEqual(
                    deletedDate
                );

            }
        );


        test(
            "soft deleted document still exists as a Mongoose document",
            () => {

                const customer =
                    new ContactRequest({

                        _id:
                            SECOND_REQUEST_ID,

                        name:
                            "Soft Delete Test",

                        email:
                            "delete@example.com",

                        message:
                            "Test message",

                        deleted:
                            true,

                        deleted_at:
                            new Date()

                    });


                expect(
                    customer
                ).toBeDefined();


                expect(
                    customer._id.toString()
                ).toBe(
                    SECOND_REQUEST_ID.toString()
                );


                expect(
                    customer.deleted
                ).toBe(true);

            }
        );


        test(
            "request can be restored",
            () => {

                const customer =
                    new ContactRequest({

                        name:
                            "Restore Test",

                        email:
                            "restore@example.com",

                        message:
                            "Test message",

                        deleted:
                            false,

                        deleted_at:
                            null

                    });


                expect(
                    customer.deleted
                ).toBe(false);


                expect(
                    customer.deleted_at
                ).toBeNull();

            }
        );

    }
);


// ======================================================
// MONGODB OBJECT ID
// ======================================================

describe(
    "MongoDB ObjectId",
    () => {

        test(
            "should use a MongoDB ObjectId for _id",
            () => {

                const customer =
                    new ContactRequest({

                        _id:
                            ACTIVE_REQUEST_ID,

                        name:
                            "Object ID Test",

                        email:
                            "objectid@example.com",

                        message:
                            "Test message"

                    });


                expect(
                    customer._id
                ).toBeInstanceOf(
                    mongoose.Types.ObjectId
                );


                expect(
                    customer._id.toString()
                ).toBe(
                    ACTIVE_REQUEST_ID.toString()
                );

            }
        );


        test(
            "Mongoose should automatically create an ObjectId",
            () => {

                const customer =
                    new ContactRequest({

                        name:
                            "Automatic ID Test",

                        email:
                            "automatic@example.com",

                        message:
                            "Test message"

                    });


                expect(
                    customer._id
                ).toBeDefined();


                expect(
                    customer._id
                ).toBeInstanceOf(
                    mongoose.Types.ObjectId
                );

            }
        );

    }
);


// ======================================================
// ID VIRTUAL
// ======================================================

describe(
    "Mongoose ID Virtual",
    () => {

        test(
            "should expose id based on MongoDB _id",
            () => {

                const customer =
                    new ContactRequest({

                        _id:
                            ACTIVE_REQUEST_ID,

                        name:
                            "ID Test",

                        email:
                            "id@example.com",

                        message:
                            "Test message"

                    });


                expect(
                    customer.id
                ).toBe(
                    ACTIVE_REQUEST_ID.toString()
                );

            }
        );


        test(
            "toJSON should expose id",
            () => {

                const customer =
                    new ContactRequest({

                        _id:
                            ACTIVE_REQUEST_ID,

                        name:
                            "JSON Test",

                        email:
                            "json@example.com",

                        message:
                            "Test message"

                    });


                const json =
                    customer.toJSON();


                expect(
                    json.id
                ).toBe(
                    ACTIVE_REQUEST_ID.toString()
                );

            }
        );

    }
);


// ======================================================
// JSON / OBJECT CONVERSION
// ======================================================

describe(
    "Mongoose Conversion",
    () => {

        test(
            "should convert request to JSON",
            () => {

                const customer =
                    new ContactRequest({

                        _id:
                            ACTIVE_REQUEST_ID,

                        name:
                            "JSON Customer",

                        email:
                            "json@example.com",

                        property_address:
                            "123 Mongo Road",

                        message:
                            "Test message"

                    });


                const json =
                    customer.toJSON();


                expect(
                    json.name
                ).toBe(
                    "JSON Customer"
                );


                expect(
                    json.email
                ).toBe(
                    "json@example.com"
                );


                expect(
                    json.property_address
                ).toBe(
                    "123 Mongo Road"
                );


                expect(
                    json.id
                ).toBe(
                    ACTIVE_REQUEST_ID.toString()
                );

            }
        );


        test(
            "should convert request to plain object",
            () => {

                const customer =
                    new ContactRequest({

                        name:
                            "Object Customer",

                        email:
                            "object@example.com",

                        message:
                            "Test message"

                    });


                const object =
                    customer.toObject();


                expect(
                    object.name
                ).toBe(
                    "Object Customer"
                );


                expect(
                    object.email
                ).toBe(
                    "object@example.com"
                );

            }
        );

    }
);


// ======================================================
// SCHEMA INDEXES
// ======================================================

describe(
    "ContactRequest MongoDB Indexes",
    () => {

        test(
            "should define active/deleted request index",
            () => {

                const indexes =
                    ContactRequest.schema.indexes();


                const hasDeletedCreatedIndex =
                    indexes.some(
                        ([fields]) => {

                            return (
                                fields.deleted === 1 &&
                                fields.createdAt === -1
                            );

                        }
                    );


                expect(
                    hasDeletedCreatedIndex
                ).toBe(true);

            }
        );


        test(
            "should define responded status index",
            () => {

                const indexes =
                    ContactRequest.schema.indexes();


                const hasRespondedIndex =
                    indexes.some(
                        ([fields]) => {

                            return (
                                fields.deleted === 1 &&
                                fields.responded === 1 &&
                                fields.createdAt === -1
                            );

                        }
                    );


                expect(
                    hasRespondedIndex
                ).toBe(true);

            }
        );

    }
);


// ======================================================
// FIELD TYPES
// ======================================================

describe(
    "ContactRequest Field Types",
    () => {

        const schema =
            ContactRequest.schema;


        test(
            "name should be a String",
            () => {

                expect(
                    schema.path("name").instance
                ).toBe(
                    "String"
                );

            }
        );


        test(
            "email should be a String",
            () => {

                expect(
                    schema.path("email").instance
                ).toBe(
                    "String"
                );

            }
        );


        test(
            "phone should be a String",
            () => {

                expect(
                    schema.path("phone").instance
                ).toBe(
                    "String"
                );

            }
        );


        test(
            "service should be a String",
            () => {

                expect(
                    schema.path("service").instance
                ).toBe(
                    "String"
                );

            }
        );


        test(
            "property_address should be a String",
            () => {

                expect(
                    schema.path(
                        "property_address"
                    ).instance
                ).toBe(
                    "String"
                );

            }
        );


        test(
            "message should be a String",
            () => {

                expect(
                    schema.path("message").instance
                ).toBe(
                    "String"
                );

            }
        );


        test(
            "responded should be a Boolean",
            () => {

                expect(
                    schema.path(
                        "responded"
                    ).instance
                ).toBe(
                    "Boolean"
                );

            }
        );


        test(
            "responded_at should be a Date",
            () => {

                expect(
                    schema.path(
                        "responded_at"
                    ).instance
                ).toBe(
                    "Date"
                );

            }
        );


        test(
            "deleted should be a Boolean",
            () => {

                expect(
                    schema.path(
                        "deleted"
                    ).instance
                ).toBe(
                    "Boolean"
                );

            }
        );


        test(
            "deleted_at should be a Date",
            () => {

                expect(
                    schema.path(
                        "deleted_at"
                    ).instance
                ).toBe(
                    "Date"
                );

            }
        );

    }
);