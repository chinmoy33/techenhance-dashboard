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

    // const cleanedNumber=data[0].phone.replace(/\s+/g, '');
    // console.log("Cleaned Number:", cleanedNumber);
    // client.messages
    //   .create({
    //     from: 'whatsapp:+14155238886', // Twilio Sandbox number
    //     to: `whatsapp:${cleanedNumber}`,  // Your verified phone number
    //     body: `Hello ${data[0].name}. Check out these cool shoes!`,
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


module.exports = {
  getRecommendations,getRecommendationsReal
};
