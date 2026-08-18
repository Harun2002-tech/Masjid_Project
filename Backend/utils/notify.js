import sendEmail from "./sendEmail.js";

// Fire-and-forget email: schedules the send on the next event-loop tick so the
// HTTP response is returned to the UI immediately instead of waiting on a
// network round-trip (SMTP/API latency). Failures are logged, never crash.
const notifyEmail = (options) => {
  setImmediate(async () => {
    try {
      await sendEmail(options);
    } catch (err) {
      console.error("Async Email Failed:", err.message);
    }
  });
};

export default notifyEmail;
