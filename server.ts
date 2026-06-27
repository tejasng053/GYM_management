import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db";

import memberRoutes from "./src/routes/memberRoutes";
import trainerRoutes from "./src/routes/trainerRoutes";
import financeRoutes from "./src/routes/financeRoutes";
import inventoryRoutes from "./src/routes/inventoryRoutes";
import notificationRoutes from "./src/routes/notificationRoutes";
import { 
  INITIAL_MEMBERS, INITIAL_TRAINERS, INITIAL_FINANCE, 
  INITIAL_INVENTORY, INITIAL_NOTIFICATIONS 
} from "./src/data";
import Member from "./src/models/Member";
import Trainer from "./src/models/Trainer";
import Finance from "./src/models/Finance";
import Inventory from "./src/models/Inventory";
import Notification from "./src/models/Notification";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Connect to MongoDB Database
  await connectDB();

  app.use(cors());
  app.use(express.json());

  // Register API Routes
  app.use('/api/members', memberRoutes);
  app.use('/api/trainers', trainerRoutes);
  app.use('/api/finance', financeRoutes);
  app.use('/api/inventory', inventoryRoutes);
  app.use('/api/notifications', notificationRoutes);

  // Seed route to reset database with initial data
  app.post('/api/seed', async (req, res) => {
    try {
      await Member.deleteMany({});
      await Trainer.deleteMany({});
      await Finance.deleteMany({});
      await Inventory.deleteMany({});
      await Notification.deleteMany({});
      await Member.insertMany(INITIAL_MEMBERS);
      await Trainer.insertMany(INITIAL_TRAINERS);
      await Finance.create(INITIAL_FINANCE);
      await Inventory.insertMany(INITIAL_INVENTORY);
      await Notification.insertMany(INITIAL_NOTIFICATIONS);
      res.json({ message: 'Database seeded successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to seed database' });
    }
  });

  // API Route: AI Operational Suggestions & Schemes
  app.post("/api/improve-tips", async (req, res) => {
    try {
      const { membersCount, trainersCount, equipmentIssues, recentRevenue } = req.body;
      
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        // Return structured mock tips & schemes if key is not configured, with a note
        return res.json({
          status: "fallback",
          tips: [
            "**Deploy Peak-Hour Staffing Strategy**: Move at least 2 coaches to the floor between 6:00 PM and 8:30 PM, as live occupancies surge.",
            "**Rotate Frayed Cable Accessories**: Your Hack Squat Cable is currently frayed. Perform preventative replacement to avoid mid-workout disruption.",
            "**Introduce Loyalty Milestone Perks**: Reward athletes when they exceed **500 Stride Points** (e.g., free premium protein shake or personalized mobility session)."
          ],
          schemes: [
            {
              title: "Monsoon Fitness Hustle (Promo)",
              description: "Offer a 15% discount for 3-month upfront packages during rainy seasons, including a free personalized nutrition split setup.",
              target: "At-Risk/Inactive Athletes"
            },
            {
              title: "Stride Point Reward Multiplier",
              description: "Earn 2x Stride Points on Friday check-ins to boost lower-occupancy end-of-week attendance.",
              target: "All Active Members"
            }
          ]
        });
      }

      // Initialize Gemini SDK lazily to avoid crashing on start if API key is invalid or empty
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const systemInstruction = "You are an elite gym business operations analyst, marketing strategist, and fitness club consultant for 'Iron Haven' gym. Your goal is to provide highly precise, practical, and premium suggestions to improve the facility's operations, retention, equipment maintenance, and profitability.";
      
      const prompt = `Here is the current state of the facility:
- Total registered members: ${membersCount || 5}
- Active trainers: ${trainersCount || 5}
- Current equipment issues: ${JSON.stringify(equipmentIssues || ["Hack Squat Press 2 cable frayed"])}
- Financial standing: Recent revenue of around ₹${recentRevenue || "42,500 INR"} daily

Based on this, generate:
1. Three high-impact 'Operational Tips' to improve gym operations, coach load, safety, or retention. Use markdown bold where appropriate.
2. Two custom 'Promotional/Pricing Schemes' to boost sales or re-engage soon-to-expire members.

Respond with a raw JSON object containing:
{
  "tips": ["Tip 1", "Tip 2", "Tip 3"],
  "schemes": [
    { "title": "Scheme Title", "description": "Scheme Description", "target": "Target Audience" }
  ]
}
Return ONLY the JSON. No markdown blocks, no other text.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
        }
      });

      const responseText = response.text || "{}";
      const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsedData = JSON.parse(cleanJson);
      
      return res.json({
        status: "success",
        tips: parsedData.tips || [],
        schemes: parsedData.schemes || []
      });

    } catch (error: any) {
      console.error("Gemini API server-side error:", error);
      return res.status(500).json({
        error: "Failed to generate tips",
        details: error.message
      });
    }
  });

  // Serve client assets
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express+Vite Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
