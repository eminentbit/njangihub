import BodReport from "../models/bod.reports.js";

export const createReport = async (req, res) => {
  const { title, type, status, content, metrics, summary } = req.body;

  const report = await BodReport.create({
    title,
    type,
    status,
    reportContent: content,
    revenue: metrics.revenue,
    expenses: metrics.expenses,
    profit: metrics.profit,
    summary,
  });

  console.log(report);

  res.status(201).json({
    success: true,
    message: "Report created successfully",
    data: report,
  });
};

export const viewReport = async (req, res) => {
  const { reportId } = req.params;

  if (!reportId) {
    return res.status(400).json({
      success: false,
      message: "Report ID is required",
    });
  }

  try {
    const report = await BodReport.findById(reportId);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    res.status(200).json(report);
  } catch (error) {
    console.error(`Error fetching report: ${error}`);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteReport = async (req, res) => {
  const { reportId } = req.params;

  if (!reportId) {
    return res.status(400).json({
      success: false,
      message: "Report ID is required",
    });
  }

  try {
    const report = await BodReport.findByIdAndDelete(reportId);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Report deleted successfully",
    });
  } catch (error) {
    console.error(`Error deleting report: ${error}`);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const listReports = async (req, res) => {
  try {
    const reports = await BodReport.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      reports,
    });
  } catch (error) {
    console.error(`Error fetching reports: ${error}`);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
