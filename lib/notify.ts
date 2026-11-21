/**
 * Optional webhook notification. Deliberately excludes name, phone,
 * registration, notes and any other personal or vehicle-identifying detail.
 */

export type SubmissionNotice = {
  kind: "booking" | "quote";
  reference: string;
  summary: string;
  receivedAt: string;
};

export async function notifySubmission(notice: SubmissionNotice): Promise<{ notified: boolean }> {
  const url = process.env.NOTIFY_WEBHOOK_URL;
  if (!url) return { notified: false };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: `tyrespeed.${notice.kind}.received`,
        reference: notice.reference,
        summary: notice.summary,
        receivedAt: notice.receivedAt,
      }),
      signal: AbortSignal.timeout(5000),
    });
    return { notified: response.ok };
  } catch {
    return { notified: false };
  }
}
