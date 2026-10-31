"use client";

import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  ChevronDown, CloudUpload, Image as ImageIcon, 
  LayoutGrid, MapPin, User, X, Blocks, FileText, Edit3, Sparkles 
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

type StudioForm = {
  title: string;
  category: string;
  hourlyRate: string;
  deposit: string;
  capacity: string;
  location: string;
  description: string;
  hostName: string;
  hostEmail: string;
};

type StudioRecord = StudioForm & {
  _id?: string;
  amenities?: string[];
  images?: { url: string; filename?: string }[];
};

type EditStudioDialogProps = {
  exploreData: StudioRecord;
  onSuccess?: () => void;
};

type ImageItem = {
  id: string;
  file?: File;
  url: string;
};

const inputClass =
  "w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

const Label = ({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) => (
  <label className="mb-1 block text-xs font-medium text-slate-700">
    {children}
    {required && <span className="ml-0.5 text-red-500">*</span>}
  </label>
);

const SectionTitle = ({
  icon,
  title,
  required,
}: {
  icon: React.ReactNode;
  title: string;
  required?: boolean;
}) => (
  <div className="flex items-center gap-2 mb-2 text-slate-900 font-semibold text-sm">
    <span className="text-blue-600">{icon}</span>
    <span>{title}</span>
    {required && <span className="text-red-500">*</span>}
  </div>
);

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const EditStudioDialog = ({ exploreData, onSuccess }: EditStudioDialogProps) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const urlsRef = useRef<string[]>([]);

  // Dialog open howar sathe sathe ba exploreData asle data load korar jonno helper function
  const getStudioForm = (studio: StudioRecord) => ({
    title: studio?.title || "",
    category: studio?.category || "",
    hourlyRate: studio?.hourlyRate?.toString() || "",
    deposit: studio?.deposit?.toString() || "",
    capacity: studio?.capacity?.toString() || "",
    location: studio?.location || "",
    description: studio?.description || "",
    hostName: studio?.hostName || "",
    hostEmail: studio?.hostEmail || "",
  });

  const [form, setForm] = useState<StudioForm>(() => getStudioForm(exploreData));
  const [amenities, setAmenities] = useState<string[]>(exploreData?.amenities || ["WiFi"]);
  const [images, setImages] = useState<ImageItem[]>(
    exploreData?.images?.[0]?.url ? [{ id: "existing-1", url: exploreData.images[0].url }] : []
  );
  
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
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

    const selected = Array.from(files);
    const file = selected[0];

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setMessage({ success: "", error: "Only JPG, PNG and WEBP allowed." });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ success: "", error: "Image size must be under 5MB." });
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

    if (image.file) {
      URL.revokeObjectURL(image.url);
      urlsRef.current = urlsRef.current.filter((url) => url !== image.url);
    }
    setImages([]);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage({ success: "", error: "" });

    if (loading) return;
    setLoading(true);

    try {
      let imagePayload: { filename?: string; url: string }[] = [];

      if (images.length > 0) {
        if (images[0].file) {
          const base64String = await fileToBase64(images[0].file);
          imagePayload = [{ filename: images[0].file.name, url: base64String }];
        } else {
          imagePayload = [{ url: images[0].url }];
        }
      }

      const bodyData = {
        ...form,
        amenities,
        images: imagePayload,
      };

      const res = await fetch(`http://localhost:8000/exploreStudios/${exploreData?._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update studio.");

      setMessage({ success: "Studio updated successfully!", error: "" });
      
      if (onSuccess) onSuccess();

      setTimeout(() => {
        setIsOpen(false);
      }, 1000);
    } catch (err) {
      setMessage({
        success: "",
        error: err instanceof Error ? err.message : "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-blue-500/50 hover:bg-blue-50/50 hover:text-blue-600 hover:shadow-md active:scale-95"
      >
        <Edit3 size={14} className="transition-transform group-hover:rotate-12" />
        <span>Edit Studio</span>
      </button>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px] rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl">
        <DialogHeader className="space-y-1 text-left">
          <div className="flex items-center gap-2 text-blue-600">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
              <Sparkles size={16} />
            </span>
            <DialogTitle className="text-lg font-bold text-slate-900">
              Edit Studio Information
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-slate-500">
            Update your studio details below. Changes will be reflected instantly on your live listing.
          </DialogDescription>
        </DialogHeader>

        {message.success && (
          <p className="mt-2 rounded-lg bg-green-50 p-2 text-xs text-green-700">
            {message.success}
          </p>
        )}

        {message.error && (
          <p className="mt-2 rounded-lg bg-red-50 p-2 text-xs text-red-600">
            {message.error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-5">
          <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50">
            <SectionTitle icon={<LayoutGrid className="h-4 w-4" />} title="Basic Details" required />
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
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
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50">
            <SectionTitle icon={<ImageIcon className="h-4 w-4" />} title="Studio Image" required />
            {!images.length && (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  addFiles(e.dataTransfer.files);
                }}
                onClick={() => fileRef.current?.click()}
                className="flex h-28 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-blue-400 bg-blue-50/60 text-center transition hover:bg-blue-50"
              >
                <CloudUpload className="mb-1.5 h-6 w-6 text-blue-600" />
                <p className="text-xs font-medium text-slate-700">Drag &amp; drop image here or browse</p>
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
              <div key={img.id} className="relative mt-2 h-36 w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                <Image 
                  src={img.url} 
                  alt="Studio preview" 
                  fill
                  className="object-cover" 
                />
                <button
                  type="button"
                  onClick={() => removeImage(img.id)}
                  className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/80 text-white hover:bg-red-600 transition"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50">
            <SectionTitle icon={<Blocks className="h-4 w-4" />} title="Amenities" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {AMENITIES.map((name) => {
                const checked = amenities.includes(name);
                return (
                  <label
                    key={name}
                    className={`flex cursor-pointer items-center gap-2 rounded-md border px-2.5 py-2 text-xs transition ${
                      checked ? "border-blue-300 bg-blue-50/50 font-medium text-blue-900" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleAmenity(name)}
                      className="h-3.5 w-3.5 accent-blue-600"
                    />
                    <span className="truncate">{name}</span>
                  </label>
                );
              })}
            </div>

            <div className="mt-4">
              <SectionTitle icon={<FileText className="h-4 w-4" />} title="Description" required />
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                maxLength={MAX_DESC}
                rows={3}
                placeholder="Tell creators about your space..."
                className={`${inputClass} resize-y`}
              />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50">
            <SectionTitle icon={<User className="h-4 w-4" />} title="Host Information" required />
            <div className="grid gap-3 sm:grid-cols-2">
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
                  placeholder="john@example.com"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              disabled={loading}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95 disabled:opacity-60"
            >
              {loading ? "Saving Changes..." : "Save Changes"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditStudioDialog;