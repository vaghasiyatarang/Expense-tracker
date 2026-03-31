"use client";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { useCallback, useState } from "react";

interface ExportPDFButtonProps {
  targetId: string;
  fileName?: string;
  label?: string;
}

export default function ExportPDFButton({
  targetId,
  fileName = "export.pdf",
  label = "Export as PDF",
}: ExportPDFButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const element = document.getElementById(targetId);
      if (!element) {
        console.error("Target element not found:", targetId);
        return;
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const padding = 8;
      const pdfWidth = pdf.internal.pageSize.getWidth() - 2 * padding;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", padding, padding, pdfWidth, pdfHeight);
      pdf.save(fileName);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  //   const handleExport = useCallback(async () => {
  //     setLoading(true);
  //     const element = document.getElementById(targetId);
  //     if (!element) {
  //       console.error(`Element with ID "${targetId}" not found.`);
  //       return;
  //     }

  //     // Dynamically import html2pdf to avoid SSR issues
  //     const html2pdf = (await import("html2pdf.js")).default;

  //     const opt = {
  //       margin: 0.5,
  //       filename: fileName,
  //       image: { type: "jpeg", quality: 0.98 },
  //       html2canvas: {
  //         scale: 2,
  //         useCORS: true,
  //         backgroundColor: "#fff",
  //       },
  //       jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
  //     };

  //     try {
  //       html2pdf().set(opt).from(element).save();
  //     } catch (error) {
  //       console.error("PDF generation failed:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }, [targetId, fileName]);

  return (
    <button
      onClick={handleExport}
      className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded"
      disabled={loading}
    >
      {loading ? "Generating..." : label}
    </button>
  );
}
