exports.exampleGet = async (req, res) => {
    try {
        req.user;
        // console.log(req.user);
        const data = {
            message: "This is an example response",
            number: req.query.number * 10,
        };
        console.log(data);
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.examplePost = async (req, res) => {
    try {
        const data = {
            message: "This is an Phong's example response",
            number: req.body.number * 10,
        };
        console.log(data);
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
