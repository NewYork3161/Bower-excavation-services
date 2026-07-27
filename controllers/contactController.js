// Display contact page
exports.getContact = (req, res) => {

    res.render("contact");

};



// Handle contact form submission
exports.submitContact = (req, res) => {

    const {
        name,
        email,
        message
    } = req.body;


    console.log("New Contact Request:");
    console.log("--------------------");
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Message:", message);


    res.send(`
        <h1>Thank you!</h1>
        <p>Your request has been received.</p>
        <a href="/">Return Home</a>
    `);

};