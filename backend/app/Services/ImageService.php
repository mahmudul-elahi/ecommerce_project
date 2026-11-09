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
     * Prevents GD memory exhaustion on high-resolution photographs.
     */
    public static function optimizeAndStore(UploadedFile|string $file, string $directory = 'products'): string
    {
        // Proactively ensure adequate memory for image operations
        if (function_exists('ini_set')) {
            @ini_set('memory_limit', '512M');
        }

        try {
            if (is_string($file)) {
                // If it's a data URI or base64 image
                if (str_starts_with($file, 'data:image/')) {
                    @[$type, $data] = explode(';', $file);
                    @[, $data] = explode(',', $data);
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
                        $filename = $directory . '/' . Str::uuid() . '.' . $extension;
                        Storage::disk('public')->put($filename, $decoded);

                        return Storage::disk('public')->url($filename);
                    }
                } elseif (str_starts_with($file, 'http://') || str_starts_with($file, 'https://')) {
                    return $file;
                } elseif (str_starts_with($file, '/')) {
                    // Check if local file exists to optimize, or return path
                    $fullPath = public_path(ltrim($file, '/'));
                    if (file_exists($fullPath) && !str_ends_with($file, '.svg')) {
                        // Check image size before attempting GD decode
                        $info = @getimagesize($fullPath);
                        if ($info && ($info[0] * $info[1] > 20000000)) { // > 20 Megapixels
                            return $file; // too large for GD to safely decode in memory, return path
                        }
                        $img = Image::fromPath($fullPath);
                    } else {
                        return $file;
                    }
                } elseif (file_exists($file)) {
                    $info = @getimagesize($file);
                    if ($info && ($info[0] * $info[1] > 20000000)) {
                        return $file;
                    }
                    $img = Image::fromPath($file);
                } else {
                    return $file;
                }
            } else {
                // If it's an UploadedFile
                // Check dimensions first to avoid GD memory crashes on massive images
                $realPath = $file->getRealPath();
                $info = $realPath ? @getimagesize($realPath) : null;

                // If larger than 20 Megapixels (e.g. 6000x3500), stream-store directly without GD decoding
                if ($info && ($info[0] * $info[1] > 20000000)) {
                    $filename = Str::uuid() . '.' . ($file->getClientOriginalExtension() ?: 'jpg');
                    $path = $file->storeAs($directory, $filename, 'public');
                    return Storage::disk('public')->url($path);
                }

                $img = Image::fromUpload($file);
            }

            // Optimize using Laravel 13 Image optimize() method to webp
            $filename = Str::uuid() . '.webp';
            $storedRelativePath = $img->optimize('webp', 82)->storePubliclyAs($directory, $filename, 'public');

            return Storage::disk('public')->url($storedRelativePath);
        } catch (\Throwable $e) {
            // Graceful fallback: never crash the request if image processing fails
            if (is_string($file)) {
                return $file;
            }
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
        if (function_exists('ini_set')) {
            @ini_set('memory_limit', '512M');
        }

        $urls = [];
        foreach ($files as $file) {
            if ($file instanceof UploadedFile || (is_string($file) && !empty(trim($file)))) {
                $urls[] = self::optimizeAndStore($file, $directory);
            }
        }
        return array_values(array_filter($urls));
    }
}
