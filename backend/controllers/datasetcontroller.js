//const pool = require("../db");
const supabase = require("../supabaseClient.ts");

// let datasets = [
//   {
//     id: "1",
//     name: "Sales Data",
//     data: [
//       { month: "Jan", sales: 1200, revenue: 15000 },
//       { month: "Feb", sales: 1900, revenue: 23000 },
//       { month: "Mar", sales: 3000, revenue: 35000 },
//       { month: "Apr", sales: 5000, revenue: 58000 },
//       { month: "May", sales: 4200, revenue: 48000 },
//       { month: "Jun", sales: 3800, revenue: 42000 },
//     ],
//     type: "time_series",
//     createdAt: new Date().toISOString(),
//   },
//   {
//     id: "2",
//     name: "Product Categories",
//     data: [
//       { category: "Electronics", value: 35 },
//       { category: "Clothing", value: 25 },
//       { category: "Books", value: 15 },
//       { category: "Home & Garden", value: 15 },
//       { category: "Sports", value: 10 },
//     ],
//     type: "categorical",
//     createdAt: new Date().toISOString(),
//   },
//   {
//     id: "3",
//     name: "Age Distribution",
//     data: Array.from({ length: 50 }, (_, i) => ({
//       age: 18 + i,
//       count: Math.floor(Math.random() * 100) + 10,
//     })),
//     type: "distribution",
//     createdAt: new Date().toISOString(),
//   },
// ];

// Returns a json obj with params {id, name, type, createdAt, dataPoints}
// Returns all the present data sets
// const getDataSet = async (req, res) => {
//   const datasetsInfo = datasets.map(({ id, name, type, createdAt }) => ({
//     //uses object literal shorthand like Same as { id: id, name: name }
//     id,
//     name,
//     type,
//     createdAt,
//     dataPoints: datasets.find((d) => d.id === id)?.data.length || 0,
//   }));
//   res.json(datasetsInfo);
// };

// Get all datasets with pg
// const getDataSet = async (req, res) => {
//   try {
//     const result = await pool.query(`
//       SELECT id, name, type, created_at as "createdAt",
//              jsonb_array_length(data) as "dataPoints"
//       FROM datasets
//       ORDER BY created_at DESC
//     `);
//     res.json(result.rows);
//   } catch (error) {
//     console.error("Database error:", error);
//     res.status(500).json({ error: "Failed to fetch datasets" });
//   }
// };
// const getDataSet = async (req, res) => {
//   try {
//     const { data, error } = await supabase
//       .from('datasets')
//       .select(`
//         id,
//         name,
//         type,
//         created_at,
//         data
//       `)
//       .order('created_at', { ascending: false });

//     if (error) {
//       throw error;
//     }

//     // Map to include "dataPoints" count and rename fields
//     const formatted = data.map(dataset => ({
//       id: dataset.id,
//       name: dataset.name,
//       type: dataset.type,
//       createdAt: dataset.created_at,
//       dataPoints: Array.isArray(dataset.data) ? dataset.data.length : 0,
//     }));
//     console.log("Formatted datasets:", formatted);

