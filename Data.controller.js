import Data from "../Model/Data.model.js";
import mongoose from 'mongoose'


export const SaveData = async (req, res) => {
  try {
    const {
      videoId, thumbnailUrl, photo, title,
      duration, views, author, videoUrl,
      description, subscriber, channelId,
      uploader, likes, dislikes, category
    } = req.body;

    // Validate Required Fields
    if (!videoId || !thumbnailUrl || !photo || !title || !duration || !views || !author || !videoUrl || !description) {
      return res.status(400).json({
        Message: "All videoId, thumbnail, photo, title, duration, views, author, videoUrl, description are required..."
      });
    }

    //  Check duplicate entry
    const exist = await Data.findOne({ videoId });
    if (exist) {
      return res.status(400).json({
        Message: "This Data Already exist..."
      });
    }

    //  Create new data object
    const newData = new Data({
      videoId,
      thumbnailUrl,
      photo,
      title,
      duration,
      views,
      author,
      videoUrl,
      description,
      subscriber,
      channelId,
      uploader,
      likes,
      dislikes,
      category,
    });

    // Save to DB
    const saved = await newData.save();

    //  Success response
    return res.status(200).json({
      Message: "Data is saved SuccessFully...",
      saved
    });

  } catch (error) {
    console.error("Error saving data:", error);

    return res.status(500).json({
      success: false,
      message: "Error saving data", // handle error
      error: error.message,
    });
  }
};

export const Getdata = async(req,res)=>{
  try{
    const data= await Data.find() //fetch all data
    res.status(200).json({
      message:"Data Fetched....",
      data
    })
  }
  catch(error){
     res.status(500).json({
      message:error.message,
      
    })
  }
}

export const Filter = async (req, res) => {
  try {
    // use req.query for GET, req.body for POST
    const category = req.query.category || req.body.category || "";
    if (!category) {
      // return all videos
      const all = await Data.find({});
      return res.status(200).json({ data: all });
    }

    const data = await Data.find({ category: category });
    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const Search = async (req, res) => {
  try {
    const title = req.query.title || req.body.title || "";

    // If no search term → return all videos
    if (!title.trim()) {
      const all = await Data.find({});
      return res.status(200).json({ data: all });
    }

    // Partial + case-insensitive search
    const data = await Data.find({
      title: { $regex: title, $options: "i" }   // i = case-insensitive
    });

    return res.status(200).json({ data });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



export const videoId = async (req, res) => {
  try {
    // accept either :videoId or :id
    const param = req.params.videoId ?? req.params.id;


    if (!param) return res.status(400).json({ message: "No id provided" });

    let doc = null;

    // If looks like a valid ObjectId, try to find by _id first
    if (mongoose.Types.ObjectId.isValid(param)) {
      doc = await Data.findById(param).lean();
    }

    // If not found by _id (or param wasn't an ObjectId), try videoId lookup
    if (!doc) {
      doc = await Data.findOne({ videoId: param }).lean();
    }

    if (!doc) {
      return res.status(404).json({ message: "Video not found" });
    }

    return res.status(200).json(doc);
  } catch (error) {
    console.error("[videoId] error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};











