import * as React from 'react';
import { cn } from '../utils';
import { UploadCloud } from 'lucide-react';

export interface FileUploadProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
	label?: string;
	error?: string;
	helperText?: string;
	accept?: string;
	multiple?: boolean;
	onFilesSelected?: (files: FileList | null) => void;
	containerClassName?: string;
}

/**
 * FileUpload - A file input with drag-and-drop support
 * Fully accessible with ARIA attributes and keyboard activation
 */
export const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(
	(
		{
			className,
			label,
			error,
			helperText,
			accept,
			multiple,
			onFilesSelected,
			containerClassName,
			id,
			...props
		},
		ref
	) => {
		const inputId = id || React.useId();
		const errorId = `${inputId}-error`;
		const helperId = `${inputId}-helper`;
		const [isDragging, setIsDragging] = React.useState(false);
		const [fileNames, setFileNames] = React.useState<string[]>([]);

		const handleFiles = (files: FileList | null) => {
			setFileNames(files ? Array.from(files).map((file) => file.name) : []);
			onFilesSelected?.(files);
		};

		const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			setIsDragging(false);
			handleFiles(e.dataTransfer.files);
		};

		const handleDragOver = (e: React.DragEvent) => {
			e.preventDefault();
			setIsDragging(true);
		};

		const handleDragLeave = (e: React.DragEvent) => {
			e.preventDefault();
			setIsDragging(false);
		};

		return (
			<div className={cn('w-full', containerClassName)}>
				{label && (
					<label
						htmlFor={inputId}
						className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
					>
						{label}
					</label>
				)}
				<div
					role="button"
					tabIndex={0}
					aria-label={label}
					onClick={() => document.getElementById(inputId)?.click()}
					onKeyDown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							e.preventDefault();
							document.getElementById(inputId)?.click();
						}
					}}
					onDrop={handleDrop}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					className={cn(
						'flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-gray-300 px-6 py-8 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:border-gray-700',
						isDragging && 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950',
						error && 'border-red-500 focus-visible:ring-red-500',
						className
					)}
				>
					<UploadCloud className="h-8 w-8 text-gray-400" />
					<p className="text-sm text-gray-600 dark:text-gray-400">
						Drag and drop files here, or click to browse
					</p>
					{fileNames.length > 0 && (
						<p className="text-sm text-gray-900 dark:text-gray-100">
							{fileNames.join(', ')}
						</p>
					)}
				</div>
				<input
					ref={ref}
					id={inputId}
					type="file"
					accept={accept}
					multiple={multiple}
					className="sr-only"
					onChange={(e) => handleFiles(e.target.files)}
					aria-invalid={error ? 'true' : undefined}
					aria-describedby={error ? errorId : helperText ? helperId : undefined}
					{...props}
				/>
				{error && (
					<p id={errorId} className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
						{error}
					</p>
				)}
				{helperText && !error && (
					<p id={helperId} className="mt-1 text-sm text-gray-500 dark:text-gray-400">
						{helperText}
					</p>
				)}
			</div>
		);
	}
);

FileUpload.displayName = 'FileUpload';
