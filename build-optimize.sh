#!/bin/bash

# Build and Optimization Script for Fast Track Digital
# Minifies HTML, CSS, and JavaScript files

echo "🚀 Starting build optimization process..."

# Create dist directory for optimized files
mkdir -p dist
mkdir -p dist/images

echo "📁 Setting up build directory..."

# Function to install dependencies
install_deps() {
    echo "📦 Installing optimization tools..."
    
    # Install Node.js tools if not present
    if ! command -v npm &> /dev/null; then
        echo "⚠️  npm not found. Please install Node.js first."
        return 1
    fi
    
    # Install minification tools
    npm install -g html-minifier-terser csso-cli terser 2>/dev/null || {
        echo "⚠️  Could not install global tools. Installing locally..."
        npm init -y
        npm install html-minifier-terser csso-cli terser
    }
}

# Function to minify CSS
minify_css() {
    echo "🎨 Minifying CSS..."
    
    if command -v csso &> /dev/null; then
        csso styles.css --output dist/styles.min.css
        echo "  ✅ CSS minified: styles.css → dist/styles.min.css"
    else
        echo "  ⚠️  csso not found, copying CSS without minification"
        cp styles.css dist/styles.min.css
    fi
    
    # Calculate compression
    if [ -f "styles.css" ] && [ -f "dist/styles.min.css" ]; then
        orig_size=$(du -h styles.css | cut -f1)
        min_size=$(du -h dist/styles.min.css | cut -f1)
        echo "    Original: $orig_size → Minified: $min_size"
    fi
}

# Function to minify JavaScript
minify_js() {
    echo "⚡ Minifying JavaScript..."
    
    if command -v terser &> /dev/null; then
        terser products.js --compress --mangle --output dist/products.min.js
        echo "  ✅ JS minified: products.js → dist/products.min.js"
    else
        echo "  ⚠️  terser not found, copying JS without minification"
        cp products.js dist/products.min.js
    fi
    
    # Calculate compression
    if [ -f "products.js" ] && [ -f "dist/products.min.js" ]; then
        orig_size=$(du -h products.js | cut -f1)
        min_size=$(du -h dist/products.min.js | cut -f1)
        echo "    Original: $orig_size → Minified: $min_size"
    fi
}

# Function to minify HTML
minify_html() {
    echo "📄 Minifying HTML..."
    
    # Update references to minified files in HTML
    for html_file in *.html; do
        if [ -f "$html_file" ]; then
            echo "  Processing: $html_file"
            
            # Create temporary file with updated references
            sed 's/styles\.css/styles.min.css/g; s/products\.js/products.min.js/g' "$html_file" > "temp_$html_file"
            
            if command -v html-minifier-terser &> /dev/null; then
                html-minifier-terser \
                    --collapse-whitespace \
                    --remove-comments \
                    --remove-redundant-attributes \
                    --remove-script-type-attributes \
                    --remove-style-link-type-attributes \
                    --minify-css true \
                    --minify-js true \
                    --use-short-doctype \
                    "temp_$html_file" > "dist/$html_file"
                
                echo "    ✅ HTML minified: $html_file → dist/$html_file"
            else
                echo "    ⚠️  html-minifier not found, copying HTML with updated references"
                cp "temp_$html_file" "dist/$html_file"
            fi
            
            # Calculate compression
            if [ -f "$html_file" ] && [ -f "dist/$html_file" ]; then
                orig_size=$(du -h "$html_file" | cut -f1)
                min_size=$(du -h "dist/$html_file" | cut -f1)
                echo "      Original: $orig_size → Minified: $min_size"
            fi
            
            # Clean up temp file
            rm "temp_$html_file"
        fi
    done
}

# Function to optimize images
optimize_images_build() {
    echo "🖼️  Copying and optimizing images..."
    
    # Copy all images to dist
    if [ -d "images" ]; then
        cp -r images/* dist/images/
        echo "  ✅ Images copied to dist/images/"
        
        # If WebP images exist, prioritize them
        webp_count=$(find images -name "*.webp" 2>/dev/null | wc -l)
        if [ "$webp_count" -gt 0 ]; then
            echo "  📊 Found $webp_count WebP images (optimized)"
        else
            echo "  💡 Consider running ./optimize-images.sh to create WebP versions"
        fi
    fi
}

# Function to generate performance report
generate_report() {
    echo ""
    echo "📊 Build Optimization Report"
    echo "============================"
    
    # Calculate total sizes
    original_size=0
    minified_size=0
    
    for file in *.html *.css *.js; do
        if [ -f "$file" ] && [ -f "dist/${file%.js}.min.js" -o -f "dist/${file%.css}.min.css" -o -f "dist/$file" ]; then
            orig_bytes=$(stat -c%s "$file" 2>/dev/null || stat -f%z "$file" 2>/dev/null)
            
            # Determine minified file name
            if [[ "$file" == *.js ]]; then
                min_file="dist/${file%.js}.min.js"
            elif [[ "$file" == *.css ]]; then
                min_file="dist/${file%.css}.min.css"
            else
                min_file="dist/$file"
            fi
            
            if [ -f "$min_file" ]; then
                min_bytes=$(stat -c%s "$min_file" 2>/dev/null || stat -f%z "$min_file" 2>/dev/null)
                original_size=$((original_size + orig_bytes))
                minified_size=$((minified_size + min_bytes))
            fi
        fi
    done
    
    echo "Total original size: $(numfmt --to=iec $original_size 2>/dev/null || echo "${original_size} bytes")"
    echo "Total minified size: $(numfmt --to=iec $minified_size 2>/dev/null || echo "${minified_size} bytes")"
    
    if [ $original_size -gt 0 ]; then
        savings_percent=$(( (original_size - minified_size) * 100 / original_size ))
        echo "Space saved: ${savings_percent}%"
    fi
    
    echo ""
    echo "📁 Build output location: ./dist/"
    echo ""
    echo "🚀 Performance improvements:"
    echo "  • External CSS file (reduces HTML size)"
    echo "  • Minified code (smaller file sizes)"
    echo "  • Optimized resource loading (async/defer)"
    echo "  • Fixed missing JavaScript file"
    echo ""
    echo "💡 Next steps:"
    echo "  1. Test the site using files in ./dist/ directory"
    echo "  2. Consider running ./optimize-images.sh for image optimization"
    echo "  3. Set up Gzip compression on your web server"
    echo "  4. Implement caching headers"
}

# Main execution
main() {
    install_deps || echo "⚠️  Some tools may not be available"
    
    minify_css
    minify_js
    minify_html
    optimize_images_build
    generate_report
    
    echo "✅ Build optimization complete!"
}

# Run main function
main