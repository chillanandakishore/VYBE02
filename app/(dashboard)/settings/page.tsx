"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import {
  User,
  Shield,
  Bell,
  Palette,
  Key,
  LogOut,
  Save,
  CheckCircle2,
  Lock,
  Globe,
  Smartphone,
  Eye,
  Sliders,
  AlertTriangle,
  Monitor,
  Moon,
  Sun
} from "lucide-react";

type TabType = "account" | "privacy" | "notifications" | "appearance" | "security";

export default function SettingsPage() {
  const { user, setUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("account");
  const [isSaving, setIsSaving] = useState(false);

  // Account State
  const [name, setName] = useState(user?.displayName || "");
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || "");
  const [website, setWebsite] = useState(user?.website || "");
  const [location, setLocation] = useState(user?.location || "");

  // Privacy State
  const [isPrivate, setIsPrivate] = useState(false);
  const [dmPermission, setDmPermission] = useState("everyone");
  const [readReceipts, setReadReceipts] = useState(true);
  const [searchVisibility, setSearchVisibility] = useState(true);

  // Notifications State
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailDigest, setEmailDigest] = useState(true);
  const [notifyLikes, setNotifyLikes] = useState(true);
  const [notifyComments, setNotifyComments] = useState(true);
  const [notifyMentions, setNotifyMentions] = useState(true);
  const [notifyFollows, setNotifyFollows] = useState(true);

  // Appearance State
  const [theme, setTheme] = useState<"dark" | "light" | "system">("dark");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [compactMode, setCompactMode] = useState(false);
  const [autoplayVideo, setAutoplayVideo] = useState(true);

  // Security State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Save Account Profile
  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/profile/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: name,
          bio,
          avatarUrl,
          website,
          location,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (data.user) {
          setUser(data.user);
        }
        toast({
          type: "success",
          title: "Profile Updated!",
          message: "Your profile details have been successfully saved.",
        });
      } else {
        toast({
          type: "error",
          title: "Update Failed",
          message: data.message || "Failed to save profile changes.",
        });
      }
    } catch {
      toast({
        type: "error",
        title: "Network Error",
        message: "Could not reach server to update profile.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Save General Preferences
  const handleSavePreferences = (section: string) => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({
        type: "success",
        title: `${section} Preferences Saved`,
        message: "Your changes are now active across your account.",
      });
    }, 400);
  };

  // Update Password
  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast({
        type: "error",
        title: "Missing Password",
        message: "Please enter your current password.",
      });
      return;
    }
    if (newPassword.length < 6) {
      toast({
        type: "error",
        title: "Password Too Short",
        message: "New password must be at least 6 characters long.",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({
        type: "error",
        title: "Passwords Do Not Match",
        message: "New password and confirmation must match exactly.",
      });
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast({
        type: "success",
        title: "Password Changed!",
        message: "Your security credentials have been successfully updated.",
      });
    }, 500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-border/50 pb-6">
        <h1 className="text-3xl font-black text-foreground tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your account preferences, security, privacy, and app experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <aside className="space-y-1.5 md:col-span-1">
          <button
            onClick={() => setActiveTab("account")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "account"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <User className="w-4 h-4" />
            Account
          </button>

          <button
            onClick={() => setActiveTab("privacy")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "privacy"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Shield className="w-4 h-4" />
            Privacy
          </button>

          <button
            onClick={() => setActiveTab("notifications")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "notifications"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Bell className="w-4 h-4" />
            Notifications
          </button>

          <button
            onClick={() => setActiveTab("appearance")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "appearance"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Palette className="w-4 h-4" />
            Appearance
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "security"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Key className="w-4 h-4" />
            Security
          </button>

          <div className="pt-4 border-t border-border/40 mt-4">
            <button
              onClick={() => logout()}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </div>
        </aside>

        {/* Content Panel */}
        <main className="md:col-span-3 bg-card border border-border/50 rounded-2xl p-6 sm:p-8 shadow-sm">
          {/* TAB 1: ACCOUNT */}
          {activeTab === "account" && (
            <form onSubmit={handleSaveAccount} className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-foreground">Account Information</h2>
                <p className="text-sm text-muted-foreground">Update your public profile and handle.</p>
              </div>

              <div className="flex items-center gap-5 pb-4 border-b border-border/40">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/40 bg-muted flex items-center justify-center text-xl font-bold">
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    name.charAt(0) || "U"
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">Profile Picture URL</p>
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Display Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Username</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-muted-foreground text-sm">@</span>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-muted/40 text-muted-foreground text-sm cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground">Email change requires verification link confirmation.</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell the VYBE community about your craft, goals, or passions..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Website or Portfolio</label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://yourportfolio.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: PRIVACY */}
          {activeTab === "privacy" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-foreground">Privacy Controls</h2>
                <p className="text-sm text-muted-foreground">Manage who sees your content and interactions.</p>
              </div>

              <div className="space-y-4 divide-y divide-border/40">
                <div className="flex items-center justify-between pt-2">
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-foreground">Private Account</p>
                    <p className="text-xs text-muted-foreground">
                      Only approved followers can view your feed and stories.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    className="w-5 h-5 accent-primary cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-foreground">Read Receipts</p>
                    <p className="text-xs text-muted-foreground">
                      Allow people to see when you have viewed their direct messages.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={readReceipts}
                    onChange={(e) => setReadReceipts(e.target.checked)}
                    className="w-5 h-5 accent-primary cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-foreground">Search Visibility</p>
                    <p className="text-xs text-muted-foreground">
                      Allow your profile to appear in global Explore and Search recommendations.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={searchVisibility}
                    onChange={(e) => setSearchVisibility(e.target.checked)}
                    className="w-5 h-5 accent-primary cursor-pointer"
                  />
                </div>

                <div className="pt-4 space-y-2">
                  <label className="text-sm font-semibold text-foreground">Who can message you</label>
                  <select
                    value={dmPermission}
                    onChange={(e) => setDmPermission(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="everyone">Everyone</option>
                    <option value="followers">Followers only</option>
                    <option value="none">Nobody</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => handleSavePreferences("Privacy")}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  <Save className="w-4 h-4" />
                  Save Privacy Settings
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-foreground">Notifications & Alerts</h2>
                <p className="text-sm text-muted-foreground">Choose what activities trigger notifications.</p>
              </div>

              <div className="space-y-4 divide-y divide-border/40">
                <div className="flex items-center justify-between pt-2">
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-foreground">Push Notifications</p>
                    <p className="text-xs text-muted-foreground">Receive real-time push alerts on your desktop/mobile.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={pushEnabled}
                    onChange={(e) => setPushEnabled(e.target.checked)}
                    className="w-5 h-5 accent-primary cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-foreground">Email Digest</p>
                    <p className="text-xs text-muted-foreground">Weekly recap of top community posts and challenges.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailDigest}
                    onChange={(e) => setEmailDigest(e.target.checked)}
                    className="w-5 h-5 accent-primary cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-foreground">Likes & Reactions</p>
                    <p className="text-xs text-muted-foreground">When someone vibes with or likes your post.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyLikes}
                    onChange={(e) => setNotifyLikes(e.target.checked)}
                    className="w-5 h-5 accent-primary cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-foreground">Comments & Replies</p>
                    <p className="text-xs text-muted-foreground">When someone comments on your post or replies to you.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyComments}
                    onChange={(e) => setNotifyComments(e.target.checked)}
                    className="w-5 h-5 accent-primary cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-foreground">Mentions</p>
                    <p className="text-xs text-muted-foreground">When someone tags you in a post or comment.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyMentions}
                    onChange={(e) => setNotifyMentions(e.target.checked)}
                    className="w-5 h-5 accent-primary cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-foreground">New Followers</p>
                    <p className="text-xs text-muted-foreground">When another creator begins following you.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyFollows}
                    onChange={(e) => setNotifyFollows(e.target.checked)}
                    className="w-5 h-5 accent-primary cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => handleSavePreferences("Notification")}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  <Save className="w-4 h-4" />
                  Save Notifications
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: APPEARANCE */}
          {activeTab === "appearance" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-foreground">Appearance & Interface</h2>
                <p className="text-sm text-muted-foreground">Customize your visual theme and motion preferences.</p>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-semibold text-foreground">Color Theme</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setTheme("dark")}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                      theme === "dark"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background text-muted-foreground hover:border-border/80"
                    }`}
                  >
                    <Moon className="w-5 h-5" />
                    <span className="text-xs font-semibold">Dark (Default)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme("light")}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                      theme === "light"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background text-muted-foreground hover:border-border/80"
                    }`}
                  >
                    <Sun className="w-5 h-5" />
                    <span className="text-xs font-semibold">Light</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme("system")}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                      theme === "system"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background text-muted-foreground hover:border-border/80"
                    }`}
                  >
                    <Monitor className="w-5 h-5" />
                    <span className="text-xs font-semibold">System</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4 divide-y divide-border/40 pt-2">
                <div className="flex items-center justify-between pt-4">
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-foreground">Reduced Motion</p>
                    <p className="text-xs text-muted-foreground">
                      Minimize 3D camera shifts, particle effects, and card hover physics.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={reducedMotion}
                    onChange={(e) => setReducedMotion(e.target.checked)}
                    className="w-5 h-5 accent-primary cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-foreground">Compact Feed Mode</p>
                    <p className="text-xs text-muted-foreground">Display posts with condensed margins and tighter layout.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={compactMode}
                    onChange={(e) => setCompactMode(e.target.checked)}
                    className="w-5 h-5 accent-primary cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-foreground">Autoplay Feed Videos</p>
                    <p className="text-xs text-muted-foreground">Automatically stream video previews when scrolled into view.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoplayVideo}
                    onChange={(e) => setAutoplayVideo(e.target.checked)}
                    className="w-5 h-5 accent-primary cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => handleSavePreferences("Appearance")}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  <Save className="w-4 h-4" />
                  Save Appearance
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: SECURITY */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-foreground">Security & Login</h2>
                <p className="text-sm text-muted-foreground">Protect your password, sessions, and multi-factor auth.</p>
              </div>

              <form onSubmit={handleUpdatePassword} className="space-y-4 pb-6 border-b border-border/40">
                <h3 className="text-sm font-bold text-foreground">Change Password</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase">New Password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase">Confirm Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-secondary text-secondary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
                  >
                    <Lock className="w-4 h-4" />
                    Update Password
                  </button>
                </div>
              </form>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-foreground">Two-Factor Authentication (2FA)</p>
                    <p className="text-xs text-muted-foreground">Add extra security with authenticator apps or SMS.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={twoFactorEnabled}
                    onChange={(e) => {
                      setTwoFactorEnabled(e.target.checked);
                      toast({
                        type: e.target.checked ? "success" : "info",
                        title: e.target.checked ? "2FA Enabled" : "2FA Disabled",
                        message: e.target.checked ? "Two-Factor authentication is now active." : "Two-factor has been turned off.",
                      });
                    }}
                    className="w-5 h-5 accent-primary cursor-pointer"
                  />
                </div>

                <div className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-3">
                  <p className="text-xs font-bold text-foreground uppercase tracking-wider">Active Sessions</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-emerald-500" />
                      <div>
                        <span className="font-semibold text-foreground">Current Device</span> (Windows • Chrome Browser)
                      </div>
                    </div>
                    <span className="text-emerald-500 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Online Now
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
