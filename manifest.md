```json
{
  "manifest_version": 3,
  "name": "MakerONE",
  "version": "1.0.3",
  "description": "MakerONE 创造我热爱的世界",
  "permissions": ["management", "<all_urls>"],
  "background": {
    "service_worker": "./bg.js"
  },

  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'"
  },
  "icons": {
    "16": "./avatar.png",
    "48": "./avatar.png",
    "128": "./avatar.png"
  },
  "action": {
    "default_icon": {
      "16": "./avatar.png",
      "24": "./avatar.png",
      "32": "./avatar.png"
    },
    "default_title": "MakerOne",
    "default_popup": "./index.html"
  },

  "content_scripts": [
    {
      "matches": ["*://*/*"],
      "js": ["./set.js"],
      "run_at": "document_start",
      "all_frames": true
    }
  ],
  "externally_connectable": {
    "matches": ["http://192.168.32.169:4000/"]
  }
}
```