//     res.json(formatted);
//   } catch (error) {
//     console.error("Supabase query error:", error);
//     res.status(500).json({ error: "Failed to fetch datasets" });
//   }
// };
const getDataSet = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("datasets")
      .select(
        `
        id,
        name,
        type,
        created_at,
        data
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    // Include full data content
    const formatted = data.map((dataset) => ({
      id: dataset.id,
      name: dataset.name,
      type: dataset.type,
      createdAt: dataset.created_at,
      dataPoints: Array.isArray(dataset.data) ? dataset.data.length : 0,
      data: dataset.data, // include full JSON array
    }));

    console.log("Formatted datasets:", formatted);

    res.json(formatted);
  } catch (error) {
    console.error("Supabase query error:", error);
    res.status(500).json({ error: "Failed to fetch datasets" });
  }
};

// Returns the data set that is requested by the frontend with the help of id
// const getDataSetById = async (req, res) => {
//   const dataset = datasets.find((d) => d.id === req.params.id);
//   if (!dataset) {
//     return res.status(404).json({ error: "Dataset not found" });
//   }
//   res.json(dataset);
// };

// Get dataset by ID with pg
// const getDataSetById = async (req, res) => {
//   try {
//     const result = await pool.query("SELECT * FROM datasets WHERE id = $1", [
//       req.params.id,
//     ]);

//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: "Dataset not found" });
//     }

//     res.json(result.rows[0]);
//   } catch (error) {
//     console.error("Database error:", error);
//     res.status(500).json({ error: "Failed to fetch dataset" });
//   }
// };

const getDataSetById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("datasets")
      .select("*")
      .eq("id", req.params.id)
      .single(); // ensures one result

    if (error) {
      if (error.code === "PGRST116") {
        // Not found
        return res.status(404).json({ error: "Dataset not found" });
      }
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error("Supabase error:", error);
    res.status(500).json({ error: "Failed to fetch dataset" });
  }
};

// const createDataSet = async (req, res) => {
//   const { name, data, type } = req.body;

//   if (!name || !data || !Array.isArray(data)) {
//     return res.status(400).json({ error: "Invalid dataset format" });
//   }

//   const newDataset = {
//     id: Date.now().toString(),
//     name,
//     data,
//     type: type || "generic",
//     createdAt: new Date().toISOString(),
//   };

//   datasets.push(newDataset);
//   res.status(201).json(newDataset);
// };

// Create new dataset with pg
// const createDataSet = async (req, res) => {
//   const { name, data, type } = req.body;

//   try {
//     const result = await pool.query(
//       `INSERT INTO datasets (name, data, type)
//        VALUES ($1, $2, $3)
//        RETURNING *`,
//       [name, JSON.stringify(data), type]
//     );

//     res.status(201).json(result.rows[0]);
//   } catch (error) {
//     console.error("Database error:", error);
//     res.status(500).json({ error: "Failed to create dataset" });
//   }
// };

// const generateDataSet = async (req, res) => {
//   const { type } = req.params;
//   const { count = 50, name = `Generated ${type} Data` } = req.body;

//   let data = [];

//   switch (type) {
//     case "linear":
//       data = Array.from({ length: count }, (_, i) => ({
//         x: i,
//         y: i * 2 + Math.random() * 10 - 5,
//       }));
//       break;

//     case "normal":
//       data = Array.from({ length: count }, () => {
//         const u1 = Math.random();
//         const u2 = Math.random();
//         const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
//         return { value: z0 * 10 + 50 };
//       });
//       break;

//     case "exponential":
//       data = Array.from({ length: count }, (_, i) => ({
//         x: i,
//         y: Math.exp(i * 0.1) + Math.random() * 5,
//       }));
//       break;

//     default:
//       return res.status(400).json({ error: "Invalid data type" });
//   }

//   const newDataset = {
//     id: Date.now().toString(),
//     name,
//     data,
//     type: "generated",
//     createdAt: new Date().toISOString(),
//   };

//   datasets.push(newDataset);
//   res.json(newDataset);
// };

// const deleteDataSet = async (req, res) => {
//   const datasetIndex = datasets.findIndex((d) => d.id === req.params.id);
//   if (datasetIndex === -1) {
//     return res.status(404).json({ error: "Dataset not found" });
//   }

//   datasets.splice(datasetIndex, 1);
//   res.status(204).send();
// };

// Delete dataset
// const deleteDataSet = async (req, res) => {
//   try {
//     const result = await pool.query(
//       "DELETE FROM datasets WHERE id = $1 RETURNING *",
//       [req.params.id]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: "Dataset not found" });
//     }

//     res.status(204).send();
//   } catch (error) {
//     console.error("Database error:", error);
//     res.status(500).json({ error: "Failed to delete dataset" });
//   }
// };

const deleteDataSet = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("datasets")
      .delete()
      .eq("id", req.params.id)
      .select() // Needed to return the deleted row(s)
      .single(); // Expecting only one

    if (error) {
      if (error.code === "PGRST116") {
        // Not found
        return res.status(404).json({ error: "Dataset not found" });
      }
      throw error;
    }

    res.status(204).send(); // Success, no content
  } catch (error) {
    console.error("Supabase error:", error);
    res.status(500).json({ error: "Failed to delete dataset" });
  }
};

module.exports = {
  getDataSet,
  getDataSetById,
  //createDataSet,
  //generateDataSet,
  deleteDataSet,
};
