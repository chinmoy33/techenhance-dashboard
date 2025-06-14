const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const csv = require("csv-parser");
const {
  getDataSet,
  getDataSetById,
  createDataSet,
  generateDataSet,
  deleteDataSet,
} = require("../controllers/datasetcontroller");

// File upload configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadDir = "uploads/";
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//     }
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const upload = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype === "text/csv" || file.mimetype === "application/json") {
//       cb(null, true);
//     } else {
//       cb(new Error("Only CSV and JSON files are allowed"));
//     }
//   },
// });

// Use memory storage instead of disk
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "text/csv") {
      cb(null, true);
    } else {
      cb(new Error("Only CSV files are allowed"));
    }
  },
});

// In-memory data store (in production, use a proper database)

// Get all datasets
router.get("", getDataSet);

// Get specific dataset
router.get("/:id", getDataSetById);

// Create new dataset
//router.post("", createDataSet);

// Update dataset
router.put("/:id", (req, res) => {
  const datasetIndex = datasets.findIndex((d) => d.id === req.params.id);
  if (datasetIndex === -1) {
    return res.status(404).json({ error: "Dataset not found" });
  }

  const { name, data, type } = req.body;
  datasets[datasetIndex] = {
    ...datasets[datasetIndex],
    name: name || datasets[datasetIndex].name,
    data: data || datasets[datasetIndex].data,
    type: type || datasets[datasetIndex].type,
    updatedAt: new Date().toISOString(),
  };

  res.json(datasets[datasetIndex]);
});

// Delete dataset
router.delete("/:id", deleteDataSet);

// Generate sample data
//router.post("/generate/:type", generateDataSet);

// Upload CSV file
// router.post("/upload/csv", upload.single("file"), (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: "No file uploaded" });
//   }

//   const results = [];
//   const filePath = req.file.path;

//   fs.createReadStream(filePath)
//     .pipe(csv())
//     .on("data", (data) => results.push(data))
//     .on("end", () => {
//       // Clean up uploaded file
//       fs.unlinkSync(filePath);

//       const newDataset = {
//         id: Date.now().toString(),
//         name: req.file.originalname.replace(".csv", ""),
//         data: results,
//         type: "uploaded",
//         createdAt: new Date().toISOString(),
//       };

//       datasets.push(newDataset);
//       res.json(newDataset);
//     })
//     .on("error", (error) => {
//       fs.unlinkSync(filePath);
//       res.status(500).json({ error: "Error processing CSV file" });
//     });
// });

// Upload CSV file with pg
// router.post("/upload/csv", upload.single("file"), async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: "No file uploaded" });
//   }

//   const results = [];
//   const filePath = req.file.path;

//   try {
//     // Read CSV file
//     await new Promise((resolve, reject) => {
//       fs.createReadStream(filePath)
//         .pipe(csv())
//         .on("data", (data) => results.push(data))
//         .on("end", resolve)
//         .on("error", reject);
//     });

//     // Insert into PostgreSQL
//     const result = await pool.query(
//       `INSERT INTO datasets (name, data, type, created_at)
//        VALUES ($1, $2, $3, NOW())
//        RETURNING *`,
//       [
//         req.file.originalname.replace(".csv", ""),
//         JSON.stringify(results),
//         "uploaded",
//       ]
//     );

//     // Clean up uploaded file
//     fs.unlinkSync(filePath);

//     res.json(result.rows[0]);
//   } catch (error) {
//     // Clean up file on error
//     if (fs.existsSync(filePath)) {
//       fs.unlinkSync(filePath);
//     }
//     console.error("Upload error:", error);
//     res.status(500).json({ error: "Error processing CSV file" });
//   }
// });

router.post("/upload/csv", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const results = [];
  const bufferStream = require("streamifier").createReadStream(req.file.buffer);

  try {
    // Parse CSV from buffer
    await new Promise((resolve, reject) => {
      bufferStream
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", resolve)
        .on("error", reject);
    });

    // Upload the file to Supabase Storage (optional)
    const fileName = `${Date.now()}-${req.file.originalname}`;
    const { error: uploadError } = await supabase.storage
      .from("uploads") // Make sure this bucket exists in Supabase
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // Insert parsed data into Supabase database
    const { data, error } = await supabase
      .from("datasets")
      .insert([
        {
          name: req.file.originalname.replace(".csv", ""),
          data: results,
          type: "uploaded",
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error("Upload error:", error.message || error);
    res.status(500).json({ error: "Error processing CSV file" });
  }
});

module.exports = router;
