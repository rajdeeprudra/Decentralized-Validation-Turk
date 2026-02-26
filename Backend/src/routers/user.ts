import { Router } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const router = Router();
const prismaClient = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "abcdefg";

router.post("/signin", async (req, res) => {
  try {
    const hardCodedWalletAddress =
      "GCTMJ23YTwnxNSTdcjGxFmqZHJhBr9KPRH5CcGd3n3Vk";

    const existingUser = await prismaClient.user.findFirst({
      where: {
        address: hardCodedWalletAddress
      }
    });

    if (existingUser) {
      const token = jwt.sign(
        { userId: existingUser.id },
        JWT_SECRET
      );

      return res.json({ token });
    }

    const user = await prismaClient.user.create({
      data: {
        address: hardCodedWalletAddress
      }
    });

    const token = jwt.sign(
      { userId: user.id },
      JWT_SECRET
    );

    return res.json({ token });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
});

export default router;