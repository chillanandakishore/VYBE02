"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
}

const REPORT_REASONS = [
  "Spam or misleading content",
  "Harassment, hate speech, or bullying",
  "Copyright or intellectual property infringement",
  "Violent or graphic content",
  "Harmful misinformation",
  "Other safety violation",
];

export function ReportModal({ isOpen, onClose, postId }: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState(REPORT_REASONS[0]);
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/posts/${postId}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: `${selectedReason}: ${additionalNotes}` }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast({
          type: "success",
          title: "Report Submitted",
          message: "Thank you for keeping VYBE safe. Our team is reviewing this post.",
        });
        onClose();
      } else {
        toast({
          type: "error",
          title: "Report Failed",
          message: data.message || "Failed to submit report.",
        });
      }
    } catch {
      toast({
        type: "error",
        title: "Network Error",
        message: "Unable to submit report. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Report Content"
      description="Help maintain a high-trust, safe community on VYBE."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>Reports are anonymous and reviewed by human moderators.</span>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-neutral-300">Select Reason</label>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {REPORT_REASONS.map((reason) => (
              <button
                type="button"
                key={reason}
                onClick={() => setSelectedReason(reason)}
                className={`w-full text-left p-2.5 rounded-xl border text-xs flex items-center justify-between transition-colors ${
                  selectedReason === reason
                    ? "bg-violet-600/20 border-violet-500 text-white font-medium"
                    : "bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-800"
                }`}
              >
                <span>{reason}</span>
                {selectedReason === reason && <CheckCircle2 className="w-4 h-4 text-violet-400" />}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-neutral-300">Additional context (optional)</label>
          <textarea
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder="Provide any details that will help our moderation team..."
            rows={2}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white placeholder:text-neutral-500 outline-none focus:border-violet-500 resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="danger" size="sm" isLoading={isSubmitting}>
            Submit Report
          </Button>
        </div>
      </form>
    </Modal>
  );
}
