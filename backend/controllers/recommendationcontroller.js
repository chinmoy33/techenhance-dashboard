// const pool = require("../db");

// const getRecommendations = async (req, res) => {
//     try{
//         //Machine Learning model logic would go here

//         //The output of machine learning model will be stored in a table

//         // For now, we will simulate recommendations with a simple query

//         const result = await pool.query("SELECT * FROM recommendations");
//         if (result.rows.length === 0) {
//             return res.status(404).json({ message: "No recommendations found" });
//         }

//         return res.json(result.rows);
//     }
//     catch(error){
//         console.error("Error fetching recommendations:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };

// module.exports = {
//     getRecommendations,
// };
// recommendationsController.ts
// const { supabase } = require("../supabaseClient.ts");

// const getRecommendations = async (req, res) => {
//   try {
//     // Replace this with your ML model logic if needed

//     const { data, error } = await supabase
//       .from("recommendations")
//       .select("*");

//     if (error) {
//       console.error("Supabase query error:", error);
//       return res.status(500).json({ error: "Failed to fetch data from Supabase" });
//     }

//     if (!data || data.length === 0) {
//       return res.status(404).json({ message: "No recommendations found" });
//     }

//     return res.json(data);
//   } catch (err) {
//     console.error("Unexpected error:", err);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

// module.exports = {
//   getRecommendations,
// };

const supabase = require("../supabaseClient.ts");

const getRecommendations = async (req, res) => {
  try {
    // Here you would typically run your machine learning model logic
    // For now, we will simulate recommendations with a simple query

    const { data, error } = await supabase.from("recommendations").select("*");

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ error: "Supabase error" });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "No recommendations found" });
    }

    return res.json(data);
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getRecommendations,
};
