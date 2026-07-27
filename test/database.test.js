// ======================================================
// BOWER COMPANY CONSTRUCTION
// DATABASE UNIT TESTS
// test/database.test.js
// ======================================================


// ======================================================
// IMPORT SQLITE
// ======================================================

const sqlite3 =
    require("sqlite3").verbose();


// ======================================================
// TEST DATABASE
// ======================================================
//
// IMPORTANT:
//
// This database exists ONLY in memory.
//
// It does NOT use:
//
// database/bower_company.db
//
// Nothing in this test file should modify the real
// Bower Company customer database.
//
// ======================================================

let db;


// ======================================================
// PROMISE HELPERS
// ======================================================

function run(
    sql,
    params = []
) {

    return new Promise(
        (resolve, reject) => {

            db.run(
                sql,
                params,
                function (error) {

                    if (error) {

                        reject(error);

                        return;

                    }


                    resolve({

                        lastID:
                            this.lastID,

                        changes:
                            this.changes

                    });

                }
            );

        }
    );

}


function get(
    sql,
    params = []
) {

    return new Promise(
        (resolve, reject) => {

            db.get(
                sql,
                params,
                (error, row) => {

                    if (error) {

                        reject(error);

                        return;

                    }


                    resolve(row);

                }
            );

        }
    );

}


function all(
    sql,
    params = []
) {

    return new Promise(
        (resolve, reject) => {

            db.all(
                sql,
                params,
                (error, rows) => {

                    if (error) {

                        reject(error);

                        return;

                    }


                    resolve(rows);

                }
            );

        }
    );

}


// ======================================================
// DATABASE FUNCTIONS UNDER TEST
// ======================================================
//
// These mirror the behavior of database.js while using
// the safe in-memory test database.
//
// ======================================================


// ======================================================
// CREATE CONTACT REQUEST
// ======================================================

async function createContactRequest({

    name,
    email,
    phone,
    service,
    propertyAddress,
    message

}) {

    const result =
        await run(
            `
                INSERT INTO contact_requests
                (
                    name,
                    email,
                    phone,
                    service,
                    property_address,
                    message,
                    responded,
                    deleted
                )

                VALUES (?, ?, ?, ?, ?, ?, 0, 0)
            `,
            [
                name,
                email,
                phone || null,
                service || null,
                propertyAddress || null,
                message
            ]
        );


    return {

        id:
            result.lastID,

        name,

        email,

        phone,

        service,

        propertyAddress,

        message,

        responded:
            false,

        deleted:
            false

    };

}


// ======================================================
// GET ALL ACTIVE CONTACT REQUESTS
// ======================================================

async function getAllContactRequests() {

    return all(
        `
            SELECT *

            FROM contact_requests

            WHERE deleted = 0

            ORDER BY
                responded ASC,
                created_at DESC,
                id DESC
        `
    );

}


// ======================================================
// GET CONTACT REQUEST BY ID
// ======================================================

async function getContactRequestById(id) {

    return get(
        `
            SELECT *

            FROM contact_requests

            WHERE id = ?
        `,
        [id]
    );

}


// ======================================================
// MARK REQUEST RESPONDED
// ======================================================

async function markRequestResponded(
    id,
    response = null
) {

    const result =
        await run(
            `
                UPDATE contact_requests

                SET
                    responded = 1,
                    response = ?,
                    responded_at = CURRENT_TIMESTAMP

                WHERE id = ?

                AND deleted = 0
            `,
            [
                response,
                id
            ]
        );


    return {

        id,

        responded:
            true,

        response,

        changes:
            result.changes

    };

}


// ======================================================
// MARK REQUEST UNANSWERED
// ======================================================

async function markRequestUnanswered(id) {

    const result =
        await run(
            `
                UPDATE contact_requests

                SET
                    responded = 0,
                    response = NULL,
                    responded_at = NULL

                WHERE id = ?

                AND deleted = 0
            `,
            [id]
        );


    return {

        id,

        responded:
            false,

        changes:
            result.changes

    };

}


// ======================================================
// SOFT DELETE CONTACT REQUEST
// ======================================================

