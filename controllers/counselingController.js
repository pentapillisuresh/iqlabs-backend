import CounselingResponse from "../models/CounselingResponse.js";
import PDFDocument from "pdfkit";

// User submits answers
export const submitCounseling = async (req, res) => {
  try {
    const { userId, answers } = req.body;
    const response = new CounselingResponse({ userId, answers });
    await response.save();
    res.json({ success: true, message: "Answers submitted successfully", data: response });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin fetch all responses
export const getAllResponses = async (req, res) => {
  try {
    const responses = await CounselingResponse.find().populate("userId");
    res.json({ success: true, data: responses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin download PDF (Only answers)
export const getResponsePDF = async (req, res) => {
  try {
    const response = await CounselingResponse.findById(req.params.id).populate("userId");
    if (!response) return res.status(404).json({ success: false, message: "Not found" });

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=response-${response._id}.pdf`);
    doc.pipe(res);

    // Title
    doc.fontSize(16).text("Career Counseling Report", { align: "center" });
    doc.moveDown();

    // User info
    if (response.userId) {
      doc.fontSize(12).text(`Name: ${response.userId.name}`);
      doc.text(`Email: ${response.userId.email}`);
      doc.text(`Phone: ${response.userId.phone}`);
      doc.moveDown();
    }

    // Only answers
    response.answers.forEach((a, index) => {
      doc.fontSize(12).text(`${index + 1}. ${a.answer || "No Answer"}`);
      doc.moveDown(0.5);
    });

    doc.end();
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
