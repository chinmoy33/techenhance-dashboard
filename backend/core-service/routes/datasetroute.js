const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const csv = require("csv-parser");
const {
  getDataSet,
  getDataSetLanding,
  getDataSetById,
  deleteDataSet,
  updateDataSetName,
} = require("../controllers/datasetcontroller.js");

const supabase = require("../shared/supabase-config/supabaseClient.ts");

// Use memory storage instead of disk
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "text/csv") {
      cb(null, true);
    } else {
      cb(new Error("Only CSV files are allowed"));
    }
  },
});

// Get all datasets
router.get("", getDataSet);

router.get("/Landing", getDataSetLanding);

// Get specific dataset
router.get("/:id", getDataSetById);

router.put("/name/:id",updateDataSetName);

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

// async function insertDatasetChunks(results, baseName, chunkSize = 10000) {
//   const chunk = results.slice(0, chunkSize);
//   const { error } = await supabase.from("datasets").insert([
//     {
//       name: `${baseName}`,
//       data: chunk,
//       type: "uploaded",
//       created_at: new Date().toISOString(),
//     },
//   ]);

//   if (error) {
//     console.error(`Chunk insert failed :`, error.message || error);
//     throw error;
//   }
// }

// router.post("/upload/csv", upload.single("file"), async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: "No file uploaded" });
//   }

//   const results = [];
//   const bufferStream = require("streamifier").createReadStream(req.file.buffer);

//   try {
//     // Step 1: Parse the CSV
//     await new Promise((resolve, reject) => {
//       bufferStream
//         .pipe(csv())
//         .on("data", (data) => results.push(data))
//         .on("end", resolve)
//         .on("error", reject);
//     });

//     // Step 2: Chunked insert into Supabase
//     const baseName = req.file.originalname.replace(".csv", "");
//     await insertDatasetChunks(results, baseName, 10000); // Chunk size: 10k

//     res.json({
//       success: true,
//       message: "Data inserted in chunks",
//       total_rows: results.length,
//     });
//   } catch (error) {
//     console.error("Upload error:", error.message || error);
//     res.status(500).json({ error: "Error processing CSV file" });
//   }
// });

async function insertDatasetChunks(results, baseName, user_id, chunkSize = 10000) {
  const chunk = results.slice(0, chunkSize);
  const { error } = await supabase.from("datasets").insert([
    {
      name: `${baseName}`,
      data: chunk,
      type: "uploaded",
      created_at: new Date().toISOString(),
      user_id, // 👈 Include user ID
    },
  ]);

  if (error) {
    console.error(`Chunk insert failed :`, error.message || error);
    throw error;
  }
}

router.post("/upload/csv", upload.single("file"), async (req, res) => {
  const user_id = req.body.user_id;
  if (!req.file || !user_id) {
    return res.status(400).json({ error: "Missing file or user_id" });
  }

  const results = [];
  const bufferStream = require("streamifier").createReadStream(req.file.buffer);

  try {
    // Step 1: Parse the CSV
    await new Promise((resolve, reject) => {
      bufferStream
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", resolve)
        .on("error", reject);
    });

    // Step 2: Chunked insert into Supabase
    const baseName = req.file.originalname.replace(".csv", "");
    await insertDatasetChunks(results, baseName, user_id, 10000); // 👈 Pass user_id

    res.json({
      success: true,
      message: "Data inserted in chunks",
      total_rows: results.length,
    });
  } catch (error) {
    console.error("Upload error:", error.message || error);
    res.status(500).json({ error: "Error processing CSV file" });
  }
});


module.exports = router;
