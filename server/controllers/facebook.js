import Facebook from "../models/facebook.js";

export const createFacebookFields = async (req, res) => {
  try {
    const { verifyToken, pageId, appId, appSecret, pageAccessToken } = req.body;

    const data = await Facebook.find();

    if (data.length === 0) {
      const newFacebookPage = new Facebook({
        verifyToken,
        pageId,
        appId,
        appSecret,
        pageAccessToken,
      });
      await newFacebookPage.save();
      res.status(201).json(newFacebookPage);

    } else {
      data[0].verifyToken = verifyToken;
      data[0].pageId = pageId;
      data[0].appId = appId;
      data[0].appSecret = appSecret;
      data[0].pageAccessToken = pageAccessToken;

      await data[0].save();
      res.status(200).json(data[0]);
    }
  } catch (error) {
    console.error("Error creating Facebook page:", error);
    res.status(500).json({ message: "Error creating Facebook page" });
  }
};

export const getLatestFacebookFields = async (req, res) => {
  try {
    const facebookFields = await Facebook.findOne().sort({ createdAt: -1 });

    if (!facebookFields) {
      return res.status(404).json({ message: "No Facebook fields found" });
    }
    res.status(200).json(facebookFields);

  } catch (error) {
      console.error("Error fetching Facebook fields:", error);
      res.status(500).json({ message: "Error fetching Facebook fields" });
  }
};