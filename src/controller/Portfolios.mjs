import Portfolios from "../models/PortfolioModel.mjs";
import Users from "../models/UserModel.mjs";
import path from "path";
import fs from "fs";
import { Op } from "sequelize";

export const getPortfolios = async (req, res) => {
  try {
    let response;
    if (req.role === "kaprodi") {
      response = await Portfolios.findAll({
        attributes: ["uuid", "images", "imagesURL", "status"],
        include: [
          {
            model: Users,
            attributes: ["uuid", "name", "email", "nip"],
          },
        ],
      });
    } else {
      response = await Portfolios.findAll({
        attributes: ["uuid", "images", "imagesURL", "status"],
        where: {
          userId: req.userId,
        },
        include: [
          {
            model: Users,
            attributes: ["uuid", "name", "email", "nip"],
          },
        ],
      });
    }
    res.status(200).json({ msg: "Success", data: response });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getPortfolioById = async (req, res) => {
  try {
    const portfolio = await Portfolios.findOne({
      where: {
        uuid: req.params.id,
      },
    });

    if (!portfolio) return res.status(404).json({ msg: "Portfolio not found" });

    let response;
    if (req.role === "kaprodi") {
      response = await Portfolios.findOne({
        attributes: ["uuid", "images", "imagesURL", "status"],
        where: {
          id: portfolio.id,
        },
        include: [
          {
            model: Users,
            attributes: ["uuid", "name", "email", "nip"],
          },
        ],
      });
    } else {
      response = await Portfolios.findOne({
        attributes: ["uuid", "images", "imagesURL", "status"],
        where: {
          [Op.and]: [{ id: portfolio.id }, { userId: req.userId }],
        },
        include: [
          {
            model: Users,
            attributes: ["uuid", "name", "email", "nip"],
          },
        ],
      });
    }
    res.status(200).json({ msg: "Success", data: response });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createPortfolio = async (req, res) => {
  if (req.files === null)
    return res.status(400).json({ msg: "No file uploaded" });

  const file = req.files.file;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const fileName = file.md5 + ext;
  const url = `${req.protocol}://${req.get("host")}/files/${fileName}`;
  const allowedType = [".png", ".jpg", ".jpeg", ".pdf"];

  if (!allowedType.includes(ext.toLocaleLowerCase())) {
    return res.status(422).json({ msg: "Invalid image type" });
  }

  if (fileSize > 5000000) {
    return res.status(422).json({ msg: "Image must be less than 5 MB" });
  }

  file.mv(`./public/files/${fileName}`, async (err) => {
    if (err) return res.status(500).json({ msg: err.message });

    try {
      await Portfolios.create({
        images: fileName,
        imagesURL: url,
        userId: req.userId,
      });
      res.status(201).json({ msg: "Success create portfolio" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  });
};

export const updatePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolios.findOne({
      where: {
        uuid: req.params.id,
      },
    });

    if (!portfolio) return res.status(404).json({ msg: "Portfolio not found" });

    // Check if the user is a 'kaprodi' or 'dosen'
    if (req.role === "kaprodi") {
      // If 'kaprodi', only update status
      const { status } = req.body; // Get status from request body
      await portfolio.update(
        { status },
        {
          where: {
            id: portfolio.id,
          },
        }
      );

      return res.status(200).json({ msg: "Success update portfolio status" });
    } else if (req.role === "dosen") {
      // If 'dosen', must provide file to update image and URL
      if (req.files === null) {
        return res.status(400).json({ msg: "No file uploaded" });
      }

      const file = req.files.file;
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      const fileName = file.md5 + ext;
      const url = `${req.protocol}://${req.get("host")}/files/${fileName}`;
      const allowedType = [".png", ".jpg", ".jpeg", ".pdf"];

      if (!allowedType.includes(ext.toLowerCase())) {
        return res.status(422).json({ msg: "Invalid image type" });
      }

      if (fileSize > 5000000) {
        return res.status(422).json({ msg: "Image must be less than 5 MB" });
      }

      if (portfolio.images) {
        const oldFilePath = `./public/files/${portfolio.images}`;
        fs.unlink(oldFilePath, (err) => {
          if (err) console.error(`Failed to delete old image: ${err.message}`);
        });
      }

      file.mv(`./public/files/${fileName}`, async (err) => {
        if (err) return res.status(500).json({ msg: err.message });

        try {
          await Portfolios.update(
            {
              images: fileName,
              imagesURL: url,
              userId: req.userId,
              status: "pending",
            },
            {
              where: {
                [Op.and]: [{ id: portfolio.id }, { userId: req.userId }],
              },
            }
          );
          res.status(201).json({ msg: "Success update portfolio image" });
        } catch (error) {
          res.status(500).json({ msg: error.message });
        }
      });

      return;
    } else {
      return res.status(403).json({ msg: "User does not have permissions" });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deletePortfolio = async (req, res) => {
  const portfolio = await Portfolios.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!portfolio) return res.status(404).json({ msg: "No Data Found" });

  try {
    const filepath = `./public/files/${portfolio.images}`;
    fs.unlinkSync(filepath);
    await Portfolios.destroy({
      where: {
        id: portfolio.id,
      },
    });
    res.status(200).json({ msg: "Success deleted portfolio" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
