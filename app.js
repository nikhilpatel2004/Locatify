if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const nodemailer = require("nodemailer");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const path = require("path");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError.js");

// Routes
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// Auth & Session
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

// --------------------
// ✅ Database Connection
// --------------------
const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

async function main() {
  await mongoose.connect(dbUrl);
}

// --------------------
// ✅ Express App Setup
// --------------------
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true, limit: "100mb" }));
app.use(express.json({ limit: "100mb" }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// --------------------
// ✅ Session Configuration
// --------------------
const mongoStore = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: { secret:process.env.SECRET },
  touchAfter: 24 * 60 * 60,
});

mongoStore.on("error", (e) => console.log("Session store error:", e));

const sessionOptions = {
  store: mongoStore,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

// --------------------
// ✅ Passport Configuration
// --------------------
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// --------------------
// ✅ Global Template Variables
// --------------------
app.use((req, res, next) => {
  // 👇 Prevents ReferenceError in EJS even if user is not logged in
  res.locals.currentUser = req.user || null;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.mapboxToken = process.env.MAPBOX_TOKEN || "";
  next();
});

// --------------------
// ✅ Contact Form (Email)
// --------------------
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: `New Contact Message from Locatify: ${name}`,
      text: `You have received a new message:\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `<p><b>Name:</b> ${name}</p><p><b>Email:</b> ${email}</p><p><b>Message:</b></p><p>${message}</p>`,
    };

    await transporter.sendMail(mailOptions);
    req.flash("success", "Thank you for your message! We’ll get back to you soon.");
  } catch (error) {
    console.error("Error sending contact email:", error);
    req.flash("error", "Something went wrong. Please try again later.");
  }
  res.redirect("/listings");
});

// --------------------
// ✅ Static Pages (Moved after all middleware)
// --------------------
app.get("/privacy", (req, res) => res.render("privacy.ejs"));
app.get("/terms", (req, res) => res.render("terms.ejs"));
app.get("/faq", (req, res) => res.render("faq.ejs"));
app.get("/contact", (req, res) => res.render("contact.ejs"));
app.get("/about", (req, res) => res.render("about.ejs"));


// --------------------
// ✅ Routers
// --------------------
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// --------------------
// ✅ 404 + Error Handler
// --------------------
app.all(/.*/, (req, res, next) => next(new ExpressError("Page Not Found!", 404)));

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message, statusCode });
});

// --------------------
// ✅ Server Start
// --------------------
app.listen(8080, () => {
  console.log("🚀 Server running on http://localhost:8080");
});
