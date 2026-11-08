<?php

namespace App\Traits;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

trait HandlesFileUploads
{
    /**
     * Upload a file or accept an existing URL / string.
     */
    protected function handleFileUpload($file, string $directory = 'uploads'): ?string
    {
        if (!$file) {
            return null;
        }

        if ($file instanceof UploadedFile) {
            return $file->store($directory, 'public');
        }

        // Check if it's base64 data url
        if (is_string($file) && str_starts_with($file, 'data:image')) {
            @list($type, $data) = explode(';', $file);
            @list(, $data)      = explode(',', $data);
            if ($data) {
                $decoded = base64_decode($data);
                $extension = 'png';
                if (str_contains($type, 'jpeg') || str_contains($type, 'jpg')) {
                    $extension = 'jpg';
                } elseif (str_contains($type, 'webp')) {
                    $extension = 'webp';
                } elseif (str_contains($type, 'gif')) {
                    $extension = 'gif';
                }
                $filename = $directory . '/' . Str::random(32) . '.' . $extension;
                Storage::disk('public')->put($filename, $decoded);
                return $filename;
            }
        }

        // If it's already a URL or relative path string
        if (is_string($file)) {
            return $file;
        }

        return null;
    }
}
