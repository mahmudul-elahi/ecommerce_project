<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Image;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageService
{
    /**
     * Optimize an uploaded image using Laravel 13 Image facade and store in public disk.
     * Converts to WebP with optimal compression for fast loading and low bandwidth.
     */
    public static function optimizeAndStore(UploadedFile|string $file, string $directory = 'products'): string
    {
        try {
            if (is_string($file)) {
                // If it's a data URI or base64 image
                if (str_starts_with($file, 'data:image/')) {
                    $base64Data = substr($file, strpos($file, ',') + 1);
                    $img = Image::fromBase64($base64Data);
                } elseif (str_starts_with($file, 'http://') || str_starts_with($file, 'https://')) {
                    return $file;
                } elseif (str_starts_with($file, '/')) {
                    // Check if local file exists to optimize, or return path
                    $fullPath = public_path(ltrim($file, '/'));
                    if (file_exists($fullPath) && !str_ends_with($file, '.svg')) {
                        $img = Image::fromPath($fullPath);
                    } else {
                        return $file;
                    }
                } elseif (file_exists($file)) {
                    $img = Image::fromPath($file);
                } else {
                    return $file;
                }
            } else {
                $img = Image::fromUpload($file);
            }

            // Optimize using Laravel 13 Image optimize() method to webp
            $filename = Str::uuid() . '.webp';
            $storedRelativePath = $img->optimize('webp', 82)->storePubliclyAs($directory, $filename, 'public');

            return Storage::disk('public')->url($storedRelativePath);
        } catch (\Throwable $e) {
            // Fallback in case of invalid image or format error
            if (is_string($file)) {
                return $file;
            }
            // For file upload fallback to standard store
            $filename = Str::uuid() . '.' . ($file->getClientOriginalExtension() ?: 'png');
            $path = $file->storeAs($directory, $filename, 'public');
            return Storage::disk('public')->url($path);
        }
    }

    /**
     * Process multiple uploaded images or URLs and return optimized URLs.
     */
    public static function processMultiple(array $files, string $directory = 'products'): array
    {
        $urls = [];
        foreach ($files as $file) {
            if ($file instanceof UploadedFile || (is_string($file) && !empty(trim($file)))) {
                $urls[] = self::optimizeAndStore($file, $directory);
            }
        }
        return array_values(array_filter($urls));
    }
}
