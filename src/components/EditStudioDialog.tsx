"use client";

import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

// Studio data type
type StudioRecord = {
  _id: string;
  title?: string;
  category?: string;
  hourlyRate?: string | number;
  deposit?: string | number;
  capacity?: string | number;
  location?: string;
  description?: string;
  hostName?: string;
  hostEmail?: string;
  amenities?: string[];
  images?: { url: string; filename?: string }[];
};

type Props = {
  exploreData: StudioRecord;
  onSuccess: () => void;
};

// Reusable field wrapper (label + input + optional hint)
function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0 space-y-1.5">
      <label className="block text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

// Section heading
function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </h3>
  );
}

export default function EditStudioDialog({
  exploreData,
  onSuccess,
}: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    hourlyRate: "",
    deposit: "",
    capacity: "",
    location: "",
    description: "",
    hostName: "",
    hostEmail: "",
    amenities: "",
    images: "",
  });

  // Dialog open korar somoy existing data form-e bosbe
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setFormData({
        title: exploreData.title ?? "",
        category: exploreData.category ?? "",
        hourlyRate: String(exploreData.hourlyRate ?? ""),
        deposit: String(exploreData.deposit ?? ""),
        capacity: String(exploreData.capacity ?? ""),
        location: exploreData.location ?? "",
        description: exploreData.description ?? "",
        hostName: exploreData.hostName ?? "",
        hostEmail: exploreData.hostEmail ?? "",
        amenities: (exploreData.amenities ?? []).join(", "),
        images: (exploreData.images ?? [])
          .map((image) => image.url)
          .join("\n"),
      });
    }

    setOpen(isOpen);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateStudio = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);

      const updatedData = {
        title: formData.title,
        category: formData.category,
        hourlyRate: formData.hourlyRate,
        deposit: formData.deposit,
        capacity: formData.capacity,
        location: formData.location,
        description: formData.description,
        hostName: formData.hostName,
        hostEmail: formData.hostEmail,

        amenities: formData.amenities
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        images: formData.images
          .split("\n")
          .map((url) => url.trim())
          .filter(Boolean)
          .map((url) => {
            const oldImage = exploreData.images?.find(
              (image) => image.url === url
            );

            return {
              url,
              ...(oldImage?.filename
                ? { filename: oldImage.filename }
                : {}),
            };
          }),
      };

      // 1. Client side theke token ana hocche
      const token = await getTokenFromClient();

      // 2. Fetch request-e Authorization header add kora holo
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/exploreStudios/${exploreData._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Update failed!");
      }

      // Backend-er response jodi result object hoy
      if (data.result?.matchedCount === 0) {
        throw new Error("Studio not found!");
      }

      toast.success("Studio updated successfully!");

      setOpen(false);

      // Details page abar fetch hobe
      onSuccess();
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error ? error.message : "Something went wrong!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button variant="outline">Edit Studio</Button>} />

      <DialogContent className="flex max-h-[90vh] w-full flex-col gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-2xl">
        {/* Header */}
        <DialogHeader className="space-y-1 border-b bg-muted/30 px-6 py-5 pr-14 text-left">
          <DialogTitle className="text-xl font-semibold">
            Edit Studio
          </DialogTitle>
          <DialogDescription>
            Update your studio information.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleUpdateStudio}
          className="flex min-h-0 flex-1 flex-col"
        >
          {/* Scrollable body */}
          <div className="min-h-0 flex-1 space-y-7 overflow-y-auto overflow-x-hidden px-6 py-6">
            {/* Basic info */}
            <section className="space-y-4">
              <SectionTitle>Basic Information</SectionTitle>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Studio Title">
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full"
                    required
                  />
                </Field>

                <Field label="Category">
                  <Input
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full"
                    required
                  />
                </Field>

                <div className="sm:col-span-2">
                  <Field label="Location">
                    <Input
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full"
                      required
                    />
                  </Field>
                </div>
              </div>
            </section>

            {/* Pricing */}
            <section className="space-y-4">
              <SectionTitle>Pricing & Capacity</SectionTitle>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field label="Hourly Rate">
                  <Input
                    name="hourlyRate"
                    type="number"
                    value={formData.hourlyRate}
                    onChange={handleChange}
                    className="w-full"
                    required
                  />
                </Field>

                <Field label="Deposit">
                  <Input
                    name="deposit"
                    type="number"
                    value={formData.deposit}
                    onChange={handleChange}
                    className="w-full"
                    required
                  />
                </Field>

                <Field label="Capacity">
                  <Input
                    name="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={handleChange}
                    className="w-full"
                    required
                  />
                </Field>
              </div>
            </section>

            {/* Host */}
            <section className="space-y-4">
              <SectionTitle>Host Details</SectionTitle>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Host Name">
                  <Input
                    name="hostName"
                    value={formData.hostName}
                    onChange={handleChange}
                    className="w-full"
                  />
                </Field>

                <Field label="Host Email">
                  <Input
                    name="hostEmail"
                    type="email"
                    value={formData.hostEmail}
                    onChange={handleChange}
                    className="w-full"
                  />
                </Field>
              </div>
            </section>

            {/* Details */}
            <section className="space-y-4">
              <SectionTitle>More Details</SectionTitle>

              <Field label="Description">
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full min-w-0 resize-none"
                />
              </Field>

              <Field
                label="Amenities"
                hint="Amenities comma diye alada koro."
              >
                <Textarea
                  name="amenities"
                  value={formData.amenities}
                  onChange={handleChange}
                  rows={2}
                  className="w-full min-w-0 resize-none"
                  placeholder="WiFi, AC, Parking"
                />
              </Field>

              <Field label="Image URLs" hint="Protiti URL alada line-e dao.">
                <Textarea
                  name="images"
                  value={formData.images}
                  onChange={handleChange}
                  rows={4}
                  className="w-full min-w-0 resize-none break-all"
                  placeholder="Protiti image URL alada line-e dao"
                />
              </Field>
            </section>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t bg-muted/30 px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={loading} className="min-w-32">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}