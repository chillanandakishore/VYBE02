import { ReportItem } from "@/types";

const adminReportsStore: Map<string, ReportItem> = new Map();

const initialReports: ReportItem[] = [];

initialReports.forEach((r) => adminReportsStore.set(r.id, r));

export const dbAdmin = {
  getReports: async (): Promise<ReportItem[]> => {
    const list = Array.from(adminReportsStore.values());
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return list;
  },

  updateReportStatus: async (
    reportId: string,
    action: "DISMISS" | "RESOLVE" | "DELETE_POST"
  ): Promise<{ success: boolean; report: ReportItem }> => {
    const report = adminReportsStore.get(reportId);
    if (!report) throw new Error("Report not found");

    if (action === "DISMISS") {
      report.status = "DISMISSED";
    } else {
      report.status = "RESOLVED";
    }

    adminReportsStore.set(reportId, report);
    return { success: true, report };
  },

  createReport: async (
    postId: string,
    reporterId: string,
    reporterName: string,
    reason: string,
    postContent?: string,
    authorUsername?: string
  ): Promise<ReportItem> => {
    const id = `rep_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newReport: ReportItem = {
      id,
      postId,
      reporterId,
      reporterName,
      reason,
      postContent,
      authorUsername,
      status: "PENDING",
      createdAt: new Date().toISOString(),
    };

    adminReportsStore.set(id, newReport);
    return newReport;
  },

  reportPost: async (
    reporterId: string,
    postId: string,
    reason: string
  ): Promise<ReportItem> => {
    return dbAdmin.createReport(postId, reporterId, "Community Member", reason);
  },
};
