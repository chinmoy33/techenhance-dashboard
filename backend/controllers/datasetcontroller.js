const supabase = require("../supabaseClient.ts");

// const getDataSet = async (req, res) => {
//   try {
//     const { data, error } = await supabase
//       .from("datasets")
//       .select(
//         `
//         id,
//         name,
//         type,
//         created_at,
//         data
//       `
//       )
//       .order("created_at", { ascending: false });

//     if (error) {
//       throw error;
//     }

//     // Include full data content
//     const formatted = data.map((dataset) => ({
//       id: dataset.id,
//       name: dataset.name,
//       type: dataset.type,
//       createdAt: dataset.created_at,
//       dataPoints: Array.isArray(dataset.data) ? dataset.data.length : 0,
//       data: dataset.data, // include full JSON array
//     }));

//     console.log("Formatted datasets:", formatted);

//     res.json(formatted);
//   } catch (error) {
//     console.error("Supabase query error:", error);
//     res.status(500).json({ error: "Failed to fetch datasets" });
//   }
// };

const redis = require("../lib/redisClient.js");
//const supabase = require("../supabaseClient.ts");

// const getDataSet = async (req, res) => {
//   try {
//     // Check for individual dataset cache
//     const keys = await redis.keys("dataset:*");

//     if (keys.length > 0) {
//       //console.log(`[CACHE HIT] Retrieved ${keys.length} cached datasets from Redis`);
//       //console.log("[CACHE HIT] individual datasets");
//       const cachedDatasets = await Promise.all(keys.map((key) => redis.get(key)));
//       console.log("[CACHE HIT] Returning cached datasets");
//       return res.json(cachedDatasets);
//     }

//       console.log("[CACHE MISS] No individual datasets found in Redis, fetching from Supabase");
//     // Cache miss → fetch from Supabase
//     const { data, error } = await supabase
//       .from("datasets")
//       .select(`id, name, type, created_at, data`)
//       .order("created_at", { ascending: false });

//     if (error) throw error;
    
//     const formatted = data.map((dataset) => ({
//       id: dataset.id,
//       name: dataset.name,
//       type: dataset.type,
//       createdAt: dataset.created_at,
//       dataPoints: Array.isArray(dataset.data) ? dataset.data.length : 0,
//       data: dataset.data,
//     }));

//     // Store each dataset individually in Redis
//     for (const dataset of formatted) {
//       const key = `dataset:${dataset.id}`;
//       await redis.set(key, dataset, { ex: 600 }); // TTL: 10 minutes
//     }

//     res.json(formatted);
//   } catch (error) {
//     console.error("Supabase query error:", error);
//     res.status(500).json({ error: "Failed to fetch datasets" });
//   }
// };
const getDataSet = async (req, res) => {
  try {
    const lite = req.query.lite === "true";

    if (!lite) {
      const keys = await redis.keys("dataset:*");
      if (keys.length > 0) {
        console.log(`[CACHE HIT] Retrieved ${keys.length} cached datasets from Redis`);
        const cached = await Promise.all(keys.map((k) => redis.get(k)));
        return res.json(cached);
      }

      const { data, error } = await supabase
        .from("datasets")
        .select("id, name, type, created_at, data")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formatted = data.map((dataset) => ({
        id: dataset.id,
        name: dataset.name,
        type: dataset.type,
        createdAt: dataset.created_at,
        dataPoints: Array.isArray(dataset.data) ? dataset.data.length : 0,
        data: dataset.data,
      }));

      for (const dataset of formatted) {
        await redis.set(`dataset:${dataset.id}`, dataset, { ex: 600 });
      }

      return res.json(formatted);
    }

    // ⚠️ For lite=true → query the view instead of full table
    const { data, error } = await supabase
      .from("datasets_with_count")
      .select("id, name, type, created_at, data_points");

    if (error) throw error;

    const formattedLite = data.map((dataset) => ({
      id: dataset.id,
      name: dataset.name,
      type: dataset.type,
      createdAt: dataset.created_at,
      dataPoints: dataset.data_points,
    }));

    return res.json(formattedLite);
  } catch (error) {
    console.error("Supabase query error:", error);
    res.status(500).json({ error: "Failed to fetch datasets" });
  }
};




const getDataSetLanding = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("datasetslanding")
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

const getDataSetById = async (req, res) => {
  const datasetId = req.params.id;
  const {redis:useRedis} = req.query; // Use query param to control Redis caching
  try {
    //1. Check Redis cache first
    if(useRedis === "true")
    {
        console.log("entering cache check")
        const cached = await redis.get(`dataset:${datasetId}`);
        if (cached) {
          console.log(`[CACHE HIT] dataset:${datasetId}`);

          const parsed =
            typeof cached === "string" ? JSON.parse(cached) : cached;

          return res.json(parsed);
        }
    }
    

    // 2. Fetch from Supabase if not cached
    const { data, error } = await supabase
      .from("datasets")
      .select("*")
      .eq("id", datasetId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ error: "Dataset not found" });
      }
      throw error;
    }

    // 3. Cache the result in Redis (10 min TTL)
    if(useRedis === "true")
    await redis.set(`dataset:${datasetId}`, JSON.stringify(data), { ex: 600 });

    console.log(`[CACHE MISS] dataset:${datasetId} - Fetched and cached`);
    res.json(data);

  } catch (error) {
    console.error("Supabase or Redis error:", error);
    res.status(500).json({ error: "Failed to fetch dataset" });
  }
};



const deleteDataSet = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("datasets")
      .delete()
      .eq("id", req.params.id)
      .select() // Needed to return the deleted row(s), SELECT clause in SQL
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

const updateDataSetName = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const { data, error } = await supabase
      .from("datasets")
      .update({ name })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ error: "Dataset not found" });
      }
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error("Supabase error:", error);
    res.status(500).json({ error: "Failed to update dataset name" });
  }
};

module.exports = {
  getDataSet,
  getDataSetLanding,
  getDataSetById,
  deleteDataSet,
  updateDataSetName,
};
