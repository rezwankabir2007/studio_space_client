"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, ChevronDown, CloudUpload, Image as ImageIcon,
  LayoutGrid, MapPin, PlusCircle, ShieldCheck,
  SquarePlus, User, X, Blocks, FileText,
} from "lucide-react";
import Image from "next/image";

const CATEGORIES = [
  "Photo Studio", "Sound Stage", "Podcast Room",
  "Music Suite", "Art Workshop",
];

const AMENITIES = [
  "Lighting", "Sound System", "Air Conditioning", "Props",
  "WiFi", "Kitchen", "Parking", "Restroom",
];

const MAX_DESC = 1000;

type ImageItem = {
  id: string;
  file: File;
  url: string;
};

const inputClass =
  "w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

const Label = ({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) => (
  <label className="mb-1.5 block text-sm font-medium text-slate-700">
    {children}
    {required && <span className="ml-0.5 text-red-500">*</span>}
  </label>
);

const SectionTitle = ({
  icon,
  title,
  required,
  hint,
}: {
  icon: React.ReactNode;
  title: string;
  required?: boolean;
  hint?: string;
}) => (
  <div className="mb-4">
    <div className="flex items-center gap-2.5">
      <span className="text-blue-600">{icon}</span>
      <h2 className="text-base font-semibold text-slate-900">
        {title}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </h2>
    </div>
    {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
  </div>
);

// ফাইলকে Base64 এ কনভার্ট করার হেল্পার ফাংশন
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const AddStudio = () => {
  const fileRef = useRef<HTMLInputElement>(null);
  const urlsRef = useRef<string[]>([]);

  const [form, setForm] = useState({
    title: "",
    category: "",
    hourlyRate: "",
    deposit: "",
    capacity: "",
    location: "",
    description: "",
    hostName: "",
    hostEmail: "",
  });

  const [amenities, setAmenities] = useState<string[]>(["WiFi"]);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState({
    success: "",
    error: "",
  });

  useEffect(() => {
    return () => {
      urlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      urlsRef.current = [];
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const toggleAmenity = (name: string) => {
    setAmenities((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  const addFiles = (files: FileList | File[] | null) => {
    if (!files || !files.length) return;

    if (images.length >= 1) {
      setMessage({
        success: "",
        error: "Please remove the current image before adding another.",
      });
      return;
    }

    const selected = Array.from(files);

    if (selected.length > 1) {
      setMessage({
        success: "",
        error: "Only one image is allowed.",
      });
      return;
    }

    const file = selected[0];

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setMessage({
        success: "",
        error: "Only JPG, PNG and WEBP images are allowed.",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({
        success: "",
        error: "Image size must be under 5MB.",
      });
      return;
    }

    const url = URL.createObjectURL(file);
    urlsRef.current.push(url);

    setImages([
      {
        id: `${file.name}-${file.lastModified}-${Date.now()}`,
        file,
        url,
      },
    ]);

    setMessage({ success: "", error: "" });
  };

  const removeImage = (id: string) => {
    const image = images.find((item) => item.id === id);
    if (!image) return;

    URL.revokeObjectURL(image.url);

    urlsRef.current = urlsRef.current.filter(
      (url) => url !== image.url
    );

    setImages([]);
    if (fileRef.current) fileRef.current.value = "";
  };

  const resetForm = () => {
    setForm({
      title: "",
      category: "",
      hourlyRate: "",
      deposit: "",
      capacity: "",
      location: "",
      description: "",
      hostName: "",
      hostEmail: "",
    });

    images.forEach((image) => {
      URL.revokeObjectURL(image.url);
    });

    urlsRef.current = [];
    setImages([]);
    setAmenities(["WiFi"]);

    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setMessage({ success: "", error: "" });

    if (!images.length) {
      setMessage({
        success: "",
        error: "Please upload one studio image.",
      });
      return;
    }

    if (loading) return;

    setLoading(true);

    try {
      // ফাইলটি সরাসরি Base64 স্ট্রিং বানিয়ে নেওয়া
      const base64String = await fileToBase64(images[0].file);

      // JSON বডি পেলোড
      const bodyData = {
        ...form,
        amenities,
        images: [
          {
            filename: images[0].file.name,
            url: base64String,
          },
        ],
      };

      const res = await fetch("http://localhost:8000/add_studio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add studio.");
      }

      resetForm();

      setMessage({
        success: data.message || "Studio added successfully!",
        error: "",
      });
    } catch (err) {
      setMessage({
        success: "",
        error:
          err instanceof Error
            ? err.message
            : "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6">
      <Link
        href="/"
        className="mb-4 inline-flex items-center gap-2 rounded-md border border-blue-600 bg-white px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back Home Page
      </Link>

      <div className="mb-5 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
          <SquarePlus className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Add New Studio
          </h1>
          <p className="text-sm text-slate-500">
            List your creative space and let other creators discover it.
          </p>
        </div>
      </div>

      {message.success && (
        <p className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
          {message.success}
        </p>
      )}

      {message.error && (
        <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {message.error}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid gap-5 lg:grid-cols-[1.35fr_1.15fr_0.9fr]"
      >
        {/* Column 1 */}
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <SectionTitle
            icon={<LayoutGrid className="h-5 w-5" />}
            title="Basic Details"
          />

          <div className="space-y-4">
            <div>
              <Label required>Studio Title</Label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                maxLength={100}
                placeholder="e.g. Modern Photography Studio"
                className={inputClass}
              />
            </div>

            <div>
              <Label required>Category</Label>
              <div className="relative">
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className={`${inputClass} appearance-none pr-9`}
                >
                  <option value="" disabled>Select category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label required>Hourly Rate ($)</Label>
                <input
                  type="number"
                  min={0}
                  name="hourlyRate"
                  value={form.hourlyRate}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 35"
                  className={inputClass}
                />
              </div>

              <div>
                <Label required>Security Deposit ($)</Label>
                <input
                  type="number"
                  min={0}
                  name="deposit"
                  value={form.deposit}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 100"
                  className={inputClass}
                />
              </div>

              <div>
                <Label required>Max Capacity</Label>
                <input
                  type="number"
                  min={1}
                  name="capacity"
                  value={form.capacity}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 10"
                  className={inputClass}
                />
              </div>

              <div>
                <Label required>Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Dhaka, Bangladesh"
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Single Image Upload */}
          <div className="mt-6">
            <SectionTitle
              icon={<ImageIcon className="h-5 w-5" />}
              title="Studio Image"
              required
              hint="Upload one high-quality image (JPG, PNG or WEBP, max 5MB)."
            />

            {!images.length && (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  addFiles(e.dataTransfer.files);
                }}
                onClick={() => fileRef.current?.click()}
                className="flex h-36 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-blue-400 bg-blue-50/60 text-center transition hover:bg-blue-50"
              >
                <CloudUpload className="mb-2 h-9 w-9 text-blue-600" />
                <p className="text-sm font-medium text-slate-700">
                  Drag &amp; drop image here
                </p>
                <p className="text-xs text-blue-600">
                  or click to browse
                </p>
              </div>
            )}

            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              hidden
              onChange={(e) => {
                addFiles(e.target.files);
                e.target.value = "";
              }}
            />



            {images.map((img) => (
              <div key={img.id} className="relative mt-2 h-36 w-full overflow-hidden rounded-lg border border-slate-200">
                <Image
                  src={img.url}
                  alt="Studio preview"
                  fill
                  className="object-cover"
                />

                <button
                  type="button"
                  onClick={() => removeImage(img.id)}
                  aria-label="Remove image"
                  className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/80 text-white hover:bg-red-600 transition"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            <p className="mt-2 text-right text-xs text-slate-500">
              {images.length}/1 image
            </p>
          </div>
        </section>

        {/* Column 2 */}
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <SectionTitle
            icon={<Blocks className="h-5 w-5" />}
            title="Amenities"
            hint="Select all that apply"
          />

          <div className="grid grid-cols-2 gap-3">
            {AMENITIES.map((name) => {
              const checked = amenities.includes(name);

              return (
                <label
                  key={name}
                  className={`flex cursor-pointer items-center gap-3 rounded-md border px-3 py-3 text-sm transition ${checked
                      ? "border-blue-300 bg-blue-50/50"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleAmenity(name)}
                    className="h-4 w-4 accent-blue-600"
                  />
                  <span className="text-slate-700">{name}</span>
                </label>
              );
            })}
          </div>

          <div className="mt-8">
            <SectionTitle
              icon={<FileText className="h-5 w-5" />}
              title="Description"
              required
              hint="Tell creators about your space, equipment, and what makes it special."
            />

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              maxLength={MAX_DESC}
              rows={6}
              placeholder="e.g. Spacious studio with professional lighting equipment..."
              className={`${inputClass} resize-y`}
            />

            <p className="mt-2 text-right text-xs text-slate-500">
              {form.description.length}/{MAX_DESC}
            </p>
          </div>
        </section>

        {/* Column 3 */}
        <section className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <SectionTitle
            icon={<User className="h-5 w-5" />}
            title="Host Information"
            hint="Your contact details will be visible to creators."
          />

          <div className="space-y-4">
            <div>
              <Label required>Host Name</Label>
              <input
                name="hostName"
                value={form.hostName}
                onChange={handleChange}
                required
                placeholder="e.g. John Doe"
                className={inputClass}
              />
            </div>

            <div>
              <Label required>Host Email</Label>
              <input
                type="email"
                name="hostEmail"
                value={form.hostEmail}
                onChange={handleChange}
                required
                placeholder="e.g. john@example.com"
                className={inputClass}
              />
            </div>

            <div className="flex items-start gap-3 rounded-lg bg-blue-50 p-4 text-xs text-slate-600">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
              <p>
                Your information will be verified for a trusted marketplace.
              </p>
            </div>
          </div>

          <div className="mt-auto flex gap-3 border-t border-slate-200 pt-5 lg:mt-48">
            <button
              type="button"
              onClick={() => {
                resetForm();
                setMessage({ success: "", error: "" });
              }}
              disabled={loading}
              className="flex-1 rounded-md border border-blue-600 bg-white px-4 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex flex-[1.6] items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? (
                "Adding..."
              ) : (
                <>
                  <PlusCircle className="h-4 w-4" />
                  Add Studio
                </>
              )}
            </button>
          </div>
        </section>
      </form>
    </div>
  );
};

export default AddStudio;