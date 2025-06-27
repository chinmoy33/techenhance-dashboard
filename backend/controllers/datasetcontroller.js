const supabase = require("../supabaseClient.ts");

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
  try {
    const { data, error } = await supabase
      .from("datasets")
      .select("*")
      .eq("id", req.params.id) // WHERE id = req.params.id
      .single(); // ensures one result, Data is directly the object, not wrapped in array

    // PGRST116 is a specific PostgREST error code that means "No rows found"
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

module.exports = {
  getDataSet,
  getDataSetLanding,
  getDataSetById,
  deleteDataSet,
};
