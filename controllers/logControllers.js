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
  const key = req.headers['app-key'];  // Ambil app-key dari header, bisa undefined jika tidak ada

  try {

    const newLog = new Log({
      app,
      section,
      subsection,
      data,
    });
    if (key) {
      newLog.key = key;
    }

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
  const appKey = req.headers['app-key'];  // Ambil app-key dari header

  console.log("Received app-key:", appKey);  // Debug log
  console.log("Received app:", app);  // Debug log

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

  // Membuat query berdasarkan apakah app-key ada atau tidak
  let query = { app };

  if (section) {
    query.section = section;
  }
  if (subsection) {
    query.subsection = subsection;
  }

  if (appKey) {
    // Jika app-key ada di header, hanya cari data yang memiliki key yang sesuai
    query.key = appKey;
  } else {
    // Jika tidak ada app-key, hanya cari data yang tidak memiliki key
    query.key = { $exists: false };
  }

  // Debug log untuk memeriksa query sebelum pencarian
  console.log("Query to MongoDB:", query);

  try {
    let logsQuery = Log.find(query).sort({ createdAt: -1 });

    if (limitFrom && limitTo) {
      logsQuery = logsQuery
        .skip(parseInt(limitFrom))
        .limit(parseInt(limitTo) - parseInt(limitFrom) + 1);
    }

    const logs = await logsQuery.exec();
    if (!logs.length) {
      return res.status(404).json({ message: "No logs found matching the criteria" });
    }

    res.status(200).json(logs);
    postUtilizationData("Rockib_GetLogs");
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// GET /searchLogs/:app/:section/:subsection?
// GET /searchLogs/:app/:section/:subsection?
exports.searchLogs = async (req, res) => {
  let { app, section, subsection } = req.params;
  const { data } = req.query;
  const appKey = req.headers['app-key'];  // Ambil app-key dari header

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

  let query = { app, section };

  if (subsection) {
    query.subsection = subsection;
  }

  // Jika ada parameter `data`, cari exact match di salah satu dari 4 field
  if (data) {
    console.log("oke")
    query['$or'] = [
      { 'data.id': data },    // Mencari exact match pada 'data.id'
      { 'data._id': data },   // Mencari exact match pada 'data._id'
      { 'data.page': data },  // Mencari exact match pada 'data.page'
      { 'data.key': data }    // Mencari exact match pada 'data.key'
    ];
  }

  // Jika app-key ada di header, filter data yang memiliki key sesuai dengan app-key
  if (appKey) {
    query.key = appKey;
  } else {
    // Jika tidak ada app-key, hanya kembalikan data tanpa field `key`
    query.key = { $exists: false };
  }

  try {
    const logs = await Log.find(query).sort({ createdAt: -1 }).exec();
    
    // Jika tidak ada data yang cocok
    if (!logs.length) {
      return res.status(200).json({ message: "Data tidak tersedia", data: [] });
    }

    res.status(200).json(logs);
    postUtilizationData("Rockib_ElasticLogs");
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};





