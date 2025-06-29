const express = require("express");
const fs = require("fs");
const upload = require("../config/multer.config");
const cloudinary = require("../config/cloudinary.config");
const fileModel = require("../models/files.models");
const authMiddleware = require("../middlewares/auth");

const axios = require("axios");

const router = express.Router();

router.get("/home", authMiddleware, async (req, res) => {
  try {
    const files = await fileModel.find({ user: req.user._id });
    res.json( { files });
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ message: "Server error" });
  }
});

const streamifier = require("streamifier");

router.post(
  "/upload-file",
  authMiddleware,
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const streamUpload = (req) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: "auto" },
            (error, result) => {
              if (result) {
                resolve(result);
              } else {
                reject(error);
              }
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };

      const result = await streamUpload(req);

     
      const fileDoc = await fileModel.create({
        path: result.secure_url,
        public_id: result.public_id,
        resource_type: result.resource_type,
        originalname: req.file.originalname,
        user: req.user._id,
      });

      res.status(200).json({
        message: "File uploaded & saved to DB!",
        cloudinary_url: result.secure_url,
        file: fileDoc,
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Upload or DB save failed" });
    }
  }
);


router.get("/download/:id", authMiddleware, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const fileId = req.params.id;

    const file = await fileModel.findOne({
      _id: fileId,
      user: loggedInUserId,
    });
    if (!file) {
      return res.status(401).json({
        message: "unauthorized",
      });
    }

    const fileUrl = `${file.path}?fl_attachment=${file.originalname}`;

    const response = await axios({
      url: fileUrl,
      method: "GET",
      responseType: "stream",
    });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file.originalname}"`
    );
    res.setHeader("Content-Type", response.headers["content-type"]);


    response.data.pipe(res);
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    const file = await fileModel.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

  
    console.log("Deleting file:", file);

    await cloudinary.uploader.destroy(file.public_id, {
      resource_type: file.resource_type,
    });

    await fileModel.deleteOne({ _id: req.params.id });

    res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Deletion error:", error);
    res.status(500).json({ message: "Error deleting file" });
  }
});

module.exports = router;
