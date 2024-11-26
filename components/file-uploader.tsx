"use client";

import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Upload } from 'lucide-react';
import { useToast } from './ui/use-toast';

interface FileUploaderProps {
  onUpload: (files: File[]) => void;
}

export function FileUploader({ onUpload }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    validateAndUpload(files);
  };

  const validateAndUpload = (files: File[]) => {
    const validTypes = ['application/json', 'text/plain', 'application/msword', 
                       'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    const validFiles = files.filter(file => validTypes.includes(file.type));
    
    if (validFiles.length > 0) {
      onUpload(validFiles);
      toast({
        title: 'Files uploaded',
        description: `${validFiles.length} file(s) successfully uploaded.`,
      });
    } else {
      toast({
        title: 'Invalid file type',
        description: 'Please upload JSON, TXT, or DOC files.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div
      className={`relative ${isDragging ? 'opacity-50' : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        multiple
        accept=".json,.txt,.doc,.docx"
        onChange={(e) => validateAndUpload(Array.from(e.target.files || []))}
      />
      <Button
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        className="w-full md:w-auto"
      >
        <Upload className="w-4 h-4 mr-2" />
        Upload Files
      </Button>
    </div>
  );
}