async function deleteContactRequest(id) {

    const result =
        await run(
            `
                UPDATE contact_requests

                SET
                    deleted = 1,
                    deleted_at = CURRENT_TIMESTAMP

                WHERE id = ?

                AND deleted = 0
            `,
            [id]
        );


    return {

        id,

        deleted:
            result.changes > 0,

        changes:
            result.changes

    };

}


// ======================================================
// GET DELETED CONTACT REQUESTS
// ======================================================

async function getDeletedContactRequests() {

    return all(
        `
            SELECT *

            FROM contact_requests

            WHERE deleted = 1

            ORDER BY
                deleted_at DESC,
                id DESC
        `
    );

}


// ======================================================
// RESTORE CONTACT REQUEST
// ======================================================

async function restoreContactRequest(id) {

    const result =
        await run(
            `
                UPDATE contact_requests

                SET
                    deleted = 0,
                    deleted_at = NULL

                WHERE id = ?

                AND deleted = 1
            `,
            [id]
        );


    return {

        id,

        restored:
            result.changes > 0,

        changes:
            result.changes

    };

}


// ======================================================
// GET UNANSWERED COUNT
// ======================================================

async function getUnansweredCount() {

    const row =
        await get(
            `
                SELECT COUNT(*) AS count

                FROM contact_requests

                WHERE responded = 0

                AND deleted = 0
            `
        );


    return row
        ? row.count
        : 0;

}


// ======================================================
// GET DELETED COUNT
// ======================================================

async function getDeletedCount() {

    const row =
        await get(
            `
                SELECT COUNT(*) AS count

                FROM contact_requests

                WHERE deleted = 1
            `
        );


    return row
        ? row.count
        : 0;

}


// ======================================================
// CREATE TEST DATABASE BEFORE EACH TEST
// ======================================================

beforeEach(
    async () => {

        db =
            new sqlite3.Database(
                ":memory:"
            );


        await run(
            `
                CREATE TABLE contact_requests (

                    id INTEGER PRIMARY KEY AUTOINCREMENT,

                    name TEXT NOT NULL,

                    email TEXT NOT NULL,

                    phone TEXT,

                    service TEXT,

                    property_address TEXT,

                    message TEXT NOT NULL,

                    responded INTEGER NOT NULL DEFAULT 0,

                    response TEXT,

                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

                    responded_at DATETIME,

                    deleted INTEGER NOT NULL DEFAULT 0,

                    deleted_at DATETIME

                )
            `
        );

    }
);


// ======================================================
// CLOSE TEST DATABASE AFTER EACH TEST
// ======================================================

afterEach(
    async () => {

        if (!db) {

            return;

        }


        await new Promise(
            (resolve, reject) => {

                db.close(
                    (error) => {

                        if (error) {

                            reject(error);

                            return;

                        }


                        resolve();

                    }
                );

            }
        );


        db = null;

    }
);


// ======================================================
// CREATE CONTACT REQUEST TESTS
// ======================================================

