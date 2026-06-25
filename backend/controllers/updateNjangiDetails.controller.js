import NjangiDraft from "../models/njangi.draft.model.js";

export const updateNjangiDetails = async (req, res) => {
  const { draftId } = req.query;

  if (!draftId) {
    return res
      .status(400)
      .json({ sucess: false, message: "draftId is required" });
  }

  try {
    // Fetch the draft first
    const draft = await NjangiDraft.findById(draftId);
    if (!draft) {
      return res.status(404).json({
        sucess: false,
        message: "Njangi not found for the given draftId!",
      });
    }

    // Check if within 24 hours of creation
    const createdAt = draft.createdAt;
    const now = new Date();
    const diffMs = now - createdAt;
    const hours24 = 24 * 60 * 60 * 1000;
    if (diffMs > hours24) {
      return res.status(403).json({
        sucess: false,
        message: "Editing is only allowed within 24 hours of creation.",
      });
    }

    // Proceed with update
    const {
      groupName,
      contributionAmount,
      contributionFrequency,
      numberOfMember,
      startDate,
      endDate,
      payoutMethod,
      rules,
    } = req.body;

    const update = {
      "groupDetails.groupName": groupName,
      "groupDetails.contributionAmount": contributionAmount,
      "groupDetails.contributionFrequency": contributionFrequency,
      "groupDetails.numberOfMember": numberOfMember,
      "groupDetails.startDate": new Date(startDate),
      "groupDetails.endDate": new Date(endDate),
      "groupDetails.payoutMethod": payoutMethod,
      "groupDetails.rules": rules,
      updatedAt: new Date(),
    };

    // Sanitize and validate the update object
    const sanitizedUpdate = {};
    for (const [key, value] of Object.entries(update)) {
      // Only allow specific known fields
      if (
        Object.prototype.hasOwnProperty.call(update, key) &&
        value !== undefined &&
        value !== null
      ) {
        sanitizedUpdate[key] = value;
      }
    }

    // Perform the update with sanitized data and input validation
    const njangi = await NjangiDraft.findByIdAndUpdate(
      draftId,
      { $set: sanitizedUpdate },
      {
        new: true,
        runValidators: true, // Ensures mongoose validation runs
      }
    );

    if (!njangi) {
      return res.status(404).json({
        success: false,
        message: "Failed to update njangi details",
      });
    }

    // Validate successful update
    // Validate draftId format (assuming MongoDB ObjectId)
    if (!draftId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new Error("Invalid draftId format");
    }
    const updatedNjangi = await NjangiDraft.findById(draftId)
      .select("-__v")
      .lean();
    if (!updatedNjangi) {
      return res.status(404).json({
        success: false,
        message: "Failed to verify njangi update",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Njangi details updated successfully! You will see changes within 15 minutes.",
      data: updatedNjangi,
    });
  } catch (error) {
    res.status(500).json({ sucess: false, message: error.message });
  }
};

export const cancelNjangi = async (req, res) => {
  console.log("cancelNjangi from backend: ", req.query);
  const { draftId } = req.query;

  console.log("cancelNjangi from backend: ", draftId);

  if (!draftId) {
    return res
      .status(400)
      .json({ sucess: false, message: "draftId is required" });
  }

  try {
    // Fetch the draft first
    const draft = await NjangiDraft.findById(draftId);
    if (!draft) {
      return res.status(404).json({
        sucess: false,
        message: "Njangi not found for the given draftId!",
      });
    }

    // Validate draftId format (assuming MongoDB ObjectId)
    if (!draftId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid draftId format",
      });
    }

    // Use findOneAndDelete to ensure atomic operation and get deleted document
    const deletedNjangi = await NjangiDraft.findOneAndDelete({
      _id: draftId,
    }).select("-__v");

    if (!deletedNjangi) {
      return res.status(404).json({
        success: false,
        message: "Njangi not found or already deleted",
      });
    }

    console.log("Deleted Njangi left from the backend:", deletedNjangi);

    return res.status(200).json({
      sucess: true,
      message: "Njangi cancelled successfully!",
      deletedNjangi,
    });
  } catch (error) {
    res.status(500).json({ sucess: false, message: error.message });
  }
};
