"use client";

import { useState } from "react";
import { Upload, FileSpreadsheet, FileText, CheckCircle, XCircle } from "lucide-react";

interface SeedResponse {
  success: boolean;
  message: string;
  summary: {
    totalRows: number;
    successfullyImported: number;
    errors: number;
    totalUsersInDatabase: number;
  };
  errors?: Array<{
    row: number;
    data: any;
    error: string;
  }>;
  moreErrors?: number;
}

export default function SeedUsersForm() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SeedResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const fileName = selectedFile.name.toLowerCase();
      if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls') || fileName.endsWith('.csv')) {
        setFile(selectedFile);
        setError(null);
        setResult(null);
      } else {
        setError('Please select an Excel (.xlsx, .xls) or CSV (.csv) file');
        setFile(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Admin token not found. Please login as admin.');
      }

      const response = await fetch('/api/admin/seed-users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data: SeedResponse = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.message || 'Upload failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Seed Users from File</h2>
        <p className="text-gray-600">
          Upload an Excel (.xlsx) or CSV (.csv) file to import users into the database.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select File
          </label>
          <div className="relative">
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          {file && (
            <div className="mt-2 flex items-center text-sm text-green-600">
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              {file.name} ({(file.size / 1024).toFixed(1)} KB)
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex">
              <XCircle className="w-5 h-5 text-red-400 mr-2" />
              <div className="text-sm text-red-700">{error}</div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!file || loading}
          className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload and Seed Users
            </>
          )}
        </button>
      </form>

      {/* Results Display */}
      {result && (
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Import Results</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{result.summary.successfullyImported}</div>
              <div className="text-sm text-gray-600">Successfully Imported</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{result.summary.errors}</div>
              <div className="text-sm text-gray-600">Errors</div>
            </div>
          </div>

          <div className="text-sm text-gray-600 mb-3">
            <div>Total rows processed: {result.summary.totalRows}</div>
            <div>Total users in database: {result.summary.totalUsersInDatabase}</div>
          </div>

          {result.errors && result.errors.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-gray-900 mb-2">Error Details:</h4>
              <div className="max-h-40 overflow-y-auto">
                {result.errors.map((error, index) => (
                  <div key={index} className="text-sm text-red-600 mb-1">
                    Row {error.row}: {error.error}
                  </div>
                ))}
                {result.moreErrors && (
                  <div className="text-sm text-gray-500">
                    ... and {result.moreErrors} more errors
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-md">
        <h4 className="font-medium text-blue-900 mb-2">File Format Requirements:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Required columns: email, firstName, lastName, country</li>
          <li>• Column names are case-insensitive</li>
          <li>• RHa column maps to region field</li>
          <li>• Duplicate emails will be skipped</li>
          <li>• Other fields will be set to empty strings</li>
        </ul>
      </div>
    </div>
  );
}
