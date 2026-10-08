import { ReportItem } from "@/types";

const adminReportsStore: Map<string, ReportItem> = new Map();

const initialReports: ReportItem[] = [
  {
    id: "rep_seed_1",
    postId: "post_seed_2",
    reporterId: "usr_photog_03",
    reporterName: "kenji_shoots",
    reason: "Possible duplicate repost from external forum",
    postContent: "Which frontend state management solution do you rely on most in 2026? Vote below!",
    authorUsername: "maya_dev",
    status: "PENDING",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: "rep_seed_2",
    postId: "post_seed_1",
    reporterId: "usr_coder_02",
    reporterName: "maya_dev",
    reason: "Spam or automated comment bot flagged in thread",
    postContent: "Shinjuku Anamorphic Night Grading test on the Sony FX3...",
    authorUsername: "alex_rivers",
    status: "RESOLVED",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

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
