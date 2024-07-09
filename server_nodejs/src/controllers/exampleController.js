exports.exampleGet = async (req, res) => {
    try {
        req.user
        const data = {
            message: "This is an example response",
            number: req.query.number * 10,
        };
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
