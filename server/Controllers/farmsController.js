
import Farm from "../models/Farm.js";
import multer from "multer";
import path from "path";


const storage = multer.diskStorage({
  destination: "./uploads/farms",
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

const FarmController ={
   async getMyFarms(req, res) {
    try {
      const farms = await Farm.find({ farmer: req.user.userId });
      res.json(farms);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  },
   async createFarm(req, res) {
    try {
      const {
        name,
        description,
        location,
        farmType,
        size,
        productionCapacity,
      } = req.body;

      const images = req.files.map((file) => file.path);

      const farm = new Farm({
        farmer: req.user.userId,
        name,
        description,
        location,
        farmType,
        size,
        productionCapacity,
        images,
      });

      await farm.save();
      res.json(farm);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  },

   async updateFarm(req, res) {
    try {
      const farm = await Farm.findOneAndUpdate(
        { _id: req.params.id, farmer: req.user.userId },
        req.body,
        { new: true }
      );

      if (!farm) {
        return res.status(404).json({ message: "Farm not found" });
      }

      res.json(farm);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
}

export {upload}
export default FarmController