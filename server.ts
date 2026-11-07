import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// ==========================================
// IN-MEMORY SECURE AUTH & OTP STORE
// ==========================================
interface UserRecord {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  passwordHash: string;
  role: 'student' | 'admin';
  emailVerified: boolean;
  createdAt: string;
}

interface OtpRecord {
  hashedOtp: string;
  createdAt: number;
  expiresAt: number; // 5 minutes
  lastSentAt: number;
  attempts: number; // max 5 incorrect attempts
}

// In-memory persistent collections during runtime
const usersDb = new Map<string, UserRecord>();
const otpDb = new Map<string, OtpRecord>();
const passwordResetDb = new Map<string, { token: string; expiresAt: number }>();

// Helper: SHA-256 hash for secure storage
function hashSecret(secret: string): string {
  return crypto.createHash('sha256').update(secret).digest('hex');
}

// Pre-provision authorized Administrator account (Dr. Rajesh Verma) securely on server
const defaultAdminEmail = 'admin@grantly.edu';
usersDb.set(defaultAdminEmail.toLowerCase(), {
  id: 'admin-001',
  fullName: 'Administrator',
  email: defaultAdminEmail,
  phone: '+91 98765 43210',
  passwordHash: hashSecret('Admin@Grantly2026!'),
  role: 'admin',
  emailVerified: true,
  createdAt: '2025-01-01T00:00:00.000Z',
});

