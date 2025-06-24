import { useState, useEffect, useCallback, useRef } from "react";
import { useBulkImport } from "@/Context/BulkImportContext";
import { toast } from "sonner";

export const useBulkImportDialog = ({ isOpen, setIsOpen, refreshCars }) => {
  const {
    jobId,
    preview,
    total,
    status,
    errors,
    loading,
    error,
    uploadExcel,
    confirmImport,
    getImportStatus,
    downloadTemplate,
    cancelImport,
    resetImport,
  } = useBulkImport();

  const [importStep, setImportStep] = useState("upload");
  const [importProgress, setImportProgress] = useState(0);
  const pollingRef = useRef(null);

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      resetImport();
      setImportStep("upload");
      setImportProgress(0);
    }
  }, [isOpen]);

  // Show error toasts
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Handle status changes with polling
  useEffect(() => {
    if (status === "processing" && !pollingRef.current) {
      setImportStep("importing");
      setImportProgress(50);

      // Initial status check to catch already completed jobs
      getImportStatus(jobId).then((res) => {
        if (res.success && (res.status === "completed" || res.status === "completed_with_errors")) {
          setImportStep("complete");
          setImportProgress(100);
          refreshCars();
          if (res.errors.length > 0) {
            toast.warning(`Import completed with ${res.errors.length} errors`);
          } else {
            toast.success("Import completed successfully!");
          }
          return;
        }
      }).catch((err) => {
        console.error("Initial status check error:", err);
        toast.error("Failed to check import status");
      });

      pollingRef.current = setInterval(async () => {
        try {
          const res = await getImportStatus(jobId);
          console.log("Polling status:", res); // Debug log
          if (res.success && (res.status === "completed" || res.status === "completed_with_errors")) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
            setImportStep("complete");
            setImportProgress(100);
            refreshCars();
            if (res.errors.length > 0) {
              toast.warning(`Import completed with ${res.errors.length} errors`);
            } else {
              toast.success("Import completed successfully!");
            }
          }
        } catch (err) {
          console.error("Polling error:", err);
          toast.error("Error checking import status");
        }
      }, 2000);
    } else if (status === "pending") {
      setImportStep("preview");
    } else if (status === "completed" || status === "completed_with_errors") {
      // Handle case where status is already completed
      setImportStep("complete");
      setImportProgress(100);
      refreshCars();
      if (errors.length > 0) {
        toast.warning(`Import completed with ${errors.length} errors`);
      } else {
        toast.success("Import completed successfully!");
      }
    }

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [status, jobId, getImportStatus, errors]);

  // Handle file upload
  const handleFileUpload = useCallback(async (e) => {
    const file = e.target.files[0];
    if (file) {
      const res = await uploadExcel(file);
      if (res.success) {
        setImportStep("preview");
      }
    }
  }, [uploadExcel]);

  // Handle bulk import confirmation
  const handleBulkImport = useCallback(async () => {
    const res = await confirmImport(jobId);
    if (res.success) {
      setImportStep("importing");
      setImportProgress(50);
    }
  }, [confirmImport, jobId]);

  // Handle dialog open/close
  const handleOpenChange = useCallback(
    (open) => {
      if (!open && (importStep === "upload" || importStep === "preview") && jobId) {
        cancelImport(jobId);
      }
      setIsOpen(open);
    },
    [setIsOpen, importStep, jobId, cancelImport],
  );

  // Handle cancel/close
  const handleCancel = useCallback(() => {
    handleOpenChange(false);
  }, [handleOpenChange]);

  // Calculate valid count
  const validCount = preview.filter((item) => !errors.some((err) => err.data === item)).length;

  return {
    importStep,
    importProgress,
    loading,
    preview,
    errors,
    validCount,
    handleFileUpload,
    handleBulkImport,
    handleCancel,
    handleOpenChange,
    downloadTemplate,
  };
};