#!/bin/bash

# Image Optimization Script for Fast Track Digital
# Converts PNG images to WebP format for better compression

echo "🚀 Starting image optimization..."

# Create backup directory
mkdir -p images_backup
echo "📁 Creating backup of original images..."
cp -r images/* images_backup/ 2>/dev/null || echo "ℹ️  No images to backup"

# Check if cwebp is installed
if ! command -v cwebp &> /dev/null; then
    echo "⚠️  cwebp not found. Installing..."
    
    # Try to install based on system
    if command -v apt-get &> /dev/null; then
        sudo apt-get update && sudo apt-get install -y webp
    elif command -v yum &> /dev/null; then
        sudo yum install -y libwebp-tools
    elif command -v brew &> /dev/null; then
        brew install webp
    else
        echo "❌ Cannot install webp tools automatically. Please install cwebp manually."
        exit 1
    fi
fi

# Optimize images
cd images || exit 1

echo "🔄 Converting PNG images to WebP..."

for img in *.png; do
    if [ -f "$img" ]; then
        echo "  Converting: $img"
        
        # Convert to WebP with quality 85 (good balance of quality/size)
        cwebp -q 85 "$img" -o "${img%.png}.webp"
        
        # Get file sizes for comparison
        original_size=$(du -h "$img" | cut -f1)
        webp_size=$(du -h "${img%.png}.webp" | cut -f1)
        
        echo "    Original: $original_size → WebP: $webp_size"
    fi
done

echo ""
echo "📊 Optimization Summary:"
echo "========================"

total_original=0
total_webp=0

for img in *.png; do
    if [ -f "$img" ] && [ -f "${img%.png}.webp" ]; then
        orig_bytes=$(stat -f%z "$img" 2>/dev/null || stat -c%s "$img" 2>/dev/null)
        webp_bytes=$(stat -f%z "${img%.png}.webp" 2>/dev/null || stat -c%s "${img%.png}.webp" 2>/dev/null)
        
        total_original=$((total_original + orig_bytes))
        total_webp=$((total_webp + webp_bytes))
    fi
done

echo "Total original size: $(numfmt --to=iec $total_original 2>/dev/null || echo "${total_original} bytes")"
echo "Total WebP size: $(numfmt --to=iec $total_webp 2>/dev/null || echo "${total_webp} bytes")"

if [ $total_original -gt 0 ]; then
    savings_percent=$(( (total_original - total_webp) * 100 / total_original ))
    echo "Space saved: ${savings_percent}%"
fi

echo ""
echo "✅ Image optimization complete!"
echo ""
echo "📝 Next steps:"
echo "1. Update HTML files to use .webp extensions"
echo "2. Add fallback support for browsers that don't support WebP"
echo "3. Test the website to ensure images load correctly"
echo ""
echo "💡 To revert changes, restore from images_backup/ directory"