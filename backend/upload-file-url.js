const supabase = require("./supabaseClient.ts");
const fs = require("fs");
const zlib = require("zlib");
const path = require("path");

// File paths
const localFilePath ="C:\\Users\\chinm\\c tutorials\\techenhance\\techenhance-dashboard\\backend\\Personal.json";
const compressedPath = "C:\\Users\\chinm\\c tutorials\\techenhance\\techenhance-dashboard\\backend\\Personal.json.gz";
const storageFileName = "personal_dataset_1.json.gz"; // how it will be named in storage

async function gzipAndUpload() {
  // Step 1: Gzip compress the JSON file
  const jsonBuffer = fs.readFileSync(localFilePath);
  const compressed = zlib.gzipSync(jsonBuffer);
  fs.writeFileSync(compressedPath, compressed);
  console.log("✅ File compressed to GZIP.");

  // Step 2: Upload to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("datasets") // bucket name
    .upload(storageFileName, compressed, {
      contentType: "application/gzip",
      upsert: true,
    });

  if (uploadError) {
    console.error("❌ Upload failed:", uploadError);
    return;
  }

  // Step 3: Get public URL
  const { data: publicUrlData } = supabase.storage
    .from("datasets")
    .getPublicUrl(storageFileName);

  const fileUrl = publicUrlData.publicUrl;
  console.log("📂 File URL:", fileUrl);

  // Step 4: Insert metadata into datasets table
  const { data: insertData, error: insertError } = await supabase
    .from("datasets")
    .insert([
      {
        name: "Compressed Dataset",
        type: "json-file",
        data: {
          url: fileUrl,
          format: "gzip",
          original_filename: path.basename(localFilePath),
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

  if (insertError) {
    console.error("❌ Insert error:", insertError);
  } else {
    console.log("✅ Row inserted into datasets table:", insertData);
  }
}

gzipAndUpload();
