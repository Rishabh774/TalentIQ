import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";
import { upsertStreamUser } from "../lib/stream.js";
import { resolveInitialRole } from "../lib/roles.js";

const googleClient = new OAuth2Client(ENV.GOOGLE_CLIENT_ID);

function signAppToken(user) {
  return jwt.sign(
    { sub: user.googleId, email: user.email },
    ENV.JWT_SECRET,
    { expiresIn: ENV.JWT_EXPIRES_IN }
  );
}

async function getProfileFromCredential(credential) {
  // Google ID token (JWT) — verify it locally
  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: ENV.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return {
    googleId: payload.sub,
    email: payload.email,
    name: payload.name || payload.email.split("@")[0],
    profileImage: payload.picture || "",
    emailVerified: payload.email_verified,
  };
}

async function getProfileFromAccessToken(accessToken) {
  // Access token — call Google's userinfo endpoint
  const resp = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!resp.ok) {
    const body = await resp.text().catch(() => "");
    throw new Error(`Google userinfo failed: ${resp.status} ${body}`);
  }
  const info = await resp.json();
  return {
    googleId: info.sub,
    email: info.email,
    name: info.name || info.email.split("@")[0],
    profileImage: info.picture || "",
    emailVerified: info.email_verified,
  };
}

export async function googleLogin(req, res) {
  try {
    const { credential, accessToken } = req.body;
    if (!credential && !accessToken) {
      return res.status(400).json({ message: "Google credential or accessToken is required" });
    }

    const profile = credential
      ? await getProfileFromCredential(credential)
      : await getProfileFromAccessToken(accessToken);

    if (!profile.emailVerified) {
      return res.status(401).json({ message: "Google email not verified" });
    }

    let user = await User.findOne({ googleId: profile.googleId });

    if (!user) {
      user = await User.create({
        googleId: profile.googleId,
        email: profile.email,
        name: profile.name,
        profileImage: profile.profileImage,
        ...resolveInitialRole(profile.email),
      });

      try {
        await upsertStreamUser({
          id: user.googleId.toString(),
          name: user.name,
          image: user.profileImage,
        });
      } catch (err) {
        console.error("Stream user upsert failed:", err.message);
      }
    } else if (resolveInitialRole(user.email).role === "admin" && user.role !== "admin") {
      user.role = "admin";
      user.roleSet = true;
      await user.save();
    }

    const token = signAppToken(user);
    res.status(200).json({ token, user });
  } catch (error) {
    console.error("Error in googleLogin controller:", error);
    const detail = error?.message || "unknown";
    res.status(401).json({
      message: "Invalid Google credential",
      detail,
      hint:
        !ENV.GOOGLE_CLIENT_ID
          ? "GOOGLE_CLIENT_ID is not set on the server"
          : !ENV.JWT_SECRET
          ? "JWT_SECRET is not set on the server"
          : !ENV.DB_URL
          ? "DB_URL is not set on the server"
          : undefined,
    });
  }
}
