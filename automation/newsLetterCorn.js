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
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
        const viewJobUrl = `${frontendUrl}/jobs`;

        const subject = `New ${jobTitle} role at ${companyName} - matches your profile`;
        const message = `Hi ${name},\n\nA new job matching your niche has just been posted on HireHub.\n\n${jobTitle}\n${companyName} | ${location} | ${jobType}\n\nQualification: ${requiredSkills}\nSalary: ${salaryRange}\n\nThis role was recommended based on your selected niches.\nApply soon - positions fill up fast.\n\nView more jobs: ${viewJobUrl}\n\nGood luck,\nThe HireHub Team`;

        const html = `
        <div style="margin:0;padding:30px 12px;background:linear-gradient(180deg,#eef2ff 0%,#f8fbff 55%,#f1f5f9 100%);font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;color:#1f2937;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #dbe3f4;border-radius:20px;overflow:hidden;box-shadow:0 16px 40px rgba(15,23,42,0.12);">
                <tr>
                    <td style="padding:0;background:linear-gradient(120deg,#0f172a 0%,#1d4ed8 60%,#2563eb 100%);">
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                            <tr>
                                <td style="padding:22px 24px;color:#ffffff;">
                                    <p style="margin:0;font-size:20px;font-weight:700;letter-spacing:0.3px;">HireHub</p>
                                    <p style="margin:6px 0 0;font-size:13px;opacity:0.9;">Personalized Job Alert</p>
                                </td>
                                <td align="right" style="padding:22px 24px;">
                                    <span style="display:inline-block;padding:7px 12px;background:rgba(255,255,255,0.18);border:1px solid rgba(255,255,255,0.35);border-radius:999px;color:#ffffff;font-size:12px;font-weight:600;">Matched for you</span>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td style="padding:26px 24px 14px;">
                        <p style="margin:0 0 12px;font-size:16px;color:#0f172a;">Hi ${escapeHtml(name)},</p>
                        <p style="margin:0 0 18px;font-size:15px;line-height:1.7;color:#334155;">A new role matching your niche is now live. Here is a quick look:</p>

                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #dbe3f4;border-radius:16px;background:#f8faff;">
                            <tr>
                                <td style="padding:18px;">
                                    <p style="margin:0 0 8px;font-size:21px;font-weight:700;line-height:1.35;color:#0f172a;">${escapeHtml(jobTitle)}</p>
                                    <p style="margin:0 0 14px;font-size:14px;color:#334155;font-weight:600;">${escapeHtml(companyName)}</p>

                                    <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 14px;">
                                        <tr>
                                            <td style="padding:0 8px 8px 0;"><span style="display:inline-block;padding:7px 12px;border-radius:999px;background:#e2e8f0;color:#1e293b;font-size:12px;font-weight:700;">${escapeHtml(location)}</span></td>
                                            <td style="padding:0 8px 8px 0;"><span style="display:inline-block;padding:7px 12px;border-radius:999px;background:#dbeafe;color:#1d4ed8;font-size:12px;font-weight:700;">${escapeHtml(jobType)}</span></td>
                                        </tr>
                                    </table>

                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:separate;border-spacing:0 8px;">
                                        <tr>
                                            <td style="width:110px;font-size:13px;color:#64748b;vertical-align:top;">Qualification</td>
                                            <td style="font-size:14px;color:#0f172a;font-weight:600;">${escapeHtml(requiredSkills)}</td>
                                        </tr>
                                        <tr>
                                            <td style="width:110px;font-size:13px;color:#64748b;vertical-align:top;">Salary</td>
                                            <td style="font-size:14px;color:#0f172a;font-weight:600;">${escapeHtml(salaryRange)}/Months</td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td style="padding:4px 24px 12px;">
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;">
                            <tr>
                                <td style="padding:14px 16px;">
                                    <p style="margin:0 0 8px;font-size:13px;color:#475569;line-height:1.6;">This recommendation is based on your selected niches. Apply early for better chances.</p>
                                    <a href="${escapeHtml(viewJobUrl)}" style="display:inline-block;background:#1d4ed8;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:11px 18px;border-radius:10px;box-shadow:0 8px 18px rgba(29,78,216,0.28);">Explore Jobs</a>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td style="padding:12px 24px 24px;">
                        <p style="margin:0 0 8px;font-size:14px;line-height:1.6;color:#334155;">Good luck,<br/>The HireHub Team</p>
                        <p style="margin:0;font-size:12px;color:#94a3b8;">You are receiving this because job alerts are enabled in your profile.</p>
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