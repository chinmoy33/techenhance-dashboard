const supabase = require("../shared/supabase-config/supabaseClient.ts");
const client = require("../twilio-config/twilio.js").client;

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

    // By default keep this section commented out , use it only for demonstration purposes as its trial is limited!

    // data.forEach((item) => {
    //   const cleanedNumber = item.phone.replace(/\s+/g, '');
    //   console.log("Cleaned Number:", cleanedNumber);
    //   // Example of sending an SMS notification for each recommendation
    //   client.messages
    //   .create({
    //     from: 'whatsapp:+14155238886', // Twilio Sandbox number
    //     to: `whatsapp:${cleanedNumber}`,  // Your verified phone number
    //     body: `Hello ${item.name}. Check out these cool shoes!`,
    //     mediaUrl: ['https://res.cloudinary.com/defslgocx/image/upload/f_auto,q_auto/v1747042778/JEC-Space/v5tlvaymwlfd7zdg5auo.jpg']
    //   })
    //   .then(message => console.log('Message SID:', message.sid))
    //   .catch(error => console.error('Error:', error));
    // }
    // );

    const cleanedNumber=data[0].phone.replace(/\s+/g, '');
    console.log("Cleaned Number:", cleanedNumber);
    client.messages
      .create({
        from: 'whatsapp:+14155238886', // Twilio Sandbox number
        to: `whatsapp:${cleanedNumber}`,  // Your verified phone number
        body: `Hello ${data[0].name}. Check out these cool shoes!`,
        mediaUrl: ['https://res.cloudinary.com/defslgocx/image/upload/f_auto,q_auto/v1747042778/JEC-Space/v5tlvaymwlfd7zdg5auo.jpg']
        //mediaUrl:['https://demo.twilio.com/owl.png']
        //mediaUrl: ['https://res.cloudinary.com/defslgocx/image/upload/v1747042778/JEC-Space/v5tlvaymwlfd7zdg5auo.webp'] // Publicly accessible image
      })
      .then(message => console.log('Message SID:', message.sid))
      .catch(error => console.error('Error:', error));

    console.log("sending twilio message to users....");


    return res.json(data);
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getRecommendationsReal = async (req, res) => {
  try {
    // Here you would typically run your machine learning model logic
    // For now, we will simulate recommendations with a simple query
    //console.log(typeof supabase.from("eligible_mutualfunds_clients").select("*").order);


    const { data, error } = await supabase.from("eligible_mutualfunds_clients").select("*").order("id", { ascending: true }).limit(30);


    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ error: "Supabase error" });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "No recommendations found" });
    }

    // By default keep this section commented out , use it only for demonstration purposes as its trial is limited!

    // data.forEach((item) => {
    //   const cleanedNumber = item["Phone Number"].replace(/\s+/g, '');
    //   console.log("Cleaned Number:", cleanedNumber);
    //   // Example of sending an SMS notification for each recommendation
    //   client.messages
    //   .create({
    //     from: 'whatsapp:+14155238886', // Twilio Sandbox number
    //     to: `whatsapp:+91${cleanedNumber}`,  // Your verified phone number
    //     body: `Hello ${item["Person's Name"]}. Check out these cool shoes!`,
    //     mediaUrl: ['https://res.cloudinary.com/defslgocx/image/upload/f_auto,q_auto/v1747042778/JEC-Space/v5tlvaymwlfd7zdg5auo.jpg']
    //   })
    //   .then(message => console.log('Message SID:', message.sid))
    //   .catch(error => console.error('Error:', error));
    // }
    // );

    // const cleanedNumber=data[0]["Phone Number"].replace(/\s+/g, '');
    // console.log("Cleaned Number:", cleanedNumber);
    // client.messages
    //   .create({
    //     from: 'whatsapp:+14155238886', // Twilio Sandbox number
    //     to: `whatsapp:+91${cleanedNumber}`,  // Your verified phone number
    //     body: `Hello ${data[0]["Person's Name"]}. Check out these cool shoes!`,
    //     mediaUrl: ['https://res.cloudinary.com/defslgocx/image/upload/f_auto,q_auto/v1747042778/JEC-Space/v5tlvaymwlfd7zdg5auo.jpg']
    //     //mediaUrl:['https://demo.twilio.com/owl.png']
    //     //mediaUrl: ['https://res.cloudinary.com/defslgocx/image/upload/v1747042778/JEC-Space/v5tlvaymwlfd7zdg5auo.webp'] // Publicly accessible image
    //   })
    //   .then(message => console.log('Message SID:', message.sid))
    //   .catch(error => console.error('Error:', error));

    // console.log("sending twilio message to users....");


    return res.json(data);
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getLeads = async (req, res) => {
  try {
    // Here you would typically run your machine learning model logic
    // For now, we will simulate recommendations with a simple query
    //console.log(typeof supabase.from("eligible_mutualfunds_clients").select("*").order);

    const { data, error } = await supabase
  .from("contacted_dataset")
  .select(`*, eligible_mutualfunds_clients("Person's Name", "Account Number")`)
  .order("id", { ascending: true });

  console.log(data[0].eligible_mutualfunds_clients);



    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ error: "Supabase error" });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "No Leads found" });
    }

    


    return res.json(data);
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateLeads = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      interested,
      type_of_mutual_fund,
      amount,
      final_amount,
      kyc_completed=false,
      final_disbursed_amt,
    } = req.body;

    let new_final_disbursed_amt=null
    if(!kyc_completed && interested==="yes")
    {
      new_final_disbursed_amt=0;
    }
    else
    {
      new_final_disbursed_amt=final_disbursed_amt
    }

    if (!id) {
      return res.status(400).json({ success: false, message: "Missing ID parameter" });
    }

    // Try updating the record
    const { data: updateData, error: updateError } = await supabase
      .from("contacted_dataset")
      .update({
        interested,
        type_of_mutual_fund,
        amount,
        final_amount,
        kyc_completed,
        final_disbursed_amt:new_final_disbursed_amt,
      })
      .eq("eligible_person_id", id)
      .select();

    if (updateError) {
      console.error("Supabase update error:", updateError);
      return res.status(500).json({ success: false, message: "Failed to update lead" });
    }

    // If no record was updated, insert a new one
    if (!updateData || updateData.length === 0) {
      const { data: insertData, error: insertError } = await supabase
        .from("contacted_dataset")
        .insert([
          {
            eligible_person_id:id,
            interested,
            type_of_mutual_fund,
            amount,
            final_amount,
            kyc_completed,
            final_disbursed_amt:new_final_disbursed_amt,
          },
        ])
        .select();

      if (insertError) {
        console.error("Supabase insert error:", insertError);
        return res.status(500).json({ success: false, message: "Failed to insert lead" });
      }

      return res.status(201).json({ success: true, message: "Lead inserted successfully" });
    }

    return res.status(200).json({ success: true, message: "Lead updated successfully" });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


module.exports = {
  getRecommendations,getRecommendationsReal,getLeads,updateLeads
};
