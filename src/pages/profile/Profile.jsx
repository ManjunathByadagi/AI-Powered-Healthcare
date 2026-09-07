import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Globe,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  X,
  Search,
  Check,
  Lock,
  PhoneCall,
  Edit3,
  KeyRound,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import toast from "react-hot-toast";

const AVAILABLE_LANGUAGES = [
  { name: "English", code: "en", localName: "English" },
  { name: "Hindi", code: "hi", localName: "हिंदी" },
  { name: "Marathi", code: "mr", localName: "मराठी" },
  { name: "Tamil", code: "ta", localName: "தமிழ்" },
  { name: "Telugu", code: "te", localName: "తెలుగు" },
  { name: "Kannada", code: "kn", localName: "ಕನ್ನಡ" },
  { name: "Bengali", code: "bn", localName: "বাংলা" },
  { name: "Gujarati", code: "gu", localName: "ગુજરાતી" },
  { name: "Malayalam", code: "ml", localName: "മലയാളം" },
  { name: "Punjabi", code: "pa", localName: "ਪੰਜਾਬੀ" },
];

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const { language, setLanguage } = useLanguage();

  const [activeModal, setActiveModal] = useState(null);
  const [langSearch, setLangSearch] = useState("");
  const [currentLang, setCurrentLang] = useState("English");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const [profileForm, setProfileForm] = useState({
    name:
      user?.name ||
      user?.full_name ||
      user?.username ||
      "Sayotrik",
    email: user?.email || "sayotrik2005@gmail.com",
    phone: user?.phone_number || "+91 98765 43210",
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        name:
          user.name ||
          user.full_name ||
          user.username ||
          "Sayotrik",
        email: user.email || "sayotrik2005@gmail.com",
        phone:
          user.phone_number ||
          user.phone ||
          "+91 98765 43210",
      });
    }
  }, [user]);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const userName =
    user?.name ||
    user?.full_name ||
    user?.username ||
    profileForm.name;

  const userEmail = user?.email || profileForm.email;

  const initials =
    userName
      ?.split(" ")
      .map((word) => word[0])
      .filter(Boolean)
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleLanguageSelect = (langName) => {
    setCurrentLang(langName);

    const matched = AVAILABLE_LANGUAGES.find(
      (item) => item.name === langName
    );

    if (matched && setLanguage) {
      setLanguage({
        label: matched.name,
        code: matched.code,
      });
    }

    toast.success(`Preferred Language set to ${langName}`);
    setActiveModal(null);
  };

  const handleToggleNotifications = (checked) => {
    setNotificationsEnabled(checked);

    toast.success(
      checked
        ? "Notifications enabled"
        : "Notifications muted"
    );
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    await updateUser({
      name: profileForm.name,
      full_name: profileForm.name,
      username: profileForm.name,
      email: profileForm.email,
      phone: profileForm.phone,
      phone_number: profileForm.phone,
    });

    toast.success("Profile details saved permanently!");
    setActiveModal(null);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();

    if (
      passwordForm.newPassword !==
      passwordForm.confirmPassword
    ) {
      toast.error("New passwords do not match!");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters!");
      return;
    }

    toast.success("Password updated successfully!");

    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setActiveModal(null);
  };

  const filteredLanguages = AVAILABLE_LANGUAGES.filter(
    (item) =>
      item.name
        .toLowerCase()
        .includes(langSearch.toLowerCase()) ||
      item.localName
        .toLowerCase()
        .includes(langSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8f7f3] text-slate-800 pb-20">

      {/* ============================================================
          PROFILE HERO
      ============================================================ */}

      <section className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-teal-50">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 lg:px-8">
          <div className="max-w-2xl">

            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
              RuralCare AI • Account Management
            </p>

            <h1 className="mt-2 font-serif text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              User Profile
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
              Manage your account, preferences, security settings,
              and language preferences.
            </p>

          </div>
        </div>
      </section>

      {/* ============================================================
          MAIN CONTENT
      ============================================================ */}

      <main className="mx-auto max-w-5xl px-5 py-8 sm:px-6 lg:px-8">

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">

          {/* ========================================================
              LEFT COLUMN
          ======================================================== */}

          <div className="space-y-6">

            {/* PROFILE CARD */}

            <Card className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-white px-6 py-5">

                <div className="flex items-center gap-2">
                  <User
                    size={18}
                    className="text-emerald-700"
                  />

                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                    Account Information
                  </p>
                </div>

              </div>

              <div className="p-6">

                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex items-center gap-4">

                    <Avatar className="h-20 w-20 border-4 border-emerald-50 ring-2 ring-emerald-200">

                      <AvatarFallback className="bg-emerald-600 text-xl font-bold text-white">
                        {initials}
                      </AvatarFallback>

                    </Avatar>

                    <div>

                      <h2 className="text-xl font-bold capitalize text-slate-900">
                        {userName}
                      </h2>

                      <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                        <Mail
                          size={14}
                          className="text-emerald-600"
                        />
                        <span className="break-all">
                          {userEmail}
                        </span>
                      </div>

                      <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span>{profileForm.phone}</span>
                      </div>

                    </div>

                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setProfileForm({
                        name: userName,
                        email: userEmail,
                        phone:
                          user?.phone ||
                          user?.phone_number ||
                          profileForm.phone ||
                          "+91 98765 43210",
                      });

                      setActiveModal("editProfile");
                    }}
                    className="border-slate-200 bg-white text-slate-700 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    <Edit3 size={14} className="mr-2" />
                    Edit Profile
                  </Button>

                </div>

              </div>

            </Card>

            {/* PREFERENCES */}

            <Card className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="mb-5">

                <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Preferences
                </p>

                <h2 className="mt-1 text-lg font-bold text-slate-900">
                  Personal preferences
                </h2>

              </div>

              <div className="space-y-1">

                {/* LANGUAGE */}

                <button
                  type="button"
                  onClick={() =>
                    setActiveModal("language")
                  }
                  className="group flex w-full items-center justify-between rounded-xl p-3 text-left transition hover:bg-emerald-50"
                >

                  <div className="flex items-center gap-4">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                      <Globe size={20} />
                    </div>

                    <div>

                      <p className="font-semibold text-slate-900">
                        Preferred Language
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {currentLang} · Click to change
                      </p>

                    </div>

                  </div>

                  <ChevronRight
                    size={18}
                    className="text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-emerald-600"
                  />

                </button>

                <Separator className="my-2 bg-slate-100" />

                {/* NOTIFICATIONS */}

                <div className="flex items-center justify-between rounded-xl p-3">

                  <div className="flex items-center gap-4">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                      <Bell size={20} />
                    </div>

                    <div>

                      <p className="font-semibold text-slate-900">
                        Notifications
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {notificationsEnabled
                          ? "Receive medicine reminders & updates"
                          : "Notifications disabled"}
                      </p>

                    </div>

                  </div>

                  <Switch
                    checked={notificationsEnabled}
                    onCheckedChange={
                      handleToggleNotifications
                    }
                  />

                </div>

              </div>

            </Card>

          </div>

          {/* ========================================================
              RIGHT COLUMN
          ======================================================== */}

          <div className="space-y-6">

            {/* SETTINGS */}

            <Card className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="mb-5">

                <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Settings & Account Controls
                </p>

                <h2 className="mt-1 text-lg font-bold text-slate-900">
                  Security and support
                </h2>

              </div>

              <div className="space-y-2">

                {/* SECURITY */}

                <button
                  type="button"
                  onClick={() =>
                    setActiveModal("security")
                  }
                  className="group flex w-full items-center justify-between rounded-xl p-3 text-left transition hover:bg-emerald-50"
                >

                  <div className="flex items-center gap-4">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                      <Shield size={20} />
                    </div>

                    <div>

                      <p className="font-semibold text-slate-900">
                        Privacy & Security
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Change password & security settings
                      </p>

                    </div>

                  </div>

                  <ChevronRight
                    size={18}
                    className="text-slate-400 group-hover:text-emerald-600"
                  />

                </button>

                {/* HELP */}

                <button
                  type="button"
                  onClick={() =>
                    setActiveModal("help")
                  }
                  className="group flex w-full items-center justify-between rounded-xl p-3 text-left transition hover:bg-emerald-50"
                >

                  <div className="flex items-center gap-4">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                      <HelpCircle size={20} />
                    </div>

                    <div>

                      <p className="font-semibold text-slate-900">
                        Help & Support
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        FAQs, helpline numbers & contact
                      </p>

                    </div>

                  </div>

                  <ChevronRight
                    size={18}
                    className="text-slate-400 group-hover:text-emerald-600"
                  />

                </button>

              </div>

            </Card>

            {/* SECURITY INFORMATION */}

            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">

              <div className="flex items-start gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
                  <Lock size={18} />
                </div>

                <div>

                  <h3 className="font-semibold text-slate-900">
                    Your information stays private
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    RuralCare AI is designed to help you organize
                    healthcare information and communicate more
                    easily with healthcare professionals.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* ==========================================================
            LOGOUT
        ========================================================== */}

        <div className="mt-8">

          <Button
            variant="destructive"
            className="h-12 w-full rounded-xl bg-red-600 font-semibold text-white shadow-sm transition hover:bg-red-700"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out of Account
          </Button>

        </div>

        <p className="mt-6 text-center text-xs leading-5 text-slate-400">
          RuralCare AI Communication Assistant
          <br />
          Encrypted & Secure • Version 1.0.0
        </p>

      </main>

      {/* ============================================================
          LANGUAGE MODAL
      ============================================================ */}

      {activeModal === "language" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">

          <div className="flex max-h-[85vh] w-full max-w-md flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-100 pb-4">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <Globe size={20} />
                </div>

                <h3 className="font-bold text-lg text-slate-900">
                  Select Preferred Language
                </h3>

              </div>

              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>

            </div>

            <div className="relative my-4">

              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />

              <input
                type="text"
                placeholder="Search language..."
                value={langSearch}
                onChange={(e) =>
                  setLangSearch(e.target.value)
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-9 pr-4 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />

            </div>

            <div className="flex-1 space-y-2 overflow-y-auto pr-1">

              {filteredLanguages.map((lang) => {

                const isSelected =
                  currentLang === lang.name;

                return (
                  <button
                    type="button"
                    key={lang.code}
                    onClick={() =>
                      handleLanguageSelect(lang.name)
                    }
                    className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition ${
                      isSelected
                        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                        : "border-slate-200 bg-white text-slate-700 hover:border-emerald-200 hover:bg-emerald-50"
                    }`}
                  >

                    <div>

                      <span className="font-semibold text-sm">
                        {lang.name}
                      </span>

                      <span className="ml-2 text-xs text-slate-400">
                        ({lang.localName})
                      </span>

                    </div>

                    {isSelected && (
                      <Check
                        size={17}
                        className="text-emerald-600"
                      />
                    )}

                  </button>
                );
              })}

            </div>

          </div>

        </div>
      )}

      {/* ============================================================
          SECURITY MODAL
      ============================================================ */}

      {activeModal === "security" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">

          <div className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">

            <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <Shield size={20} />
                </div>

                <h3 className="font-bold text-lg text-slate-900">
                  Privacy & Account Security
                </h3>

              </div>

              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>

            </div>

            <form
              onSubmit={handleChangePassword}
              className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4"
            >

              <h4 className="flex items-center gap-2 text-sm font-bold text-emerald-700">
                <KeyRound size={15} />
                Change Password
              </h4>

              <div>

                <label className="mb-1.5 block text-xs font-medium text-slate-600">
                  Current Password
                </label>

                <input
                  type="password"
                  required
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      currentPassword: e.target.value,
                    })
                  }
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />

              </div>

              <div>

                <label className="mb-1.5 block text-xs font-medium text-slate-600">
                  New Password
                </label>

                <input
                  type="password"
                  required
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPassword: e.target.value,
                    })
                  }
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />

              </div>

              <div>

                <label className="mb-1.5 block text-xs font-medium text-slate-600">
                  Confirm New Password
                </label>

                <input
                  type="password"
                  required
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />

              </div>

              <Button
                type="submit"
                className="w-full bg-emerald-600 font-semibold text-white hover:bg-emerald-700"
              >
                Update Password
              </Button>

            </form>

            <div className="mt-4 flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4">

              <Lock
                size={17}
                className="mt-0.5 shrink-0 text-emerald-700"
              />

              <div>

                <p className="font-semibold text-slate-900">
                  Privacy & Security
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-600">
                  Keep your account credentials private and
                  use a strong password for your account.
                </p>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* ============================================================
          HELP MODAL
      ============================================================ */}

      {activeModal === "help" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">

          <div className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">

            <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <HelpCircle size={20} />
                </div>

                <h3 className="font-bold text-lg text-slate-900">
                  Help & Emergency Support
                </h3>

              </div>

              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>

            </div>

            {/* EMERGENCY */}

            <div className="mb-5">

              <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-emerald-700">
                Emergency Helplines
              </h4>

              <div className="grid grid-cols-2 gap-3">

                <a
                  href="tel:108"
                  className="flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 p-3 transition hover:bg-red-100"
                >

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-red-600 shadow-sm">
                    <PhoneCall size={18} />
                  </div>

                  <div>
                    <p className="font-bold text-slate-900">
                      108
                    </p>

                    <p className="text-xs text-slate-500">
                      Ambulance
                    </p>
                  </div>

                </a>

                <a
                  href="tel:104"
                  className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-3 transition hover:bg-emerald-100"
                >

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-emerald-700 shadow-sm">
                    <PhoneCall size={18} />
                  </div>

                  <div>
                    <p className="font-bold text-slate-900">
                      104
                    </p>

                    <p className="text-xs text-slate-500">
                      Health Advice
                    </p>
                  </div>

                </a>

              </div>

            </div>

            {/* FAQ */}

            <div>

              <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-emerald-700">
                Frequently Asked Questions
              </h4>

              <div className="space-y-3">

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                  <p className="font-semibold text-slate-900">
                    Q: How does the AI Assistant work?
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    It helps provide plain-language healthcare
                    information through the assistant experience.
                  </p>

                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                  <p className="font-semibold text-slate-900">
                    Q: Is my medical upload private?
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Uploaded prescriptions and medical records
                    are managed through your private application
                    history.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* ============================================================
          EDIT PROFILE MODAL
      ============================================================ */}

      {activeModal === "editProfile" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">

            <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <Edit3 size={20} />
                </div>

                <h3 className="font-bold text-lg text-slate-900">
                  Edit Profile Details
                </h3>

              </div>

              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>

            </div>

            <form
              onSubmit={handleSaveProfile}
              className="space-y-4"
            >

              <div>

                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Full Name
                </label>

                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      name: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />

              </div>

              <div>

                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Email Address
                </label>

                <input
                  type="email"
                  required
                  value={profileForm.email}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      email: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />

              </div>

              <div>

                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Phone Number
                </label>

                <input
                  type="text"
                  required
                  value={profileForm.phone}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      phone: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />

              </div>

              <div className="flex items-center gap-3 pt-2">

                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setActiveModal(null)
                  }
                  className="w-1/2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  className="w-1/2 bg-emerald-600 font-semibold text-white hover:bg-emerald-700"
                >
                  Save Changes
                </Button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}