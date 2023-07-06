const File = require("../models/File");
const cloudinary = require("cloudinary").v2;

// localfile upload on server only

exports.localFileUpload = async (req, res) => {
  try {
    // fetch data from request

    const file = req.files.file;
    console.log("file is obtained", file);

    //creating a path to upload file locally
    let path =
      __dirname + "/files/" + Date.now() + `.${file.name.split(".")[1]}`;
    console.log("Path ->", path);

    // add file to the path provided
    file.mv(path, (error) => {
      console.log(error);
    });

    // create a response for success
    res.json({
      success: true,
      massage: "Local file uploaded successfully",
    });
  } catch (error) {
    console.log("Not able to upload file on server due to ");
    console.log(error);
  }
};

// local file upload code completed

// creating function to check supported file

function isFileTypeSupported(type, supportedfile) {
  return supportedfile.include(type);
}

// function to upload file on cloudinary
async function uploadFileToCloudinary(file, folder, quality) {
  const options = { folder };
  console.log("temparary file path ", file.tempFilePath);

  if (quality) {
    options.quality = quality;
  }

  options.resource_type = "auto";
  return await cloudinary.uploader.upload(file.tempFilePath, options);
}

// image uploading handler
exports.imageUpload = async (req, res) => {
  try {
    // fetch data
    const { name, tags, email } = req.body;
    console.log(name, tags, email);

    const file = req.file.imageFile;
    console.log("file fetch", file);

    //validation
    const supportedTypes = ["jpg", "jpeg", "png"];
    const fileType = file.name.split(".")[1].toLowerCase();
    console.log("File type", fileType);

    if (!isFileTypeSupported(fileType, supportedTypes)) {
      return res.status(400).json({
        success: false,
        message: "file format not supported",
      });
    }

    // file supported
    console.log("uploading to akshaydata");
    const response = await uploadFileToCloudinary(file, "AkshayData"); // file and folder
    console.log(response);

    // db entry

    const fileData = await File.create({
      name,
      tags,
      email,
      imageUrl: response.secure_url,
    });

    res.json({
      success: true,
      imageUrl: response.secure_url,
      message: "image successfully uploaded",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "something went wrong",
    });
  }
};

// video upload ka handler

exports.videoUpload = async (req, res) => {
  try {
    // extraction data
    const { name, tags, email } = req.body;
    console.log(name, tags, email);

    const file = req.files.videoFile;

    //validation
    const supportedTypes = ["mp4", "mov"];
    const fileType = file.name.split(".")[1].toLowerCase();
    console.log(fileType);

    //  check video supported
    if (!isFileTypeSupported(fileType, supportedTypes)) {
      return res.status(400).json({
        success: false,
        message: "File formate  not supported ",
      });
    }

    // file formate is supported
    console.log("Uploading video file");
    const response = await uploadFileToCloudinary(file, "AkshayData");
    console.log(response);

    // database entry

    const fileUpload = await File.create({
      name,
      tags,
      email,
      imageUrl: response.secure_url,
    });

    res.json({
      success: true,
      imageUrl: response.secure_url,
      message: "Video successfully uploaded",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Can not upload video file",
    });
  }
};

// imagesizereducer

exports.imageSizeReducer = async (req, res) => {
  try {
    // data fetch
    const { name, tags, email } = req.body;
    console.log(name, tags, email);

    // fetch file
    const file = req.file.imageFile;
    console.log(file);

    // validationn
    const supportedfile = ["jpg", "jpeg", "png"];
    const fileType = file.name.split(".")[1].toLowerCase();
    console.log("File type", fileType);

    if (!isFileTypeSupported(fileType, supportedfile)) {
      return res.status(400).json({
        success: false,
        message: "File format not supported",
      });
    }

    console.log("Uploading imagerediced file");
    const response = await uploadFileToCloudinary(file, "AkshayData", 90);
    console.log(response);

    const fileData = await File.create({
      name,
      tags,
      email,
      imageUrl: response.secure_url,
    });

    res.status(202).json({
      success: true,
      message: "Image uploaded successfully",
    });
  } catch (error) {
    console.log(error),
      res.status(400).json({
        success: false,
        message: "Can not upload video file",
      });
  }
};
