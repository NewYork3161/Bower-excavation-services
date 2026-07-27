// ======================================================
// BOWER COMPANY CONSTRUCTION
// CONTACT REQUEST MODEL
// models/ContactRequest.js
// ======================================================

const mongoose = require("mongoose");


// ======================================================
// CONTACT REQUEST SCHEMA
// ======================================================

const contactRequestSchema =
    new mongoose.Schema(
        {

            // ==================================================
            // CUSTOMER NAME
            // ==================================================

            name: {
                type: String,
                required: true,
                trim: true,
                maxlength: 150
            },


            // ==================================================
            // CUSTOMER EMAIL
            // ==================================================

            email: {
                type: String,
                required: true,
                trim: true,
                lowercase: true,
                maxlength: 254
            },


            // ==================================================
            // CUSTOMER PHONE
            // ==================================================

            phone: {
                type: String,
                default: null,
                trim: true,
                maxlength: 50
            },


            // ==================================================
            // REQUESTED SERVICE
            // ==================================================

            service: {
                type: String,
                default: null,
                trim: true,
                maxlength: 200
            },


            // ==================================================
            // PROPERTY ADDRESS
            // ==================================================

            property_address: {
                type: String,
                default: null,
                trim: true,
                maxlength: 500
            },


            // ==================================================
            // CUSTOMER MESSAGE
            // ==================================================

            message: {
                type: String,
                required: true,
                trim: true,
                maxlength: 10000
            },


            // ==================================================
            // RESPONDED STATUS
            // ==================================================

            responded: {
                type: Boolean,
                default: false,
                index: true
            },


            // ==================================================
            // RESPONDED DATE
            // ==================================================

            responded_at: {
                type: Date,
                default: null
            },


            // ==================================================
            // SOFT DELETE STATUS
            // ==================================================
            //
            // We do NOT permanently delete customer requests.
            // Big Bull RON moves them into Recovery instead.
            //
            // ==================================================

            deleted: {
                type: Boolean,
                default: false,
                index: true
            },


            // ==================================================
            // DELETED DATE
            // ==================================================

            deleted_at: {
                type: Date,
                default: null
            }

        },
        {

            // ==================================================
            // AUTOMATIC CREATED / UPDATED DATES
            // ==================================================
            //
            // MongoDB automatically creates:
            //
            // createdAt
            // updatedAt
            //
            // ==================================================

            timestamps: true,


            // ==================================================
            // JSON SETTINGS
            // ==================================================

            toJSON: {
                virtuals: true
            },

            toObject: {
                virtuals: true
            }

        }
    );


// ======================================================
// INDEXES
// ======================================================
//
// These help MongoDB efficiently find:
//
// active requests
// unanswered requests
// deleted requests
//
// ======================================================

contactRequestSchema.index({
    deleted: 1,
    createdAt: -1
});

contactRequestSchema.index({
    deleted: 1,
    responded: 1,
    createdAt: -1
});


// ======================================================
// COMPATIBILITY TRANSFORM
// ======================================================
//
// Your existing Big Bull RON application expects:
//
// request.id
//
// Mongoose provides a virtual "id" based on MongoDB's
// "_id", so existing EJS code can continue using:
//
// submission.id
//
// ======================================================

contactRequestSchema.set(
    "toJSON",
    {
        virtuals: true,
        transform: function (doc, ret) {

            ret.id =
                ret._id.toString();

            return ret;

        }
    }
);


// ======================================================
// CREATE MODEL
// ======================================================

const ContactRequest =
    mongoose.models.ContactRequest ||
    mongoose.model(
        "ContactRequest",
        contactRequestSchema
    );


// ======================================================
// EXPORT MODEL
// ======================================================

module.exports = ContactRequest;