const Log = require('../models/db');

// POST /addLog
exports.addLog = async (req, res) => {
    const { app, section, data } = req.body;
    
    try {
        const newLog = new Log({
            app,
            section,
            data,
        });
        
        await newLog.save();
        res.status(201).json({ message: 'Log added successfully', newLog });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// GET /getData/:app/:section?
exports.getData = async (req, res) => {
    const { app, section } = req.params;
    const { limitFrom, limitTo } = req.query;

    let query = { app };
    if (section) {
        query.section = section;
    }

    try {
        let logsQuery = Log.find(query);

        if (limitFrom && limitTo) {
            logsQuery = logsQuery
                .skip(parseInt(limitFrom))
                .limit(parseInt(limitTo) - parseInt(limitFrom) + 1);
        }

        const logs = await logsQuery.exec();
        res.status(200).json(logs);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
