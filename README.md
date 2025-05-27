# RanFresh Chrome Extension

A Chrome extension that automatically refreshes web pages at random intervals within a user-defined range.

## Features

- Set minimum and maximum refresh intervals in seconds
- Random refresh timing between your specified range
- Supports multiple tabs with different refresh settings
- Modern implementation using Chrome's Manifest V3

## Installation

### Loading the unpacked extension (for development)

1. Clone or download this repository to your local machine
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" by toggling the switch in the top right corner
4. Click "Load unpacked" and select the directory containing the extension files
5. The RanFresh extension should now appear in your extensions list

### Creating a packed extension (for distribution)

1. After testing, you can create a packed extension by clicking "Pack extension" on the `chrome://extensions/` page
2. Select the directory containing your extension files
3. Chrome will generate a `.crx` file and a `.pem` private key file (keep this secure for future updates)

## Usage

1. Navigate to any webpage you want to automatically refresh
2. Click the RanFresh extension icon in your browser toolbar
3. Set the minimum and maximum refresh interval in seconds
   - Example: Min = 5, Max = 15 will refresh the page randomly between 5 and 15 seconds
4. Click "Start" to begin automatic refreshing
5. The extension popup will show a countdown timer to the next refresh
6. Click "Stop" to end automatic refreshing for the current tab

## Technical Details

This extension uses:
- Manifest V3 architecture
- Service worker for background processing
- Chrome Storage Sync API for persistent settings
- Modern JavaScript with async/await pattern

## Troubleshooting

If the extension doesn't work as expected:

1. Make sure the extension is enabled in Chrome
2. Check the extension permissions (it needs access to tabs and storage)
3. Try reloading the extension from the `chrome://extensions/` page
4. For developers: Check the browser console for error messages

## Development

To modify this extension:

1. Edit the files as needed
2. Reload the extension from `chrome://extensions/` (click the refresh icon)
3. Test your changes

## License

See the LICENSE file for details.

![image](https://user-images.githubusercontent.com/67287458/159159891-672df665-7b64-43b5-819b-87b05e5f6a71.png)

![image](https://user-images.githubusercontent.com/67287458/159159932-6edc7f9b-8578-402c-b4b2-5d0c8518dc9c.png)