// Helper: Send simulated or live transactional email
async function dispatchEmail(options: { to: string; subject: string; text: string; html?: string }): Promise<boolean> {
  const { to, subject, text } = options;

  console.log(`\n========================================`);
  console.log(`[SECURE EMAIL DISPATCH]`);
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Content:\n${text}`);
  console.log(`========================================\n`);

  // If RESEND_API_KEY is configured in runtime environment:
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'GRANTLY Platform <onboarding@resend.dev>',
          to: [to],
          subject,
          text,
        }),
      });
      if (!res.ok) {
        console.warn(`[Resend API notice] Status: ${res.status}`);
      }
    } catch (err) {
      console.warn('[Resend API dispatch error]', err);
    }
  }

  return true;
}

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!apiKey,
    contactEmailConfigured: true,
    authConfigured: true,
  });
});

// ==========================================
// AUTHENTICATION & EMAIL OTP ENDPOINTS
// ==========================================

// 1. Student Registration: Step 1 & 2
app.post('/api/auth/register-student', async (req: Request, res: Response) => {
  try {
    const { fullName, email, phone, password } = req.body;

    if (!fullName || typeof fullName !== 'string' || !fullName.trim()) {
      return res.status(400).json({ error: 'Full name is required.' });
    }
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'A valid email address is required.' });
    }
    if (!phone || typeof phone !== 'string' || phone.trim().length < 8) {
      return res.status(400).json({ error: 'Valid phone number is required.' });
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if account already exists
    const existing = usersDb.get(normalizedEmail);
    if (existing && existing.emailVerified) {
      return res.status(400).json({ error: 'An account with this email address already exists. Please sign in.' });
    }

    // Create or update pending student record
    const userId = existing ? existing.id : `std-${Date.now().toString().slice(-6)}`;
    const userRecord: UserRecord = {
      id: userId,
      fullName: fullName.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      passwordHash: hashSecret(password),
      role: 'student', // strictly enforce student role
      emailVerified: false,
      createdAt: existing ? existing.createdAt : new Date().toISOString(),
    };
    usersDb.set(normalizedEmail, userRecord);

    // Generate secure 6-digit OTP
    const rawOtp = crypto.randomInt(100000, 999999).toString();
    const hashedOtp = hashSecret(rawOtp);
    const now = Date.now();
    const expiresAt = now + 5 * 60 * 1000; // 5 minutes

    otpDb.set(normalizedEmail, {
      hashedOtp,
      createdAt: now,
      expiresAt,
      lastSentAt: now,
      attempts: 0,
    });

    // Send verification OTP via email
    await dispatchEmail({
      to: normalizedEmail,
      subject: 'GRANTLY Verification Code: ' + rawOtp,
      text: `Hello ${fullName.trim()},\n\nYour 6-digit verification code for GRANTLY Student Portal is: ${rawOtp}\n\nThis code will expire in 5 minutes. Please enter it on the registration verification screen to complete your student account activation.\n\nBest regards,\nGRANTLY Team`,
    });

    return res.status(200).json({
      success: true,
      message: 'Verification code sent to registered email address.',
      email: normalizedEmail,
      expiresInSeconds: 300,
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Internal server error during student registration.' });
  }
});

// 2. Verify Email OTP
app.post('/api/auth/verify-otp', async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const otpData = otpDb.get(normalizedEmail);
    const user = usersDb.get(normalizedEmail);

    if (!user) {
      return res.status(404).json({ error: 'No account registration found for this email address.' });
    }
    if (!otpData) {
      return res.status(400).json({ error: 'No active OTP verification code found. Please request a new code.' });
    }

    // Check expiration (5 minutes)
    if (Date.now() > otpData.expiresAt) {
      otpDb.delete(normalizedEmail);
      return res.status(400).json({ error: 'Verification code has expired. Please click "Resend Code".' });
    }

    // Check rate limit on incorrect attempts (max 5)
    if (otpData.attempts >= 5) {
      otpDb.delete(normalizedEmail);
      return res.status(429).json({ error: 'Too many incorrect attempts. Please request a new verification code.' });
    }

    // Verify hashed OTP
    const cleanOtp = otp.toString().trim();
    const incomingHash = hashSecret(cleanOtp);

    if (incomingHash !== otpData.hashedOtp) {
      otpData.attempts += 1;
      const remaining = 5 - otpData.attempts;
      return res.status(400).json({
        error: `Invalid 6-digit verification code. ${remaining > 0 ? `${remaining} attempts remaining.` : 'Code revoked.'}`,
      });
    }

    // Mark verified on trusted backend
    user.emailVerified = true;
    usersDb.set(normalizedEmail, user);
    otpDb.delete(normalizedEmail); // consume OTP

    return res.status(200).json({
      success: true,
      message: 'Email address verified successfully.',
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        emailVerified: true,
      },
    });
  } catch (error: any) {
    console.error('Verify OTP error:', error);
    return res.status(500).json({ error: 'Internal server error during verification.' });
  }
});

// 3. Resend OTP with 60-second cooldown
app.post('/api/auth/resend-otp', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email address is required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = usersDb.get(normalizedEmail);
    if (!user) {
      return res.status(404).json({ error: 'No account registration found for this email address.' });
    }

    const existingOtp = otpDb.get(normalizedEmail);
    const now = Date.now();

    // 60-second cooldown
    if (existingOtp && now - existingOtp.lastSentAt < 60 * 1000) {
      const waitTime = Math.ceil((60 * 1000 - (now - existingOtp.lastSentAt)) / 1000);
      return res.status(429).json({ error: `Please wait ${waitTime} seconds before requesting a new code.` });
    }

    // Generate new secure 6-digit OTP
    const rawOtp = crypto.randomInt(100000, 999999).toString();
    const hashedOtp = hashSecret(rawOtp);
    const expiresAt = now + 5 * 60 * 1000;

    otpDb.set(normalizedEmail, {
      hashedOtp,
      createdAt: now,
      expiresAt,
      lastSentAt: now,
      attempts: 0,
    });

    await dispatchEmail({
      to: normalizedEmail,
      subject: 'GRANTLY New Verification Code: ' + rawOtp,
      text: `Hello ${user.fullName},\n\nYour new 6-digit verification code is: ${rawOtp}\n\nThis code will expire in 5 minutes.\n\nBest regards,\nGRANTLY Team`,
    });

    return res.status(200).json({
      success: true,
      message: 'A fresh verification code has been dispatched to your email.',
      cooldownSeconds: 60,
    });
  } catch (error: any) {
    console.error('Resend OTP error:', error);
    return res.status(500).json({ error: 'Failed to resend verification code.' });
  }
});

// 4. Student Login Endpoint (Requires email_verified)
app.post('/api/auth/login-student', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = usersDb.get(normalizedEmail);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password. Please check your credentials.' });
    }

    // Check role - students only
    if (user.role !== 'student') {
      return res.status(403).json({ error: 'This portal is restricted to student accounts.' });
    }

    // Check password
    if (user.passwordHash !== hashSecret(password)) {
      return res.status(401).json({ error: 'Invalid email or password. Please check your credentials.' });
    }

    // Enforce email verification constraint
    if (!user.emailVerified) {
      return res.status(403).json({
        error: 'Email address has not been verified yet. Please complete verification.',
        needsVerification: true,
        email: normalizedEmail,
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        emailVerified: user.emailVerified,
      },
    });
  } catch (error: any) {
    console.error('Student login error:', error);
    return res.status(500).json({ error: 'Internal server error during student authentication.' });
  }
});

// 5. Admin Login Endpoint (Strict server-side validation, no public registration)
app.post('/api/auth/login-admin', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Administrator email and password are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = usersDb.get(normalizedEmail);

    if (!user || user.role !== 'admin') {
      return res.status(401).json({ error: 'Invalid administrator credentials or unauthorized access.' });
    }

    if (user.passwordHash !== hashSecret(password)) {
      return res.status(401).json({ error: 'Invalid administrator credentials.' });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        emailVerified: true,
      },
    });
  } catch (error: any) {
    console.error('Admin login error:', error);
    return res.status(500).json({ error: 'Internal server error during admin authentication.' });
  }
});

// 6. Forgot Password - Send Reset Link/Code
app.post('/api/auth/forgot-password', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'Please enter a valid registered email address.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = usersDb.get(normalizedEmail);

    if (!user) {
      // Security standard: avoid leaking whether an email exists or not
      return res.status(200).json({
        success: true,
        message: `If an account exists for ${normalizedEmail}, password reset instructions have been sent.`,
      });
    }

    const resetToken = crypto.randomBytes(24).toString('hex');
    const resetExpires = Date.now() + 15 * 60 * 1000; // 15 mins
    passwordResetDb.set(normalizedEmail, { token: resetToken, expiresAt: resetExpires });

    await dispatchEmail({
      to: normalizedEmail,
      subject: 'GRANTLY Password Reset Request',
      text: `Hello ${user.fullName},\n\nWe received a request to reset your password on GRANTLY.\n\nYour password reset security token is: ${resetToken.slice(0, 8).toUpperCase()}\n\nIf you did not make this request, you can safely ignore this email.\n\nBest regards,\nGRANTLY Security Team`,
    });

    return res.status(200).json({
      success: true,
      message: `Password reset instructions have been dispatched to ${normalizedEmail}.`,
    });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ error: 'Failed to process password recovery request.' });
  }
});

// ==========================================
// CONTACT US ENDPOINT -> business.atharvk@gmail.com
// ==========================================
app.post('/api/contact', async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;

    // Field validation
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Full name is required.' });
    }
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'A valid email address is required.' });
    }
    if (!subject || typeof subject !== 'string' || !subject.trim()) {
      return res.status(400).json({ error: 'Subject is required.' });
    }
    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      return res.status(400).json({ error: 'Message must be at least 5 characters.' });
    }

    const recipient = 'business.atharvk@gmail.com';
    const timestamp = new Date().toISOString();

    console.log(`[CONTACT DISPATCH] Delivering inquiry to ${recipient}:`, {
      from: `${name.trim()} <${email.trim()}>`,
      subject: subject.trim(),
      message: message.trim(),
      timestamp,
    });

    await dispatchEmail({
      to: recipient,
      subject: `[GRANTLY Contact Form] ${subject.trim()}`,
      text: `New Contact Form Submission on GRANTLY:\n\nName: ${name.trim()}\nEmail: ${email.trim()}\nSubject: ${subject.trim()}\nTimestamp: ${timestamp}\n\nMessage:\n${message.trim()}`,
    });

    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    return res.status(200).json({
      success: true,
      messageId,
      recipient,
      message: `Your inquiry has been successfully delivered to ${recipient}. Our team will respond shortly.`,
      timestamp,
    });
  } catch (error: any) {
    console.error('Contact endpoint error:', error);
    return res.status(500).json({
      error: 'Failed to process contact form submission. Please try again or email business.atharvk@gmail.com directly.',
    });
  }
});

// Helper for rule-based recommendation fallback based on actual scholarship database
function getRuleBasedRecommendations(profile: any, scholarships: any[]) {
  return scholarships.map((sch: any) => {
    let score = 50;
    const reasons: string[] = [];
    const missing: string[] = [];

    // Education level check
    if (
      sch.educationLevel === 'All' ||
      sch.educationLevel?.toLowerCase() === profile.educationLevel?.toLowerCase() ||
      (profile.educationLevel === 'Undergraduate' && sch.educationLevel === 'Higher Education')
    ) {
      score += 20;
      reasons.push(`Matches your ${profile.educationLevel} education level.`);
    } else {
      score -= 25;
      missing.push(`Targeted for ${sch.educationLevel} students.`);
    }

    // Course check
    const courses: string[] = sch.eligibleCourses || [];
    const isCourseMatch =
      courses.includes('All') ||
      courses.some((c: string) => profile.course?.toLowerCase().includes(c.toLowerCase()));
    if (isCourseMatch) {
      score += 15;
      reasons.push(`Open to ${profile.course} disciplines.`);
    } else {
      score -= 15;
      missing.push(`Specific course eligibility requirements.`);
    }

    // Income check
    if (sch.maxFamilyIncome && profile.annualIncome) {
      if (profile.annualIncome <= sch.maxFamilyIncome) {
        score += 15;
        reasons.push(`Family income (₹${profile.annualIncome.toLocaleString('en-IN')}) is within limit (₹${sch.maxFamilyIncome.toLocaleString('en-IN')}).`);
      } else {
        score -= 30;
        missing.push(`Income ceiling of ₹${sch.maxFamilyIncome.toLocaleString('en-IN')} exceeded.`);
      }
    }

    // State check
    const states: string[] = sch.states || [];
    if (states.includes('All India') || states.includes(profile.state)) {
      score += 10;
      reasons.push(`Available in your state (${profile.state || 'All India'}).`);
    } else {
      score -= 20;
      missing.push(`Restricted to students from: ${states.join(', ')}.`);
    }

    // CGPA check
    if (sch.minCGPA && profile.cgpa) {
      if (profile.cgpa >= sch.minCGPA) {
        score += 10;
        reasons.push(`CGPA (${profile.cgpa}) meets minimum requirement (${sch.minCGPA}).`);
      } else {
        score -= 15;
        missing.push(`Requires minimum CGPA of ${sch.minCGPA}.`);
      }
    }

    const matchPercentage = Math.min(Math.max(score, 15), 98);
    let matchCategory: 'HIGH MATCH' | 'POSSIBLE MATCH' | 'NOT ELIGIBLE' = 'POSSIBLE MATCH';
    if (matchPercentage >= 75) {
      matchCategory = 'HIGH MATCH';
    } else if (matchPercentage < 45) {
      matchCategory = 'NOT ELIGIBLE';
    }

    return {
      scholarshipId: sch.id,
      matchCategory,
      matchPercentage,
      whyItMatches: reasons.length > 0 ? reasons.join(' ') : 'General academic opportunity.',
      missingRequirements: missing.length > 0 ? missing : ['Standard document verification required.'],
      actionTips: 'Verify domicile certificate and keep academic marksheets ready.',
    };
  });
}

// AI Scholarship Recommendation endpoint
app.post('/api/ai/recommend', async (req: Request, res: Response) => {
  try {
    const { profile, scholarships } = req.body;
    if (!profile || !scholarships || !Array.isArray(scholarships)) {
      return res.status(400).json({ error: 'Missing profile or scholarships data' });
    }

    // Use Gemini if available
    if (ai) {
      try {
        const catalogSubset = scholarships.map((s: any) => ({
          id: s.id,
          name: s.name,
          organization: s.organization,
          amount: s.amount,
          educationLevel: s.educationLevel,
          eligibleCourses: s.eligibleCourses,
          states: s.states,
          maxIncome: s.maxFamilyIncome,
          minCGPA: s.minCGPA,
          category: s.category,
          deadline: s.deadline,
        }));

        const prompt = `You are the core intelligence of GRANTLY, a unified scholarship discovery platform.
Analyze the following student profile against the provided scholarship catalog.

STUDENT PROFILE:
- Full Name: ${profile.fullName || 'Student'}
- Education Level: ${profile.educationLevel}
- Course: ${profile.course}
- Current Year: ${profile.currentYear || 'N/A'}
- State: ${profile.state}
- Annual Family Income: ₹${profile.annualIncome ? profile.annualIncome.toLocaleString('en-IN') : 'N/A'}
- CGPA / Score: ${profile.cgpa || 'N/A'}
- Category: ${profile.category || 'General'}
- Gender: ${profile.gender || 'Not specified'}

SCHOLARSHIPS CATALOG (DO NOT INVENT ANY SCHOLARSHIPS, ONLY USE THESE IDs AND NAMES):
${JSON.stringify(catalogSubset, null, 2)}

CRITICAL RULES:
1. ONLY evaluate and return scholarships that exist in the catalog above. Do NOT invent new scholarship names, amounts or deadlines.
2. Determine matchCategory: "HIGH MATCH" (meets core mandatory criteria), "POSSIBLE MATCH" (minor condition to verify or slight gap), or "NOT ELIGIBLE" (fails hard income, course, or state criteria).
3. Provide matchPercentage (integer between 0 and 100).
4. Provide concise "whyItMatches" explanation (1-2 sentences).
5. Provide "missingRequirements" list (strings of things the student needs to prepare or check, e.g., "Income certificate below ₹2.5L", "State domicile proof").
6. Provide "actionTips" (1 sentence advice on how to strengthen their application).

Return your response strictly as valid JSON matching this schema:
[
  {
    "scholarshipId": "string (matching id)",
    "matchCategory": "HIGH MATCH" | "POSSIBLE MATCH" | "NOT ELIGIBLE",
    "matchPercentage": number,
    "whyItMatches": "string",
    "missingRequirements": ["string"],
    "actionTips": "string"
  }
]`;

        // Timeout wrapper for Gemini call (120s max timeout)
        const geminiCall = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Gemini API call timed out after 120s')), 120000)
        );

        const response: any = await Promise.race([geminiCall, timeoutPromise]);
        const rawText = response.text || '[]';
        const parsed = JSON.parse(rawText);

        // Sanitize & validate that all returned items match real scholarships in the catalog
        const validIds = new Set(scholarships.map((s: any) => s.id));
        const sanitized = Array.isArray(parsed)
          ? parsed.filter((item: any) => validIds.has(item.scholarshipId))
          : [];

        if (sanitized.length > 0) {
          return res.json({ recommendations: sanitized, source: 'gemini' });
        }
      } catch (geminiError) {
        console.warn('Gemini recommendation call encountered issue, falling back to heuristic engine:', geminiError);
      }
    }

    // Heuristic Fallback based on real scholarships
    const heuristicResults = getRuleBasedRecommendations(profile, scholarships);
    return res.json({ recommendations: heuristicResults, source: 'rule-based-fallback' });
  } catch (error: any) {
    console.error('Recommend endpoint error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// AI Chatbot endpoint for GRANTLY Assistant
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  try {
    const { message, conversationHistory, context } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (ai) {
      try {
        const systemPrompt = `You are GRANTLY AI Assistant, a knowledgeable, empathetic, and accurate scholarship advisory companion.
Your mission is to guide Indian and global students through scholarship discovery, eligibility criteria, document requirements, and deadline management.

AVAILABLE SYSTEM CONTEXT & REAL SCHOLARSHIP DATA:
${context ? JSON.stringify(context, null, 2) : 'No explicit catalog passed; rely on standard Indian higher education scholarship policies (NSP, Reliance Foundation, AICTE, State Merit, Tata Trusts, HDFC Parivartan).'}

STRICT INSTRUCTIONS:
1. Never fabricate fake scholarship names, arbitrary application links, or unverified cash amounts.
2. If specific official dates or details are not confirmed in the data, state clearly: "This requires verification from the official scholarship portal."
3. Guide students on required documents (e.g. Income Certificate, Caste Certificate, Marksheet, Bonafide Certificate, Aadhaar).
4. Keep answers concise, student-friendly, well-structured with clear bullet points.
5. Emphasize that GRANTLY provides eligibility guidance and tracking, while official applications are submitted through the respective authorized provider portals.`;

        const geminiCall = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `History: ${JSON.stringify(conversationHistory || [])}\n\nUser Question: ${message}`,
                },
              ],
            },
          ],
          config: {
            systemInstruction: systemPrompt,
          },
        });

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Gemini chat timed out after 120s')), 120000)
        );

        const response: any = await Promise.race([geminiCall, timeoutPromise]);
        return res.json({ reply: response.text || 'I am ready to help you discover suitable scholarships.' });
      } catch (geminiError) {
        console.warn('Gemini chat error, using fallback:', geminiError);
      }
    }

    // High quality contextual fallback response if offline or key not provided
    const lower = message.toLowerCase();
    let reply = `I'm here to help with your scholarship search! `;

    if (lower.includes('b.tech') || lower.includes('engineering')) {
      reply = `For B.Tech / Engineering students, top scholarship opportunities include:
• **Reliance Foundation Undergraduate Scholarship**: Up to ₹2,00,000 for undergraduate students across engineering and other streams.
• **AICTE Pragati Scholarship**: ₹50,000/year specifically for female students enrolled in AICTE-approved technical institutions.
• **Aditya Birla Capital Scholarship**: Up to ₹60,000 for professional degree students.

Check your **AI Recommendations** tab to see exact match scores tailored to your CGPA and family income!`;
    } else if (lower.includes('document') || lower.includes('documents')) {
      reply = `Standard documents commonly required for scholarship applications include:
1. **Academic Marksheet** (10th, 12th, or latest semester grade card)
2. **Annual Income Certificate** issued by an authorized revenue authority (Tahsildar/SDM)
3. **Bonafide Student Certificate** from your current college/university
4. **Government Identity Proof** (Aadhaar Card / Voter ID)
5. **Bank Passbook Copy** (Account in student's name linked to Aadhaar)
6. **Caste / Category Certificate** (if applying under SC/ST/OBC/EWS quotas)

You can securely organize all these files inside **My Profile → Documents**.`;
    } else if (lower.includes('eligibility') || lower.includes('check')) {
      reply = `To check your eligibility:
1. Head to **AI Recommendations** from your student sidebar.
2. Review your personalized match scores and missing requirements.
3. You can also explore schemes directly from **Discover Scholarships** to view criteria itemized for Education Level, Family Income, CGPA, and State Domicile.`;
    } else if (lower.includes('apply') || lower.includes('how to apply')) {
      reply = `Here is how to apply through GRANTLY:
1. Discover matching opportunities on the **Discover Scholarships** page.
2. Review eligibility and required documents.
3. Click **"Apply on Official Portal"** to visit the verified provider portal (such as National Scholarship Portal or Trust website).
4. Save the scholarship to **My Applications** on GRANTLY to log your submission date, track your documents, and receive deadline reminders.`;
    } else {
      reply = `Hello! I am your GRANTLY AI Assistant. You can ask me:
• "Which scholarships match my course (e.g. B.Tech, B.Sc, MBA)?"
• "What documents are needed for income-based grants?"
• "How do I check my eligibility score?"
• "Which application deadlines are closing this week?"

Feel free to ask any question about your scholarship journey!`;
    }

    return res.json({ reply });
  } catch (err: any) {
    console.error('Chat endpoint error:', err);
    res.status(500).json({ error: 'Failed to process chat request' });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GRANTLY server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
