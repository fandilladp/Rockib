const { default: axios } = require("axios");
const Log = require("../models/db");

const postUtilizationData = async (appName) => {
  try {
    const response = await axios.post(
      process.env.HOSTUTILITOR,
      {
        appName,
        datetime: new Date().toISOString(),
      },
      {
        headers: {
          Authorization: process.env.TOKENUTILITOR,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Utilization data posted successfully:", response.data);
  } catch (err) {
    console.error("Error posting utilization data:", err.message);
  }
};

// POST /addLog
exports.addLog = async (req, res) => {
  const { app, section, subsection, data } = req.body;

  try {
    const newLog = new Log({
      app,
      section,
      subsection, // Include subsection in the new log
      data,
    });

    await newLog.save();
    res.status(201).json({ message: "Log added successfully", newLog });
    postUtilizationData("Rockib_postLogs");
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /getData/:app/:section?
// or GET /getData?app=xxxx&section=xxxxx&subsection=xxxxxx
exports.getData = async (req, res) => {
  let { app, section, subsection } = req.params;
  const { limitFrom, limitTo, startDate, endDate } = req.query;

  // If app, section, and subsection are not found in params, check query params
  if (!app) {
    app = req.query.app;
  }
  if (!section) {
    section = req.query.section;
  }
  if (!subsection) {
    subsection = req.query.subsection;
  }

  if (!app) {
    return res.status(400).json({ message: "App parameter is required" });
  }

  let query = { app };
  if (section) {
    query.section = section;
  }
  if (subsection) {
    query.subsection = subsection;
  }

  // Filter by date range if startDate and/or endDate are provided
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) {
      query.createdAt.$gte = new Date(startDate);
    }
    if (endDate) {
      query.createdAt.$lte = new Date(endDate);
    }
  }

  try {
    let logsQuery = Log.find(query).sort({ createdAt: -1 }); // Sort by createdAt descending

    if (limitFrom && limitTo) {
      logsQuery = logsQuery
        .skip(parseInt(limitFrom))
        .limit(parseInt(limitTo) - parseInt(limitFrom) + 1);
    }

    const logs = await logsQuery.exec();
    res.status(200).json(logs);
    postUtilizationData("Rockib_getLogs");
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
// GET /searchLogs/:app/:section/:subsection?
exports.searchLogs = async (req, res) => {
  let { app, section, subsection } = req.params;
  const { data } = req.query;

  // Check if app, section, and subsection exist in params or query
  if (!app) {
    app = req.query.app;
  }
  if (!section) {
    section = req.query.section;
  }
  if (!subsection) {
    subsection = req.query.subsection;
  }

  // Return error if app is missing
  if (!app) {
    return res.status(400).json({ message: "App parameter is required" });
  }

  // Construct the query object
  let query = { app, section };
  if (subsection) {
    query.subsection = subsection;
  }

  // Dynamically search across all fields in `data`
  if (data) {
    query['$or'] = [
      { 'data.id': { $regex: new RegExp(data, 'i') } },
      { 'data._id': { $regex: new RegExp(data, 'i') } },
      { 'data.page': { $regex: new RegExp(data, 'i') } },
      { 'data.key': { $regex: new RegExp(data, 'i') } },
      // Add more dynamic fields or apply to all fields within `data`
    ];
  }

  try {
    // Execute query and sort results by createdAt (descending)
    const logs = await Log.find(query).sort({ createdAt: -1 }).exec();
    
    // Check if any logs are found
    if (!logs.length) {
      return res.status(404).json({ message: "No logs found matching the criteria" });
    }

    // Return the found logs
    res.status(200).json(logs);
    
    // Post utilization data (optional, based on your logic)
    postUtilizationData("Rockib_searchLogs");
    
  } catch (err) {
    // Handle server errors
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

