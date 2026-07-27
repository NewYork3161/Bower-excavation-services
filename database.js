// ======================================================
// BOWER COMPANY CONSTRUCTION
// SQLITE DATABASE
// database.js
// ======================================================


const sqlite3 = require("sqlite3").verbose();
const path = require("path");


// ======================================================
// DATABASE FILE LOCATION
// ======================================================
//
// excavation-website/
//     database/
//         bower_company.db
//
// ======================================================

const DATABASE_PATH = path.join(
    __dirname,
    "database",
    "bower_company.db"
);


// ======================================================
// CONNECT TO SQLITE
// ======================================================

const db = new sqlite3.Database(
    DATABASE_PATH,
    (error) => {

        if (error) {

            console.error(
                "SQLite connection error:",
                error.message
            );

            return;
        }

        console.log("");
        console.log("======================================");
        console.log(" BOWER COMPANY DATABASE");
        console.log("======================================");
        console.log(" SQLite connected successfully.");
        console.log("======================================");
        console.log("");

    }
);


// ======================================================
// CREATE CONTACT REQUEST TABLE
// ======================================================
//
// deleted:
//
// 0 = active
// 1 = deleted / recoverable
//
// Nothing is permanently deleted from the database
// through the Big Bull RON dashboard.
//
// ======================================================

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS contact_requests (

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
    `);


    // ==================================================
    // DATABASE MIGRATION
    // ==================================================
    //
    // Existing databases may have been created before
    // the deleted and deleted_at columns existed.
    //
    // PRAGMA table_info lets us safely check the table
    // before attempting to add the columns.
    //
    // ==================================================

    db.all(
        `PRAGMA table_info(contact_requests)`,
        [],
        (error, columns) => {

            if (error) {

                console.error(
                    "Database migration check error:",
                    error.message
                );

                return;
            }


            const columnNames =
                columns.map(column => column.name);


            // ==========================================
            // ADD deleted COLUMN
            // ==========================================

            if (!columnNames.includes("deleted")) {

                db.run(
                    `
                    ALTER TABLE contact_requests
                    ADD COLUMN deleted INTEGER NOT NULL DEFAULT 0
                    `,
                    (error) => {

                        if (error) {

                            console.error(
                                "Error adding deleted column:",
                                error.message
                            );

                            return;
                        }

                        console.log(
                            "Database migration: deleted column added."
                        );

                    }
                );

            }


            // ==========================================
            // ADD deleted_at COLUMN
            // ==========================================

            if (!columnNames.includes("deleted_at")) {

                db.run(
                    `
                    ALTER TABLE contact_requests
                    ADD COLUMN deleted_at DATETIME
                    `,
                    (error) => {

                        if (error) {

                            console.error(
                                "Error adding deleted_at column:",
                                error.message
                            );

                            return;
                        }

                        console.log(
                            "Database migration: deleted_at column added."
                        );

                    }
                );

            }

        }
    );

});


// ======================================================
// CREATE CONTACT REQUEST
// ======================================================

function createContactRequest({

    name,
    email,
    phone,
    service,
    propertyAddress,
    message

}) {

    return new Promise((resolve, reject) => {

        const sql = `

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

        `;


        db.run(

            sql,

            [
                name,
                email,
                phone || null,
                service || null,
                propertyAddress || null,
                message
            ],

            function (error) {

                if (error) {

                    console.error(
                        "Error saving contact request:",
                        error.message
                    );

                    reject(error);

                    return;
                }


                resolve({

                    id: this.lastID,

                    name,
                    email,
                    phone,
                    service,
                    propertyAddress,
                    message,

                    responded: false,
                    deleted: false

                });

            }

        );

    });

}


// ======================================================
// GET ALL ACTIVE CONTACT REQUESTS
// ======================================================
//
// Deleted requests DO NOT appear on Big Bull RON.
//
// SORTING:
//
// 1. Unanswered requests first
// 2. Responded requests second
// 3. Newest first
//
// ======================================================

function getAllContactRequests() {

    return new Promise((resolve, reject) => {

        const sql = `

            SELECT *

            FROM contact_requests

            WHERE deleted = 0

            ORDER BY

                responded ASC,

                created_at DESC,

                id DESC

        `;


        db.all(

            sql,

            [],

            (error, rows) => {

                if (error) {

                    console.error(
                        "Error loading contact requests:",
                        error.message
                    );

                    reject(error);

                    return;
                }


                resolve(rows);

            }

        );

    });

}


// ======================================================
// GET ONE CONTACT REQUEST
// ======================================================

function getContactRequestById(id) {

    return new Promise((resolve, reject) => {

        const sql = `

            SELECT *

            FROM contact_requests

            WHERE id = ?

        `;


        db.get(

            sql,

            [id],

            (error, row) => {

                if (error) {

                    console.error(
                        "Error loading contact request:",
                        error.message
                    );

                    reject(error);

                    return;
                }


                resolve(row);

            }

        );

    });

}


// ======================================================
// MARK REQUEST AS RESPONDED
// ======================================================
//
// Used after Ron confirms that he sent the email.
//
// responded = 1
// responded_at = current time
//
// ======================================================

function markRequestResponded(
    id,
    response = null
) {

    return new Promise((resolve, reject) => {

        const sql = `

            UPDATE contact_requests

            SET

                responded = 1,

                response = ?,

                responded_at = CURRENT_TIMESTAMP

            WHERE id = ?

            AND deleted = 0

        `;


        db.run(

            sql,

            [
                response,
                id
            ],

            function (error) {

                if (error) {

                    console.error(
                        "Error marking contact request responded:",
                        error.message
                    );

                    reject(error);

                    return;
                }


                resolve({

                    id,

                    responded: true,

                    response,

                    changes: this.changes

                });

            }

        );

    });

}


// ======================================================
// MARK REQUEST AS UNANSWERED
// ======================================================
//
// Allows a responded request to be reopened.
//
// ======================================================

function markRequestUnanswered(id) {

    return new Promise((resolve, reject) => {

        const sql = `

            UPDATE contact_requests

            SET

                responded = 0,

                response = NULL,

                responded_at = NULL

            WHERE id = ?

            AND deleted = 0

        `;


        db.run(

            sql,

            [id],

            function (error) {

                if (error) {

                    console.error(
                        "Error resetting contact request:",
                        error.message
                    );

                    reject(error);

                    return;
                }


                resolve({

                    id,

                    responded: false,

                    changes: this.changes

                });

            }

        );

    });

}


// ======================================================
// SOFT DELETE CONTACT REQUEST
// ======================================================
//
// IMPORTANT:
//
// This DOES NOT permanently delete the customer.
//
// Instead:
//
// deleted = 1
// deleted_at = current time
//
// The request disappears from Big Bull RON but remains
// inside SQLite so it can be recovered later.
//
// ======================================================

function deleteContactRequest(id) {

    return new Promise((resolve, reject) => {

        const sql = `

            UPDATE contact_requests

            SET

                deleted = 1,

                deleted_at = CURRENT_TIMESTAMP

            WHERE id = ?

            AND deleted = 0

        `;


        db.run(

            sql,

            [id],

            function (error) {

                if (error) {

                    console.error(
                        "Error deleting contact request:",
                        error.message
                    );

                    reject(error);

                    return;
                }


                resolve({

                    id,

                    deleted: this.changes > 0,

                    changes: this.changes

                });

            }

        );

    });

}


// ======================================================
// GET DELETED CONTACT REQUESTS
// ======================================================
//
// Used by:
//
// Big Bull RON
//      → Hamburger Menu
//      → Recover Deleted Files
//
// Newest deleted requests appear first.
//
// ======================================================

function getDeletedContactRequests() {

    return new Promise((resolve, reject) => {

        const sql = `

            SELECT *

            FROM contact_requests

            WHERE deleted = 1

            ORDER BY

                deleted_at DESC,

                id DESC

        `;


        db.all(

            sql,

            [],

            (error, rows) => {

                if (error) {

                    console.error(
                        "Error loading deleted contact requests:",
                        error.message
                    );

                    reject(error);

                    return;
                }


                resolve(rows);

            }

        );

    });

}


// ======================================================
// RESTORE DELETED CONTACT REQUEST
// ======================================================
//
// Restores the request to the normal Big Bull RON
// dashboard.
//
// ======================================================

function restoreContactRequest(id) {

    return new Promise((resolve, reject) => {

        const sql = `

            UPDATE contact_requests

            SET

                deleted = 0,

                deleted_at = NULL

            WHERE id = ?

            AND deleted = 1

        `;


        db.run(

            sql,

            [id],

            function (error) {

                if (error) {

                    console.error(
                        "Error restoring contact request:",
                        error.message
                    );

                    reject(error);

                    return;
                }


                resolve({

                    id,

                    restored: this.changes > 0,

                    changes: this.changes

                });

            }

        );

    });

}


// ======================================================
// GET NUMBER OF UNANSWERED REQUESTS
// ======================================================
//
// Deleted requests DO NOT count.
//
// ======================================================

function getUnansweredCount() {

    return new Promise((resolve, reject) => {

        const sql = `

            SELECT COUNT(*) AS count

            FROM contact_requests

            WHERE responded = 0

            AND deleted = 0

        `;


        db.get(

            sql,

            [],

            (error, row) => {

                if (error) {

                    console.error(
                        "Error counting unanswered requests:",
                        error.message
                    );

                    reject(error);

                    return;
                }


                resolve(row ? row.count : 0);

            }

        );

    });

}


// ======================================================
// GET NUMBER OF DELETED REQUESTS
// ======================================================
//
// Can be displayed later inside the hamburger menu:
//
// Recover Deleted Files (3)
//
// ======================================================

function getDeletedCount() {

    return new Promise((resolve, reject) => {

        const sql = `

            SELECT COUNT(*) AS count

            FROM contact_requests

            WHERE deleted = 1

        `;


        db.get(

            sql,

            [],

            (error, row) => {

                if (error) {

                    console.error(
                        "Error counting deleted requests:",
                        error.message
                    );

                    reject(error);

                    return;
                }


                resolve(row ? row.count : 0);

            }

        );

    });

}


// ======================================================
// CLOSE DATABASE
// ======================================================

function closeDatabase() {

    return new Promise((resolve, reject) => {

        db.close((error) => {

            if (error) {

                reject(error);

                return;
            }


            console.log(
                "SQLite database connection closed."
            );


            resolve();

        });

    });

}


// ======================================================
// EXPORT DATABASE FUNCTIONS
// ======================================================

module.exports = {

    db,

    createContactRequest,

    getAllContactRequests,

    getContactRequestById,

    markRequestResponded,

    markRequestUnanswered,

    deleteContactRequest,

    getDeletedContactRequests,

    restoreContactRequest,

    getUnansweredCount,

    getDeletedCount,

    closeDatabase

};