#!/bin/bash

# Create icons directory if it doesn't exist
mkdir -p public

# Download streaming service icons
curl -o public/netflix-icon.png "https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/227_Netflix_logo-512.png"
curl -o public/hulu-icon.png "https://cdn4.iconfinder.com/data/icons/logos-brands-7/512/hulu-512.png"
curl -o public/max-icon.png "https://upload.wikimedia.org/wikipedia/commons/1/17/Max_logo.png"
curl -o public/prime-icon.png "https://cdn4.iconfinder.com/data/icons/logos-brands-7/512/amazon_prime-512.png"
curl -o public/disney-icon.png "https://cdn4.iconfinder.com/data/icons/logos-brands-7/512/disney_plus-512.png"
curl -o public/apple-tv-icon.png "https://cdn4.iconfinder.com/data/icons/logos-brands-7/512/apple_tv-512.png"

# Make icons smaller (64x64)
for icon in public/*-icon.png; do
  convert "$icon" -resize 64x64 "$icon"
done

echo "Icons downloaded and resized successfully!"