describe(
    "createContactRequest",
    () => {

        test(
            "creates a new customer request",
            async () => {

                const customer =
                    await createContactRequest({

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


                expect(
                    customer.id
                ).toBeDefined();


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
                    customer.responded
                ).toBe(false);


                expect(
                    customer.deleted
                ).toBe(false);

            }
        );


        test(
            "stores optional values as null",
            async () => {

                const customer =
                    await createContactRequest({

                        name:
                            "Jane Smith",

                        email:
                            "jane@example.com",

                        phone:
                            "",

                        service:
                            "",

                        propertyAddress:
                            "",

                        message:
                            "Please contact me."

                    });


                const storedCustomer =
                    await getContactRequestById(
                        customer.id
                    );


                expect(
                    storedCustomer.phone
                ).toBeNull();


                expect(
                    storedCustomer.service
                ).toBeNull();


                expect(
                    storedCustomer.property_address
                ).toBeNull();

            }
        );

    }
);


// ======================================================
// GET CONTACT REQUEST BY ID TESTS
// ======================================================

describe(
    "getContactRequestById",
    () => {

        test(
            "returns the correct customer",
            async () => {

                const customer =
                    await createContactRequest({

                        name:
                            "Michael Test",

                        email:
                            "michael@example.com",

                        phone:
                            null,

                        service:
                            "Fire Weed Abatement",

                        propertyAddress:
                            "456 Test Street",

                        message:
                            "Test request."

                    });


                const result =
                    await getContactRequestById(
                        customer.id
                    );


                expect(
                    result
                ).toBeDefined();


                expect(
                    result.id
                ).toBe(
                    customer.id
                );


                expect(
                    result.name
                ).toBe(
                    "Michael Test"
                );

            }
        );


        test(
            "returns undefined when customer does not exist",
            async () => {

                const result =
                    await getContactRequestById(
                        999999
                    );


                expect(
                    result
                ).toBeUndefined();

            }
        );

    }
);


// ======================================================
// GET ACTIVE REQUESTS TESTS
// ======================================================

describe(
    "getAllContactRequests",
    () => {

        test(
            "returns active customer requests",
            async () => {

                await createContactRequest({

                    name:
                        "Customer One",

                    email:
                        "one@example.com",

                    phone:
                        null,

                    service:
                        "Disking",

                    propertyAddress:
                        null,

                    message:
                        "First request"

                });


                const customers =
                    await getAllContactRequests();


                expect(
                    customers.length
                ).toBe(1);


                expect(
                    customers[0].name
                ).toBe(
                    "Customer One"
                );

            }
        );


        test(
            "does not return deleted customers",
            async () => {

                const customer =
                    await createContactRequest({

                        name:
                            "Deleted Customer",

                        email:
                            "deleted@example.com",

                        phone:
                            null,

                        service:
                            "Brush Clearing",

                        propertyAddress:
                            null,

                        message:
                            "Delete this test."

                    });


                await deleteContactRequest(
                    customer.id
                );


                const customers =
                    await getAllContactRequests();


                expect(
                    customers.length
                ).toBe(0);

            }
        );


        test(
            "puts unanswered customers before responded customers",
            async () => {

                const respondedCustomer =
                    await createContactRequest({

                        name:
                            "Responded Customer",

                        email:
                            "responded@example.com",

                        phone:
                            null,

                        service:
                            "Mulching",

                        propertyAddress:
                            null,

                        message:
                            "Responded request"

                    });


                await markRequestResponded(
                    respondedCustomer.id
                );


                await createContactRequest({

                    name:
                        "New Customer",

                    email:
                        "new@example.com",

                    phone:
                        null,

                    service:
                        "Disking",

                    propertyAddress:
                        null,

                    message:
                        "New request"

                });


                const customers =
                    await getAllContactRequests();


                expect(
                    customers.length
                ).toBe(2);


                expect(
                    customers[0].responded
                ).toBe(0);


                expect(
                    customers[1].responded
                ).toBe(1);

            }
        );

    }
);


// ======================================================
// RESPONDED TESTS
// ======================================================

describe(
    "markRequestResponded",
    () => {

        test(
            "marks a request as responded",
            async () => {

                const customer =
                    await createContactRequest({

                        name:
                            "Response Test",

                        email:
                            "response@example.com",

                        phone:
                            null,

                        service:
                            "Property Clearing",

                        propertyAddress:
                            null,

                        message:
                            "Please respond."

                    });


                const result =
                    await markRequestResponded(
                        customer.id,
                        "Customer contacted."
                    );


                expect(
                    result.responded
                ).toBe(true);


                expect(
                    result.changes
                ).toBe(1);


                const storedCustomer =
                    await getContactRequestById(
                        customer.id
                    );


                expect(
                    storedCustomer.responded
                ).toBe(1);


                expect(
                    storedCustomer.response
                ).toBe(
                    "Customer contacted."
                );


                expect(
                    storedCustomer.responded_at
                ).not.toBeNull();

            }
        );


        test(
            "does not mark a deleted request responded",
            async () => {

                const customer =
                    await createContactRequest({

                        name:
                            "Deleted Response Test",

                        email:
                            "deletedresponse@example.com",

                        phone:
                            null,

                        service:
                            "Disking",

                        propertyAddress:
                            null,

                        message:
                            "Test"

                    });


                await deleteContactRequest(
                    customer.id
                );


                const result =
                    await markRequestResponded(
                        customer.id
                    );


                expect(
                    result.changes
                ).toBe(0);

            }
        );

    }
);


// ======================================================
// UNANSWERED TESTS
// ======================================================

describe(
    "markRequestUnanswered",
    () => {

        test(
            "reopens a responded request",
            async () => {

                const customer =
                    await createContactRequest({

                        name:
                            "Reopen Test",

                        email:
                            "reopen@example.com",

                        phone:
                            null,

                        service:
                            "Stump Removal",

                        propertyAddress:
                            null,

                        message:
                            "Test request"

                    });


                await markRequestResponded(
                    customer.id,
                    "Previously answered"
                );


                const result =
                    await markRequestUnanswered(
                        customer.id
                    );


                expect(
                    result.responded
                ).toBe(false);


                expect(
                    result.changes
                ).toBe(1);


                const storedCustomer =
                    await getContactRequestById(
                        customer.id
                    );


                expect(
                    storedCustomer.responded
                ).toBe(0);


                expect(
                    storedCustomer.response
                ).toBeNull();


                expect(
                    storedCustomer.responded_at
                ).toBeNull();

            }
        );

    }
);


// ======================================================
// SOFT DELETE TESTS
// ======================================================

describe(
    "deleteContactRequest",
    () => {

        test(
            "soft deletes a customer request",
            async () => {

                const customer =
                    await createContactRequest({

                        name:
                            "Delete Test",

                        email:
                            "delete@example.com",

                        phone:
                            null,

                        service:
                            "Brush Clearing",

                        propertyAddress:
                            null,

                        message:
                            "Delete test"

                    });


                const result =
                    await deleteContactRequest(
                        customer.id
                    );


                expect(
                    result.deleted
                ).toBe(true);


                expect(
                    result.changes
                ).toBe(1);


                const storedCustomer =
                    await getContactRequestById(
                        customer.id
                    );


                expect(
                    storedCustomer
                ).toBeDefined();


                expect(
                    storedCustomer.deleted
                ).toBe(1);


                expect(
                    storedCustomer.deleted_at
                ).not.toBeNull();

            }
        );


        test(
            "does not physically remove the database row",
            async () => {

                const customer =
                    await createContactRequest({

                        name:
                            "Soft Delete Test",

                        email:
                            "softdelete@example.com",

                        phone:
                            null,

                        service:
                            "Disking",

                        propertyAddress:
                            null,

                        message:
                            "Soft delete me"

                    });


                await deleteContactRequest(
                    customer.id
                );


                const storedCustomer =
                    await getContactRequestById(
                        customer.id
                    );


                expect(
                    storedCustomer
                ).toBeDefined();


                expect(
                    storedCustomer.id
                ).toBe(
                    customer.id
                );

            }
        );


        test(
            "does not delete the same request twice",
            async () => {

                const customer =
                    await createContactRequest({

                        name:
                            "Double Delete Test",

                        email:
                            "double@example.com",

                        phone:
                            null,

                        service:
                            "Disking",

                        propertyAddress:
                            null,

                        message:
                            "Test"

                    });


                await deleteContactRequest(
                    customer.id
                );


                const secondDelete =
                    await deleteContactRequest(
                        customer.id
                    );


                expect(
                    secondDelete.deleted
                ).toBe(false);


                expect(
                    secondDelete.changes
                ).toBe(0);

            }
        );

    }
);


// ======================================================
// DELETED REQUEST TESTS
// ======================================================

describe(
    "getDeletedContactRequests",
    () => {

        test(
            "returns deleted requests",
            async () => {

                const customer =
                    await createContactRequest({

                        name:
                            "Recovery Customer",

                        email:
                            "recovery@example.com",

                        phone:
                            null,

                        service:
                            "Fire Weed Abatement",

                        propertyAddress:
                            null,

                        message:
                            "Recovery test"

                    });


                await deleteContactRequest(
                    customer.id
                );


                const deletedCustomers =
                    await getDeletedContactRequests();


                expect(
                    deletedCustomers.length
                ).toBe(1);


                expect(
                    deletedCustomers[0].id
                ).toBe(
                    customer.id
                );


                expect(
                    deletedCustomers[0].deleted
                ).toBe(1);

            }
        );


        test(
            "does not return active requests",
            async () => {

                await createContactRequest({

                    name:
                        "Active Customer",

                    email:
                        "active@example.com",

                    phone:
                        null,

                    service:
                        "Disking",

                    propertyAddress:
                        null,

                    message:
                        "Active request"

                });


                const deletedCustomers =
                    await getDeletedContactRequests();


                expect(
                    deletedCustomers.length
                ).toBe(0);

            }
        );

    }
);


// ======================================================
// RESTORE TESTS
// ======================================================

describe(
    "restoreContactRequest",
    () => {

        test(
            "restores a deleted customer",
            async () => {

                const customer =
                    await createContactRequest({

                        name:
                            "Restore Test",

                        email:
                            "restore@example.com",

                        phone:
                            null,

                        service:
                            "Property Clearing",

                        propertyAddress:
                            null,

                        message:
                            "Restore this request"

                    });


                await deleteContactRequest(
                    customer.id
                );


                const result =
                    await restoreContactRequest(
                        customer.id
                    );


                expect(
                    result.restored
                ).toBe(true);


                expect(
                    result.changes
                ).toBe(1);


                const storedCustomer =
                    await getContactRequestById(
                        customer.id
                    );


                expect(
                    storedCustomer.deleted
                ).toBe(0);


                expect(
                    storedCustomer.deleted_at
                ).toBeNull();

            }
        );


        test(
            "restored customer returns to active requests",
            async () => {

                const customer =
                    await createContactRequest({

                        name:
                            "Return Test",

                        email:
                            "return@example.com",

                        phone:
                            null,

                        service:
                            "Disking",

                        propertyAddress:
                            null,

                        message:
                            "Return test"

                    });


                await deleteContactRequest(
                    customer.id
                );


                let activeCustomers =
                    await getAllContactRequests();


                expect(
                    activeCustomers.length
                ).toBe(0);


                await restoreContactRequest(
                    customer.id
                );


                activeCustomers =
                    await getAllContactRequests();


                expect(
                    activeCustomers.length
                ).toBe(1);


                expect(
                    activeCustomers[0].id
                ).toBe(
                    customer.id
                );

            }
        );


        test(
            "does not restore an active customer",
            async () => {

                const customer =
                    await createContactRequest({

                        name:
                            "Already Active",

                        email:
                            "alreadyactive@example.com",

                        phone:
                            null,

                        service:
                            "Mulching",

                        propertyAddress:
                            null,

                        message:
                            "Test"

                    });


                const result =
                    await restoreContactRequest(
                        customer.id
                    );


                expect(
                    result.restored
                ).toBe(false);


                expect(
                    result.changes
                ).toBe(0);

            }
        );

    }
);


// ======================================================
// UNANSWERED COUNT TESTS
// ======================================================

describe(
    "getUnansweredCount",
    () => {

        test(
            "counts unanswered active requests",
            async () => {

                await createContactRequest({

                    name:
                        "Customer One",

                    email:
                        "one@example.com",

                    phone:
                        null,

                    service:
                        "Disking",

                    propertyAddress:
                        null,

                    message:
                        "One"

                });


                await createContactRequest({

                    name:
                        "Customer Two",

                    email:
                        "two@example.com",

                    phone:
                        null,

                    service:
                        "Mulching",

                    propertyAddress:
                        null,

                    message:
                        "Two"

                });


                const count =
                    await getUnansweredCount();


                expect(
                    count
                ).toBe(2);

            }
        );


        test(
            "does not count responded requests",
            async () => {

                const customer =
                    await createContactRequest({

                        name:
                            "Responded Count Test",

                        email:
                            "respondedcount@example.com",

                        phone:
                            null,

                        service:
                            "Disking",

                        propertyAddress:
                            null,

                        message:
                            "Test"

                    });


                await markRequestResponded(
                    customer.id
                );


                const count =
                    await getUnansweredCount();


                expect(
                    count
                ).toBe(0);

            }
        );


        test(
            "does not count deleted requests",
            async () => {

                const customer =
                    await createContactRequest({

                        name:
                            "Deleted Count Test",

                        email:
                            "deletedcount@example.com",

                        phone:
                            null,

                        service:
                            "Disking",

                        propertyAddress:
                            null,

                        message:
                            "Test"

                    });


                await deleteContactRequest(
                    customer.id
                );


                const count =
                    await getUnansweredCount();


                expect(
                    count
                ).toBe(0);

            }
        );

    }
);


// ======================================================
// DELETED COUNT TESTS
// ======================================================

describe(
    "getDeletedCount",
    () => {

        test(
            "counts deleted requests",
            async () => {

                const firstCustomer =
                    await createContactRequest({

                        name:
                            "Deleted One",

                        email:
                            "deleted1@example.com",

                        phone:
                            null,

                        service:
                            "Disking",

                        propertyAddress:
                            null,

                        message:
                            "One"

                    });


                const secondCustomer =
                    await createContactRequest({

                        name:
                            "Deleted Two",

                        email:
                            "deleted2@example.com",

                        phone:
                            null,

                        service:
                            "Brush Clearing",

                        propertyAddress:
                            null,

                        message:
                            "Two"

                    });


                await deleteContactRequest(
                    firstCustomer.id
                );


                await deleteContactRequest(
                    secondCustomer.id
                );


                const count =
                    await getDeletedCount();


                expect(
                    count
                ).toBe(2);

            }
        );


        test(
            "does not count active requests",
            async () => {

                await createContactRequest({

                    name:
                        "Active Count Test",

                    email:
                        "activecount@example.com",

                    phone:
                        null,

                    service:
                        "Disking",

                    propertyAddress:
                        null,

                    message:
                        "Test"

                });


                const count =
                    await getDeletedCount();


                expect(
                    count
                ).toBe(0);

            }
        );


        test(
            "deleted count decreases after restore",
            async () => {

                const customer =
                    await createContactRequest({

                        name:
                            "Restore Count Test",

                        email:
                            "restorecount@example.com",

                        phone:
                            null,

                        service:
                            "Fire Weed Abatement",

                        propertyAddress:
                            null,

                        message:
                            "Test"

                    });


                await deleteContactRequest(
                    customer.id
                );


                expect(
                    await getDeletedCount()
                ).toBe(1);


                await restoreContactRequest(
                    customer.id
                );


                expect(
                    await getDeletedCount()
                ).toBe(0);

            }
        );

    }
);


// ======================================================
// COMPLETE DELETE / RECOVERY WORKFLOW
// ======================================================

describe(
    "Big Bull RON recovery workflow",
    () => {

        test(
            "customer can be created, deleted, and restored",
            async () => {

                // ==========================================
                // CREATE
                // ==========================================

                const customer =
                    await createContactRequest({

                        name:
                            "Workflow Customer",

                        email:
                            "workflow@example.com",

                        phone:
                            "9255559999",

                        service:
                            "Fire Weed Abatement",

                        propertyAddress:
                            "789 Workflow Road",

                        message:
                            "Complete workflow test"

                    });


                // ==========================================
                // CUSTOMER SHOULD BE ACTIVE
                // ==========================================

                let activeCustomers =
                    await getAllContactRequests();


                expect(
                    activeCustomers.length
                ).toBe(1);


                // ==========================================
                // DELETE
                // ==========================================

                await deleteContactRequest(
                    customer.id
                );


                // ==========================================
                // CUSTOMER SHOULD LEAVE ACTIVE DASHBOARD
                // ==========================================

                activeCustomers =
                    await getAllContactRequests();


                expect(
                    activeCustomers.length
                ).toBe(0);


                // ==========================================
                // CUSTOMER SHOULD APPEAR IN RECOVERY
                // ==========================================

                let deletedCustomers =
                    await getDeletedContactRequests();


                expect(
                    deletedCustomers.length
                ).toBe(1);


                expect(
                    deletedCustomers[0].id
                ).toBe(
                    customer.id
                );


                // ==========================================
                // RESTORE
                // ==========================================

                await restoreContactRequest(
                    customer.id
                );


                // ==========================================
                // RECOVERY SHOULD NOW BE EMPTY
                // ==========================================

                deletedCustomers =
                    await getDeletedContactRequests();


                expect(
                    deletedCustomers.length
                ).toBe(0);


                // ==========================================
                // CUSTOMER SHOULD RETURN TO DASHBOARD
                // ==========================================

                activeCustomers =
                    await getAllContactRequests();


                expect(
                    activeCustomers.length
                ).toBe(1);


                expect(
                    activeCustomers[0].id
                ).toBe(
                    customer.id
                );


                // ==========================================
                // COUNTERS SHOULD ALSO BE CORRECT
                // ==========================================

                expect(
                    await getDeletedCount()
                ).toBe(0);


                expect(
                    await getUnansweredCount()
                ).toBe(1);

            }
        );

    }
);