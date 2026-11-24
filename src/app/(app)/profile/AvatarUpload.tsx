"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";

import styles from "./avatar-upload.module.css";

type AvatarUploadProps = {
  image: string | null;
  name: string;
};

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function AvatarUpload({ image, name }: AvatarUploadProps) {
  const router = useRouter();

  const wrapperRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // Close the menu when clicking outside or pressing Escape.
  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];

    event.target.value = "";

    if (!selectedFile) return;

    setErrorMessage("");
    setStatusMessage("");

    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setPreview(null);
      setErrorMessage(
        "Unsupported file format. Please choose JPEG, PNG, or WebP.",
      );
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setPreview(null);
      setErrorMessage("The image is too large. Maximum allowed size is 2 MB.");
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    void handleUpload(selectedFile);
  }

  async function handleUpload(selectedFile: File) {
    setIsPending(true);
    setErrorMessage("");
    setStatusMessage("Uploading picture...");

    try {
      const signatureResponse = await fetch("/api/profile/avatar/signature", {
        method: "POST",
      });

      const signatureData = await signatureResponse.json();

      if (!signatureResponse.ok) {
        throw new Error(signatureData.message || "Unable to authorize upload.");
      }

      const formData = new FormData();

      formData.append("file", selectedFile);
      formData.append("api_key", signatureData.apiKey);
      formData.append("timestamp", String(signatureData.timestamp));
      formData.append("folder", signatureData.folder);
      formData.append("public_id", signatureData.publicId);
      formData.append("overwrite", "true");
      formData.append("signature", signatureData.signature);

      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const cloudinaryData = await cloudinaryResponse.json();

      if (!cloudinaryResponse.ok) {
        throw new Error(
          cloudinaryData.error?.message || "Image upload failed.",
        );
      }

      const saveResponse = await fetch("/api/profile/avatar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          publicId: cloudinaryData.public_id,
        }),
      });

      const saveData = await saveResponse.json();

      if (!saveResponse.ok) {
        throw new Error(
          saveData.message || "Unable to save your profile picture.",
        );
      }

      setPreview(null);
      setStatusMessage("Profile picture updated successfully.");
      router.refresh();
    } catch (error) {
      setStatusMessage("");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsPending(false);
    }
  }

  async function handleRemoveAvatar() {
    const confirmed = window.confirm(
      "Are you sure you want to remove your profile picture?",
    );

    if (!confirmed) return;

    setIsPending(true);
    setErrorMessage("");
    setStatusMessage("Removing picture...");
    setIsMenuOpen(false);

    try {
      const response = await fetch("/api/profile/avatar", {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to remove your profile picture.",
        );
      }

      setPreview(null);
      setStatusMessage("Profile picture removed.");
      router.refresh();
    } catch (error) {
      setStatusMessage("");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsPending(false);
    }
  }

  function handleChooseAvatar() {
    setIsMenuOpen(false);
    fileInputRef.current?.click();
  }

  const displayedImage = preview || image;

  return (
    <div className={styles.container} ref={wrapperRef}>
      <div className={styles.avatarWrapper}>
        <div
          className={styles.avatar}
          role="img"
          aria-label={`${name}'s profile picture`}
          style={
            displayedImage
              ? { backgroundImage: `url("${displayedImage}")` }
              : undefined
          }
        >
          {!displayedImage && <span>{name.charAt(0).toUpperCase()}</span>}
        </div>

        <button
          type="button"
          className={styles.editButton}
          aria-label="Edit profile picture"
          aria-expanded={isMenuOpen}
          aria-haspopup="menu"
          onClick={() => setIsMenuOpen((open) => !open)}
          disabled={isPending}
        >
          <span aria-hidden="true">✎</span>
        </button>

        {isMenuOpen && (
          <div className={styles.menu} role="menu">
            <button type="button" role="menuitem" onClick={handleChooseAvatar}>
              Upload new avatar
            </button>

            {image && (
              <button
                type="button"
                role="menuitem"
                className={styles.removeOption}
                onClick={handleRemoveAvatar}
              >
                Remove current avatar
              </button>
            )}

            <button
              type="button"
              role="menuitem"
              onClick={() => setIsMenuOpen(false)}
            >
              Cancel
            </button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          disabled={isPending}
          className={styles.fileInput}
          tabIndex={-1}
          aria-label="Choose a profile picture"
        />
      </div>

      <div className={styles.messages} aria-live="polite">
        {isPending && <p className={styles.uploading}>{statusMessage}</p>}

        {!isPending && statusMessage && (
          <p className={styles.success}>{statusMessage}</p>
        )}

        {errorMessage && (
          <p className={styles.error} role="alert">
            {errorMessage}
          </p>
        )}

        <p className={styles.hint}>JPEG, PNG or WebP. Maximum size: 2 MB.</p>
      </div>
    </div>
  );
}
