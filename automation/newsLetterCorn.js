import cron from "node-cron"
import { Job } from "../models/job.model.js"
import { User } from "../models/user.model.js"
import { sendMail } from "../utils/sendEmail.js"

const escapeHtml = (value = "") => String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#039;");

const buildNewsletterEmail = (user, job) => {
        const jobTitle = job.title || "New Opportunity";
        const location = job.location || "Remote";
        const jobType = job.jobType || "Full-time";
        const requiredSkills = job.qualification || "Not specified";
        const salaryRange = job.salary || "Not disclosed";
        const companyName = job.companyName || "A company";
        const name = user.firstName || "there";

        const subject = `New ${jobTitle} role at ${companyName} - matches your profile`;
        const message = `Hi ${name},\n\nA new job matching your niche has just been posted on JobPortal.\n\n${jobTitle}\n${companyName} | ${location} | ${jobType}\n\nSkills: ${requiredSkills}\nSalary: ${salaryRange}\n\nThis role was recommended based on your selected niches.\nApply soon - positions fill up fast.\n\nGood luck,\nThe JobPortal Team`;

        const html = `
        <div style="margin:0;padding:24px;background:#f4f6fb;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
                <tr>
                    <td style="padding:20px 24px;background:#0f172a;color:#ffffff;font-size:20px;font-weight:700;">JobPortal</td>
                </tr>
                <tr>
                    <td style="padding:24px;">
                        <p style="margin:0 0 14px;font-size:16px;">Hi ${escapeHtml(name)},</p>
                        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;">A new job matching your niche has just been posted. Here are the details:</p>

                        <div style="border:1px solid #e5e7eb;border-radius:10px;padding:16px;background:#f9fafb;margin:0 0 16px;">
                            <p style="margin:0 0 8px;font-size:18px;font-weight:700;color:#111827;">${escapeHtml(jobTitle)}</p>
                            <p style="margin:0 0 10px;font-size:14px;color:#374151;">${escapeHtml(companyName)} | ${escapeHtml(location)} | ${escapeHtml(jobType)}</p>
                            <p style="margin:0 0 8px;font-size:14px;"><strong>Qualification:</strong> ${escapeHtml(requiredSkills)}</p>
                            <p style="margin:0;font-size:14px;"><strong>Salary:</strong> ${escapeHtml(salaryRange)}</p>
                        </div>

                        <p style="margin:0 0 10px;font-size:14px;line-height:1.6;">This role was recommended based on your selected niches. Apply soon - positions fill up fast.</p>
                        <p style="margin:0;font-size:14px;line-height:1.6;">Good luck,<br/>The JobPortal Team</p>
                    </td>
                </tr>
            </table>
        </div>`;

        return { subject, message, html };
};

export const newsLetterCorn = () => {
    cron.schedule('*/1 * * * *', async () => {
        const jobs = await Job.find({ newsLettersSent: false })
        for (const job of jobs) {
            try {

                // jobs me se job ko lo 
                const filteredUsers = await User.find({
                    $or: [
                        { "niches.firstNiche": job.jobNiche },// yha pe hm 
                        { "niches.secoundNiche": job.jobNiche },// job ke nich ko user ke thino niches ko mila rhe hai 
                        { "niches.thirdNiche": job.jobNiche },
                    ]
                })
                let sentCount = 0;

                for (const user of filteredUsers) {
                    const { subject, message, html } = buildNewsletterEmail(user, job);
                    try {
                        await sendMail({
                            email: user.email,
                            subject,
                            message,
                            html
                        });
                        sentCount += 1;
                    } catch (mailError) {
                        console.error(`Newsletter email failed for ${user.email}:`, mailError.message || mailError);
                    }
                }

                if (filteredUsers.length === 0 || sentCount === filteredUsers.length) {
                    job.newsLettersSent = true;
                    await job.save();
                    console.log("Newsletter emails sent for job:", job._id);
                }
            }catch(error){
                console.error("Error in newsletter cron:", error || "Some error in cron.");
            }
        }
    });

}