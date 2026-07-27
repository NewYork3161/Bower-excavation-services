const db = require("../database/database");


// Display all services
exports.getServices = (req, res) => {

    const sql = `
        SELECT *
        FROM services
        ORDER BY created_at DESC
    `;


    db.all(sql, [], (err, services) => {

        if (err) {
            console.error(err);
            return res.status(500).send("Database error");
        }


        res.render("services", {
            services: services
        });

    });

};



// Display single service
exports.getServiceById = (req, res) => {

    const id = req.params.id;


    const sql = `
        SELECT *
        FROM services
        WHERE id = ?
    `;


    db.get(sql, [id], (err, service) => {

        if (err) {
            console.error(err);
            return res.status(500).send("Database error");
        }


        if (!service) {
            return res.status(404).send("Service not found");
        }


        res.json(service);

    });

};



// Create service
exports.createService = (req, res) => {

    const {
        title,
        description
    } = req.body;


    const sql = `
        INSERT INTO services
        (title, description)
        VALUES (?, ?)
    `;


    db.run(
        sql,
        [title, description],
        function(err) {

            if (err) {
                console.error(err);
                return res.status(500).send("Database error");
            }


            res.redirect("/services");

        }
    );

};



// Update service
exports.updateService = (req, res) => {

    const id = req.params.id;

    const {
        title,
        description
    } = req.body;


    const sql = `
        UPDATE services
        SET title = ?, description = ?
        WHERE id = ?
    `;


    db.run(
        sql,
        [title, description, id],
        function(err) {

            if (err) {
                console.error(err);
                return res.status(500).send("Database error");
            }


            res.redirect("/services");

        }
    );

};



// Delete service
exports.deleteService = (req, res) => {

    const id = req.params.id;


    const sql = `
        DELETE FROM services
        WHERE id = ?
    `;


    db.run(
        sql,
        [id],
        function(err) {

            if (err) {
                console.error(err);
                return res.status(500).send("Database error");
            }


            res.redirect("/services");

        }
    );

};