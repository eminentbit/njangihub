// controllers/createNjangi.controller.js
import createNjangiFlow from "../services/createNjangiFlow.js";
import { nanoid } from "nanoid";
import { getOrSetDraftUserToken } from "../utils/getOrSetDraftUserToken.js";

const createNjangi = async (req, res) => {
  try {
    const njangiId = `njangi_${nanoid(8)}`;
    const draftUserToken = getOrSetDraftUserToken(req, res);
    const result = await createNjangiFlow(
      req.body,
      njangiId,
      draftUserToken,
      res
    );

    res.status(201).json({
      success: true,
      message: "Njangi created successfully and sent for approval.",
      ...result,
    });
  } catch (error) {
    console.log("Error creating Njangi:", error);
    res.status(500).json({
      success: false,
      error: "Something went wrong during Njangi creation.",
    });
  }
};

export default createNjangi;
