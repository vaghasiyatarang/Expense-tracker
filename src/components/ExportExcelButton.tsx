"use client";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface Props {
  data: any[];
  fileName: string;
  label?: string;
}

export default function ExportExcelButton({ data, fileName, label = "Export as Excel" }: Props) {
  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(blob, fileName.endsWith(".xlsx") ? fileName : `${fileName}.xlsx`);
  };

  return (
    <button
      onClick={handleExport}
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
    >
      {label}
    </button>
  );
}
