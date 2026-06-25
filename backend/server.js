// server.js (or index.js)
import express from "express";
import ConnectDB from "./config/db.js";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import createNjangiRoutes from "./routes/create.njangi.route.js";
import validationRoutes from "./routes/validation.routes.js";
import actionNjangiRoutes from "./routes/bod.njangi.route.js";
import authRoutes from "./routes/auth.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import acceptInvite from "./routes/accept.invite.member.route.js";
import limiter from "./middleware/limiter.js";
import helmet from "helmet";
import ValidateInviteToken from "./routes/validate.invite.token.route.js";
import validateDraftId from "./routes/validate.draft.id.route.js";
import adminRoutes from "./routes/admin.routes.js";
import njangiRoutes from "./routes/user.njangi.routes.js";
import userRoutes from "./routes/user.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import Message from "./models/message.model.js";
import updateNjangiDetails from "./routes/update.njangi.details.route.js";
import { Server } from "socket.io";
import getNjangiStateOverview from "./routes/get.njangi.overview.route.js";
import getNjangiDraftId from "./routes/getNdraftId.route.js";
import "./jobs/njangi-jobs.js";
import { config } from "dotenv";
import contactRouter from "./routes/contact.routes.js";
import sessionMiddleware from "./middleware/session.js";

config();
import csrf from "csurf";

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();

const csrfProtection = csrf({ cookie: false });

// ─── MIDDLEWARE ────────────────────────────────────────────────────────────────
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://njangihub.loopos.org/",
      process.env.FRONTEND_URL,
    ],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
app.set("trust proxy", 1);
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use(sessionMiddleware);

// Health check — kept before the rate limiter and CSRF so probes are never blocked.
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

app.use("/", limiter);
app.use(helmet());

// ─── ROUTES ─────────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);

app.use("/api/create-njangi", createNjangiRoutes);
app.use("/api", validationRoutes);
app.use("/api/contact", contactRouter);
app.use("/api/member", acceptInvite);

// Mount CSRF protection
app.use(csrfProtection);

app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});

// CSRF token route — must come AFTER csrfProtection
app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.use("/api/bod", actionNjangiRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/njangi", njangiRoutes);
app.use("/api/invites", ValidateInviteToken);
app.use("/api/admin", validateDraftId);
app.use("/api/state-dashboard", getNjangiStateOverview);
app.use("/api/state-dashboard", updateNjangiDetails);
app.use("/api/admin", adminRoutes);
app.use("/api/njangi-ndraft", getNjangiDraftId);
app.use("/api/payment", paymentRoutes);
app.use("/api/user", userRoutes);

// ─── CREATE HTTP + SOCKET.IO SERVER ────────────────────────────────────────────
const startServer = async () => {
  try {
    await ConnectDB(); // connect to Mongo/Postgres/etc.

    // Create an HTTP server from Express
    const server = http.createServer(app);

    // Attach Socket.IO to that same server
    const io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST"],
      },
    });

    // ─── SOCKET.IO LOGIC ────────────────────────────────────────────────────
    io.on("connection", (socket) => {
      console.log("🔌 A client connected:", socket.id);

      // 1️⃣ Handle joinRoom: socket joins a room named after groupId
      socket.on("joinRoom", async ({ groupId }) => {
        if (!groupId) return;

        socket.join(groupId);
        console.log(`Socket ${socket.id} joined room ${groupId}`);

        const history = await Message.find({ groupId }).sort({ timestamp: 1 });
        socket.emit("chatHistory", history);

        // If you don’t have chat‐history in DB, skip this step.
      });

      socket.on("sendMessage", async (payload) => {
        console.log(payload);
        const { groupId, message } = payload;
        if (!groupId || !message) return;

        const saved = await Message.create({
          groupId,
          senderId: message.senderId,
          senderName: message.senderName,
          content: message.content,
          timestamp: message.timestamp,
          attachment: message.attachment || undefined,
        });

        io.in(groupId).emit("receiveMessage", {
          ...saved.toObject(),
          isCurrentUser: message.sender === message.sender, // client can decide styling
        });
      });

      socket.on("disconnect", () => {
        console.log("🔌 A client disconnected:", socket.id);
      });
    });

    // ─── START LISTENING ──────────────────────────────────────────────────────
    server.listen(PORT, () => {
      console.log(`✅ Server (HTTP + Socket.IO) running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Error starting server:", err);
    process.exit(1);
  }
};

startServer();
