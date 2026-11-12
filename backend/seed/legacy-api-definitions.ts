import type { CategoryDefinition, EndpointDefinition } from '../core/registry-types'

export const legacyCategoryDefinitions: CategoryDefinition[] = [
  {
    "slug": "maker",
    "name": "Image & Media Makers",
    "description": "Generate images, memes, and creative media.",
    "icon": "image",
    "sortOrder": 8
  },
  {
    "slug": "tools",
    "name": "Developer Tools",
    "description": "Utilities for text, images, translation, and data.",
    "icon": "ai",
    "sortOrder": 9
  },
  {
    "slug": "news",
    "name": "News",
    "description": "Latest news feeds from Indonesian publishers.",
    "icon": "information",
    "sortOrder": 10
  },
  {
    "slug": "primbon",
    "name": "Primbon",
    "description": "Traditional name, dream, and numerology utilities.",
    "icon": "information",
    "sortOrder": 11
  },
  {
    "slug": "random",
    "name": "Random Media",
    "description": "Random image and media endpoints.",
    "icon": "image",
    "sortOrder": 12
  },
  {
    "slug": "stalker",
    "name": "Profile Lookup",
    "description": "Public profile information lookup utilities.",
    "icon": "search",
    "sortOrder": 13
  },
  {
    "slug": "anime",
    "name": "Anime",
    "description": "Anime feeds, schedules, and genre browsing.",
    "icon": "image",
    "sortOrder": 14
  }
]

export const legacyEndpointDefinitions: EndpointDefinition[] = [
  {
    "slug": "search-applemusic",
    "publicPath": "/api/v1/search/applemusic",
    "method": "GET",
    "categorySlug": "search",
    "kind": "provider",
    "paramSchemaId": "legacy-query-search-applemusic",
    "cacheTtlSeconds": 300,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 30
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "Apple Music Search",
      "summary": "Search Apple Music for tracks, albums, and artists by keyword.",
      "description": "Search Apple Music for tracks, albums, and artists by keyword. Provider responses are normalized into the Kyyinfinite response envelope; provider details are never exposed.",
      "params": [
        {
          "name": "q",
          "type": "string",
          "required": true,
          "description": "Search keyword",
          "location": "query",
          "example": "Laufey"
        }
      ],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "success",
        "code": 200,
        "message": "Request completed successfully",
        "data": {
          "result": "Provider response data"
        }
      },
      "responseSchema": [
        {
          "name": "data.result",
          "type": "object | array | string",
          "description": "Normalized response from the service."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-nexray",
      "baseUrl": "https://api.nexray.eu.cc",
      "providerPath": "/search/applemusic",
      "paramsMap": {
        "q": "q"
      }
    },
    "normalizerId": "legacy-default-v1"
  },
  {
    "slug": "search-spotify",
    "publicPath": "/api/v1/search/spotify",
    "method": "GET",
    "categorySlug": "search",
    "kind": "provider",
    "paramSchemaId": "legacy-query-search-spotify",
    "cacheTtlSeconds": 300,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 30
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "Spotify Search",
      "summary": "Search Spotify for tracks, albums, and artists by keyword.",
      "description": "Search Spotify for tracks, albums, and artists by keyword. Provider responses are normalized into the Kyyinfinite response envelope; provider details are never exposed.",
      "params": [
        {
          "name": "q",
          "type": "string",
          "required": true,
          "description": "Search keyword, e.g. Laufey",
          "location": "query",
          "example": "Laufey"
        }
      ],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "success",
        "code": 200,
        "message": "Request completed successfully",
        "data": {
          "result": "Provider response data"
        }
      },
      "responseSchema": [
        {
          "name": "data.result",
          "type": "object | array | string",
          "description": "Normalized response from the service."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-nexray",
      "baseUrl": "https://api.nexray.eu.cc",
      "providerPath": "/search/spotify",
      "paramsMap": {
        "q": "q"
      }
    },
    "normalizerId": "legacy-default-v1"
  },
  {
    "slug": "search-tiktok",
    "publicPath": "/api/v1/search/tiktok",
    "method": "GET",
    "categorySlug": "search",
    "kind": "provider",
    "paramSchemaId": "legacy-query-search-tiktok",
    "cacheTtlSeconds": 300,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 30
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "TikTok Video Search",
      "summary": "Search TikTok for videos matching a keyword.",
      "description": "Search TikTok for videos matching a keyword. Provider responses are normalized into the Kyyinfinite response envelope; provider details are never exposed.",
      "params": [
        {
          "name": "q",
          "type": "string",
          "required": true,
          "description": "Search keyword, e.g. Ronaldo",
          "location": "query",
          "example": "Ronaldo"
        }
      ],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "success",
        "code": 200,
        "message": "Request completed successfully",
        "data": {
          "result": "Provider response data"
        }
      },
      "responseSchema": [
        {
          "name": "data.result",
          "type": "object | array | string",
          "description": "Normalized response from the service."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-nexray",
      "baseUrl": "https://api.nexray.eu.cc",
      "providerPath": "/search/tiktok",
      "paramsMap": {
        "q": "q"
      }
    },
    "normalizerId": "legacy-default-v1"
  },
  {
    "slug": "search-tiktokphoto",
    "publicPath": "/api/v1/search/tiktokphoto",
    "method": "GET",
    "categorySlug": "search",
    "kind": "provider",
    "paramSchemaId": "legacy-query-search-tiktokphoto",
    "cacheTtlSeconds": 300,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 30
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "TikTok Photo Search",
      "summary": "Search TikTok for photo/slideshow posts matching a keyword.",
      "description": "Search TikTok for photo/slideshow posts matching a keyword. Provider responses are normalized into the Kyyinfinite response envelope; provider details are never exposed.",
      "params": [
        {
          "name": "q",
          "type": "string",
          "required": true,
          "description": "Search keyword, e.g. Nature",
          "location": "query",
          "example": "Ronaldo"
        }
      ],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "success",
        "code": 200,
        "message": "Request completed successfully",
        "data": {
          "result": "Provider response data"
        }
      },
      "responseSchema": [
        {
          "name": "data.result",
          "type": "object | array | string",
          "description": "Normalized response from the service."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-nexray",
      "baseUrl": "https://api.nexray.eu.cc",
      "providerPath": "/search/tiktokphoto",
      "paramsMap": {
        "q": "q"
      }
    },
    "normalizerId": "legacy-default-v1"
  },
  {
    "slug": "search-youtube",
    "publicPath": "/api/v1/search/youtube",
    "method": "GET",
    "categorySlug": "search",
    "kind": "provider",
    "paramSchemaId": "legacy-query-search-youtube",
    "cacheTtlSeconds": 300,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 30
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "YouTube Search",
      "summary": "Search YouTube for videos matching a keyword.",
      "description": "Search YouTube for videos matching a keyword. Provider responses are normalized into the Kyyinfinite response envelope; provider details are never exposed.",
      "params": [
        {
          "name": "q",
          "type": "string",
          "required": true,
          "description": "Search keyword, e.g. Lemonade",
          "location": "query",
          "example": "Laufey"
        }
      ],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "success",
        "code": 200,
        "message": "Request completed successfully",
        "data": {
          "result": "Provider response data"
        }
      },
      "responseSchema": [
        {
          "name": "data.result",
          "type": "object | array | string",
          "description": "Normalized response from the service."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-nexray",
      "baseUrl": "https://api.nexray.eu.cc",
      "providerPath": "/search/youtube",
      "paramsMap": {
        "q": "q"
      }
    },
    "normalizerId": "legacy-default-v1"
  },
  {
    "slug": "maker-brat",
    "publicPath": "/api/v1/maker/brat",
    "method": "GET",
    "categorySlug": "maker",
    "kind": "stream",
    "paramSchemaId": "legacy-query-maker-brat",
    "cacheTtlSeconds": 0,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 10
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "Brat Image Maker",
      "summary": "Generate a brat-style text image from a short string of text.",
      "description": "Generate a brat-style text image from a short string of text. The file bytes are streamed through Kyyinfinite; provider details are never exposed.",
      "params": [
        {
          "name": "text",
          "type": "string",
          "required": true,
          "description": "Text to render on the image",
          "location": "query",
          "example": "YOUR_TEXT"
        }
      ],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "binary",
        "message": "Returns raw file bytes with the upstream content type; no JSON envelope."
      },
      "responseSchema": [
        {
          "name": "(binary)",
          "type": "file",
          "description": "Raw file bytes with the upstream content type."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-nexray",
      "baseUrl": "https://api.nexray.eu.cc",
      "providerPath": "/maker/brat",
      "paramsMap": {
        "text": "text"
      }
    },
    "handlerId": "legacy-provider-stream"
  },
  {
    "slug": "maker-bratvid",
    "publicPath": "/api/v1/maker/bratvid",
    "method": "GET",
    "categorySlug": "maker",
    "kind": "stream",
    "paramSchemaId": "legacy-query-maker-bratvid",
    "cacheTtlSeconds": 0,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 10
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "Brat Video Maker",
      "summary": "Generate a brat-style animated video from a short string of text.",
      "description": "Generate a brat-style animated video from a short string of text. The file bytes are streamed through Kyyinfinite; provider details are never exposed.",
      "params": [
        {
          "name": "text",
          "type": "string",
          "required": true,
          "description": "Text to render in the video",
          "location": "query",
          "example": "YOUR_TEXT"
        }
      ],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "binary",
        "message": "Returns raw file bytes with the upstream content type; no JSON envelope."
      },
      "responseSchema": [
        {
          "name": "(binary)",
          "type": "file",
          "description": "Raw file bytes with the upstream content type."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-nexray",
      "baseUrl": "https://api.nexray.eu.cc",
      "providerPath": "/maker/bratvid",
      "paramsMap": {
        "text": "text"
      }
    },
    "handlerId": "legacy-provider-stream"
  },
  {
    "slug": "maker-iqc",
    "publicPath": "/api/v1/maker/iqc",
    "method": "GET",
    "categorySlug": "maker",
    "kind": "stream",
    "paramSchemaId": "legacy-query-maker-iqc",
    "cacheTtlSeconds": 0,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 10
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "Fake Phone Status Bar Maker",
      "summary": "Generate a fake phone status bar image with custom carrier, time, and battery level.",
      "description": "Generate a fake phone status bar image with custom carrier, time, and battery level. The file bytes are streamed through Kyyinfinite; provider details are never exposed.",
      "params": [
        {
          "name": "text",
          "type": "string",
          "required": true,
          "description": "Notification or status text",
          "location": "query",
          "example": "YOUR_TEXT"
        },
        {
          "name": "provider",
          "type": "string",
          "required": true,
          "description": "Carrier name, e.g. Indosat",
          "location": "query",
          "example": "YOUR_CARRIER"
        },
        {
          "name": "jam",
          "type": "string",
          "required": true,
          "description": "Time to display, e.g. 12:00",
          "location": "query",
          "example": "12:00"
        },
        {
          "name": "baterai",
          "type": "string",
          "required": true,
          "description": "Battery percentage, e.g. 50",
          "location": "query",
          "example": "50"
        }
      ],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "binary",
        "message": "Returns raw file bytes with the upstream content type; no JSON envelope."
      },
      "responseSchema": [
        {
          "name": "(binary)",
          "type": "file",
          "description": "Raw file bytes with the upstream content type."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-nexray",
      "baseUrl": "https://api.nexray.eu.cc",
      "providerPath": "/maker/v1/iqc",
      "paramsMap": {
        "text": "text",
        "provider": "provider",
        "jam": "jam",
        "baterai": "baterai"
      }
    },
    "handlerId": "legacy-provider-stream"
  },
  {
    "slug": "maker-fakelobyml",
    "publicPath": "/api/v1/maker/fakelobyml",
    "method": "GET",
    "categorySlug": "maker",
    "kind": "stream",
    "paramSchemaId": "legacy-query-maker-fakelobyml",
    "cacheTtlSeconds": 0,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 10
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "Fake Mobile Legends Lobby Maker",
      "summary": "Generate a fake Mobile Legends lobby screenshot with a custom avatar and nickname.",
      "description": "Generate a fake Mobile Legends lobby screenshot with a custom avatar and nickname. The file bytes are streamed through Kyyinfinite; provider details are never exposed.",
      "params": [
        {
          "name": "avatar",
          "type": "string",
          "required": true,
          "description": "Direct image URL for the avatar",
          "location": "query",
          "example": "https://example.com/avatar.jpg"
        },
        {
          "name": "nickname",
          "type": "string",
          "required": true,
          "description": "In-game nickname to display",
          "location": "query",
          "example": "YOUR_NICKNAME"
        }
      ],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "binary",
        "message": "Returns raw file bytes with the upstream content type; no JSON envelope."
      },
      "responseSchema": [
        {
          "name": "(binary)",
          "type": "file",
          "description": "Raw file bytes with the upstream content type."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-nexray",
      "baseUrl": "https://api.nexray.eu.cc",
      "providerPath": "/maker/fakelobyml",
      "paramsMap": {
        "avatar": "avatar",
        "nickname": "nickname"
      }
    },
    "handlerId": "legacy-provider-stream"
  },
  {
    "slug": "maker-fakelobyff",
    "publicPath": "/api/v1/maker/fakelobyff",
    "method": "GET",
    "categorySlug": "maker",
    "kind": "stream",
    "paramSchemaId": "legacy-query-maker-fakelobyff",
    "cacheTtlSeconds": 0,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 10
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "Fake Free Fire Lobby Maker",
      "summary": "Generate a fake Free Fire lobby screenshot with a custom nickname.",
      "description": "Generate a fake Free Fire lobby screenshot with a custom nickname. The file bytes are streamed through Kyyinfinite; provider details are never exposed.",
      "params": [
        {
          "name": "nickname",
          "type": "string",
          "required": true,
          "description": "In-game nickname to display",
          "location": "query",
          "example": "YOUR_NICKNAME"
        }
      ],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "binary",
        "message": "Returns raw file bytes with the upstream content type; no JSON envelope."
      },
      "responseSchema": [
        {
          "name": "(binary)",
          "type": "file",
          "description": "Raw file bytes with the upstream content type."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-nexray",
      "baseUrl": "https://api.nexray.eu.cc",
      "providerPath": "/maker/fakelobyff",
      "paramsMap": {
        "nickname": "nickname"
      }
    },
    "handlerId": "legacy-provider-stream"
  },
  {
    "slug": "maker-fakedana",
    "publicPath": "/api/v1/maker/fakedana",
    "method": "GET",
    "categorySlug": "maker",
    "kind": "stream",
    "paramSchemaId": "legacy-query-maker-fakedana",
    "cacheTtlSeconds": 0,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 10
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "Fake DANA Balance Maker",
      "summary": "Generate a fake DANA e-wallet balance screenshot with a custom amount.",
      "description": "Generate a fake DANA e-wallet balance screenshot with a custom amount. The file bytes are streamed through Kyyinfinite; provider details are never exposed.",
      "params": [
        {
          "name": "nominal",
          "type": "string",
          "required": true,
          "description": "Balance amount, e.g. 50000",
          "location": "query",
          "example": "50000"
        }
      ],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "binary",
        "message": "Returns raw file bytes with the upstream content type; no JSON envelope."
      },
      "responseSchema": [
        {
          "name": "(binary)",
          "type": "file",
          "description": "Raw file bytes with the upstream content type."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-nexray",
      "baseUrl": "https://api.nexray.eu.cc",
      "providerPath": "/maker/fakedana",
      "paramsMap": {
        "nominal": "nominal"
      }
    },
    "handlerId": "legacy-provider-stream"
  },
  {
    "slug": "maker-fakebank-jago",
    "publicPath": "/api/v1/maker/fakebank-jago",
    "method": "GET",
    "categorySlug": "maker",
    "kind": "stream",
    "paramSchemaId": "legacy-query-maker-fakebank-jago",
    "cacheTtlSeconds": 0,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 10
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "Fake Bank Jago Balance Maker",
      "summary": "Generate a fake Bank Jago balance screenshot with a custom name and amount.",
      "description": "Generate a fake Bank Jago balance screenshot with a custom name and amount. The file bytes are streamed through Kyyinfinite; provider details are never exposed.",
      "params": [
        {
          "name": "nama",
          "type": "string",
          "required": true,
          "description": "Account holder name",
          "location": "query",
          "example": "YOUR_NAME"
        },
        {
          "name": "saldo",
          "type": "string",
          "required": true,
          "description": "Balance amount, e.g. 100000",
          "location": "query",
          "example": "100000"
        }
      ],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "binary",
        "message": "Returns raw file bytes with the upstream content type; no JSON envelope."
      },
      "responseSchema": [
        {
          "name": "(binary)",
          "type": "file",
          "description": "Raw file bytes with the upstream content type."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-nexray",
      "baseUrl": "https://api.nexray.eu.cc",
      "providerPath": "/maker/fakebank-jago",
      "paramsMap": {
        "nama": "nama",
        "saldo": "saldo"
      }
    },
    "handlerId": "legacy-provider-stream"
  },
  {
    "slug": "maker-smeme",
    "publicPath": "/api/v1/maker/smeme",
    "method": "GET",
    "categorySlug": "maker",
    "kind": "stream",
    "paramSchemaId": "legacy-query-maker-smeme",
    "cacheTtlSeconds": 0,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 10
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "Simple Meme Maker",
      "summary": "Generate a top/bottom text meme over a custom background image.",
      "description": "Generate a top/bottom text meme over a custom background image. The file bytes are streamed through Kyyinfinite; provider details are never exposed.",
      "params": [
        {
          "name": "text_atas",
          "type": "string",
          "required": true,
          "description": "Top text",
          "location": "query",
          "example": "TOP_TEXT"
        },
        {
          "name": "text_bawah",
          "type": "string",
          "required": true,
          "description": "Bottom text",
          "location": "query",
          "example": "BOTTOM_TEXT"
        },
        {
          "name": "background",
          "type": "string",
          "required": true,
          "description": "Direct image URL for the background",
          "location": "query",
          "example": "https://example.com/background.jpg"
        }
      ],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "binary",
        "message": "Returns raw file bytes with the upstream content type; no JSON envelope."
      },
      "responseSchema": [
        {
          "name": "(binary)",
          "type": "file",
          "description": "Raw file bytes with the upstream content type."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-nexray",
      "baseUrl": "https://api.nexray.eu.cc",
      "providerPath": "/maker/smeme",
      "paramsMap": {
        "text_atas": "text_atas",
        "text_bawah": "text_bawah",
        "background": "background"
      }
    },
    "handlerId": "legacy-provider-stream"
  },
  {
    "slug": "downloader-tiktok",
    "publicPath": "/api/v1/downloader/tiktok",
    "method": "GET",
    "categorySlug": "downloader",
    "kind": "provider",
    "paramSchemaId": "legacy-query-downloader-tiktok",
    "cacheTtlSeconds": 300,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 15
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "TikTok Downloader",
      "summary": "Fetch a downloadable, watermark-free TikTok video/photo from a share link.",
      "description": "Fetch a downloadable, watermark-free TikTok video/photo from a share link. Provider responses are normalized into the Kyyinfinite response envelope; provider details are never exposed.",
      "params": [
        {
          "name": "url",
          "type": "string",
          "required": true,
          "description": "TikTok video/photo share URL",
          "location": "query",
          "example": "https://www.tiktok.com/@username/video/VIDEO_ID"
        }
      ],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "success",
        "code": 200,
        "message": "Request completed successfully",
        "data": {
          "result": "Provider response data"
        }
      },
      "responseSchema": [
        {
          "name": "data.result",
          "type": "object | array | string",
          "description": "Normalized response from the service."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-nexray",
      "baseUrl": "https://api.nexray.eu.cc",
      "providerPath": "/downloader/tiktok",
      "paramsMap": {
        "url": "url"
      }
    },
    "normalizerId": "legacy-default-v1"
  },
  {
    "slug": "downloader-threads",
    "publicPath": "/api/v1/downloader/threads",
    "method": "GET",
    "categorySlug": "downloader",
    "kind": "provider",
    "paramSchemaId": "legacy-query-downloader-threads",
    "cacheTtlSeconds": 300,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 15
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "Threads Downloader",
      "summary": "Fetch downloadable media from a Threads post link.",
      "description": "Fetch downloadable media from a Threads post link. Provider responses are normalized into the Kyyinfinite response envelope; provider details are never exposed.",
      "params": [
        {
          "name": "url",
          "type": "string",
          "required": true,
          "description": "Threads post URL",
          "location": "query",
          "example": "https://www.threads.net/@username/post/POST_ID"
        }
      ],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "success",
        "code": 200,
        "message": "Request completed successfully",
        "data": {
          "result": "Provider response data"
        }
      },
      "responseSchema": [
        {
          "name": "data.result",
          "type": "object | array | string",
          "description": "Normalized response from the service."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-nexray",
      "baseUrl": "https://api.nexray.eu.cc",
      "providerPath": "/downloader/threads",
      "paramsMap": {
        "url": "url"
      }
    },
    "normalizerId": "legacy-default-v1"
  },
  {
    "slug": "downloader-ytmp3",
    "publicPath": "/api/v1/downloader/ytmp3",
    "method": "GET",
    "categorySlug": "downloader",
    "kind": "provider",
    "paramSchemaId": "legacy-query-downloader-ytmp3",
    "cacheTtlSeconds": 300,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 15
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "YouTube to MP3",
      "summary": "Convert a YouTube video link to a downloadable MP3 audio file.",
      "description": "Convert a YouTube video link to a downloadable MP3 audio file. Provider responses are normalized into the Kyyinfinite response envelope; provider details are never exposed.",
      "params": [
        {
          "name": "url",
          "type": "string",
          "required": true,
          "description": "YouTube video URL",
          "location": "query",
          "example": "https://example.com/your-url"
        }
      ],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "success",
        "code": 200,
        "message": "Request completed successfully",
        "data": {
          "result": "Provider response data"
        }
      },
      "responseSchema": [
        {
          "name": "data.result",
          "type": "object | array | string",
          "description": "Normalized response from the service."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-nexray",
      "baseUrl": "https://api.nexray.eu.cc",
      "providerPath": "/downloader/ytmp3",
      "paramsMap": {
        "url": "url"
      }
    },
    "normalizerId": "legacy-default-v1"
  },
  {
    "slug": "downloader-ytmp4",
    "publicPath": "/api/v1/downloader/ytmp4",
    "method": "GET",
    "categorySlug": "downloader",
    "kind": "provider",
    "paramSchemaId": "legacy-query-downloader-ytmp4",
    "cacheTtlSeconds": 300,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 15
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "YouTube to MP4",
      "summary": "Convert a YouTube video link to a downloadable MP4 at a chosen resolution.",
      "description": "Convert a YouTube video link to a downloadable MP4 at a chosen resolution. Provider responses are normalized into the Kyyinfinite response envelope; provider details are never exposed.",
      "params": [
        {
          "name": "url",
          "type": "string",
          "required": true,
          "description": "YouTube video URL",
          "location": "query",
          "example": "https://example.com/your-url"
        },
        {
          "name": "resolusi",
          "type": "string",
          "required": false,
          "description": "Resolution, e.g. 360, 720, 1080, 2160",
          "location": "query",
          "example": "720"
        }
      ],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "success",
        "code": 200,
        "message": "Request completed successfully",
        "data": {
          "result": "Provider response data"
        }
      },
      "responseSchema": [
        {
          "name": "data.result",
          "type": "object | array | string",
          "description": "Normalized response from the service."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-nexray",
      "baseUrl": "https://api.nexray.eu.cc",
      "providerPath": "/downloader/ytmp4",
      "paramsMap": {
        "url": "url",
        "resolusi": "resolusi"
      }
    },
    "normalizerId": "legacy-default-v1"
  },
  {
    "slug": "downloader-v1-ytmp4",
    "publicPath": "/api/v1/downloader/v1/ytmp4",
    "method": "GET",
    "categorySlug": "downloader",
    "kind": "provider",
    "paramSchemaId": "legacy-query-downloader-v1-ytmp4",
    "cacheTtlSeconds": 300,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 15
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "YouTube to MP4 (v1)",
      "summary": "Alternate YouTube-to-MP4 converter endpoint with resolution selection.",
      "description": "Alternate YouTube-to-MP4 converter endpoint with resolution selection. Provider responses are normalized into the Kyyinfinite response envelope; provider details are never exposed.",
      "params": [
        {
          "name": "url",
          "type": "string",
          "required": true,
          "description": "YouTube video URL",
          "location": "query",
          "example": "https://example.com/your-url"
        },
        {
          "name": "resolusi",
          "type": "string",
          "required": false,
          "description": "Resolution, e.g. 360, 720, 1080",
          "location": "query",
          "example": "720"
        }
      ],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "success",
        "code": 200,
        "message": "Request completed successfully",
        "data": {
          "result": "Provider response data"
        }
      },
      "responseSchema": [
        {
          "name": "data.result",
          "type": "object | array | string",
          "description": "Normalized response from the service."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-nexray",
      "baseUrl": "https://api.nexray.eu.cc",
      "providerPath": "/downloader/v1/ytmp4",
      "paramsMap": {
        "url": "url",
        "resolusi": "resolusi"
      }
    },
    "normalizerId": "legacy-default-v1"
  },
  {
    "slug": "downloader-ytplay",
    "publicPath": "/api/v1/downloader/ytplay",
    "method": "GET",
    "categorySlug": "downloader",
    "kind": "provider",
    "paramSchemaId": "legacy-query-downloader-ytplay",
    "cacheTtlSeconds": 300,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 15
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "YouTube Play (Search & Download)",
      "summary": "Search YouTube by keyword and return a downloadable audio/video result directly.",
      "description": "Search YouTube by keyword and return a downloadable audio/video result directly. Provider responses are normalized into the Kyyinfinite response envelope; provider details are never exposed.",
      "params": [
        {
          "name": "q",
          "type": "string",
          "required": true,
          "description": "Search keyword, e.g. Laufey",
          "location": "query",
          "example": "YOUR_SEARCH_QUERY"
        }
      ],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "success",
        "code": 200,
        "message": "Request completed successfully",
        "data": {
          "result": "Provider response data"
        }
      },
      "responseSchema": [
        {
          "name": "data.result",
          "type": "object | array | string",
          "description": "Normalized response from the service."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-nexray",
      "baseUrl": "https://api.nexray.eu.cc",
      "providerPath": "/downloader/ytplay",
      "paramsMap": {
        "q": "q"
      }
    },
    "normalizerId": "legacy-default-v1"
  },
  {
    "slug": "downloader-applemusic",
    "publicPath": "/api/v1/downloader/applemusic",
    "method": "GET",
    "categorySlug": "downloader",
    "kind": "provider",
    "paramSchemaId": "legacy-query-downloader-applemusic",
    "cacheTtlSeconds": 300,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 15
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "Apple Music Downloader",
      "summary": "Fetch a downloadable audio preview/track from an Apple Music link.",
      "description": "Fetch a downloadable audio preview/track from an Apple Music link. Provider responses are normalized into the Kyyinfinite response envelope; provider details are never exposed.",
      "params": [
        {
          "name": "url",
          "type": "string",
          "required": true,
          "description": "Apple Music track/album URL",
          "location": "query",
          "example": "https://music.apple.com/us/album/ALBUM_ID"
        }
      ],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "success",
        "code": 200,
        "message": "Request completed successfully",
        "data": {
          "result": "Provider response data"
        }
      },
      "responseSchema": [
        {
          "name": "data.result",
          "type": "object | array | string",
          "description": "Normalized response from the service."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-nexray",
      "baseUrl": "https://api.nexray.eu.cc",
      "providerPath": "/downloader/applemusic",
      "paramsMap": {
        "url": "url"
      }
    },
    "normalizerId": "legacy-default-v1"
  },
  {
    "slug": "downloader-capcut",
    "publicPath": "/api/v1/downloader/capcut",
    "method": "GET",
    "categorySlug": "downloader",
    "kind": "provider",
    "paramSchemaId": "legacy-query-downloader-capcut",
    "cacheTtlSeconds": 300,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 15
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "CapCut Downloader",
      "summary": "Fetch a downloadable, watermark-free video from a CapCut template/share link.",
      "description": "Fetch a downloadable, watermark-free video from a CapCut template/share link. Provider responses are normalized into the Kyyinfinite response envelope; provider details are never exposed.",
      "params": [
        {
          "name": "url",
          "type": "string",
          "required": true,
          "description": "CapCut share URL",
          "location": "query",
          "example": "https://www.capcut.com/t/SHARE_ID"
        }
      ],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "success",
        "code": 200,
        "message": "Request completed successfully",
        "data": {
          "result": "Provider response data"
        }
      },
      "responseSchema": [
        {
          "name": "data.result",
          "type": "object | array | string",
          "description": "Normalized response from the service."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-nexray",
      "baseUrl": "https://api.nexray.eu.cc",
      "providerPath": "/downloader/capcut",
      "paramsMap": {
        "url": "url"
      }
    },
    "normalizerId": "legacy-default-v1"
  },
  {
    "slug": "downloader-facebook",
    "publicPath": "/api/v1/downloader/facebook",
    "method": "GET",
    "categorySlug": "downloader",
    "kind": "provider",
    "paramSchemaId": "legacy-query-downloader-facebook",
    "cacheTtlSeconds": 300,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 15
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "Facebook Downloader",
      "summary": "Fetch a downloadable video from a public Facebook video link.",
      "description": "Fetch a downloadable video from a public Facebook video link. Provider responses are normalized into the Kyyinfinite response envelope; provider details are never exposed.",
      "params": [
        {
          "name": "url",
          "type": "string",
          "required": true,
          "description": "Facebook video URL",
          "location": "query",
          "example": "https://www.facebook.com/watch/?v=VIDEO_ID"
        }
      ],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "success",
        "code": 200,
        "message": "Request completed successfully",
        "data": {
          "result": "Provider response data"
        }
      },
      "responseSchema": [
        {
          "name": "data.result",
          "type": "object | array | string",
          "description": "Normalized response from the service."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-nexray",
      "baseUrl": "https://api.nexray.eu.cc",
      "providerPath": "/downloader/facebook",
      "paramsMap": {
        "url": "url"
      }
    },
    "normalizerId": "legacy-default-v1"
  },
  {
    "slug": "downloader-github",
    "publicPath": "/api/v1/downloader/github",
    "method": "GET",
    "categorySlug": "downloader",
    "kind": "provider",
    "paramSchemaId": "legacy-query-downloader-github",
    "cacheTtlSeconds": 300,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 15
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "GitHub Repo Downloader",
      "summary": "Fetch a downloadable zip link and metadata for a public GitHub repository.",
      "description": "Fetch a downloadable zip link and metadata for a public GitHub repository. Provider responses are normalized into the Kyyinfinite response envelope; provider details are never exposed.",
      "params": [
        {
          "name": "url",
          "type": "string",
          "required": true,
          "description": "GitHub repository URL",
          "location": "query",
          "example": "https://github.com/OWNER/REPO"
        }
      ],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "success",
        "code": 200,
        "message": "Request completed successfully",
        "data": {
          "result": "Provider response data"
        }
      },
      "responseSchema": [
        {
          "name": "data.result",
          "type": "object | array | string",
          "description": "Normalized response from the service."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-nexray",
      "baseUrl": "https://api.nexray.eu.cc",
      "providerPath": "/downloader/github",
      "paramsMap": {
        "url": "url"
      }
    },
    "normalizerId": "legacy-default-v1"
  },
  {
    "slug": "downloader-v1-instagram",
    "publicPath": "/api/v1/downloader/v1/instagram",
    "method": "GET",
    "categorySlug": "downloader",
    "kind": "provider",
    "paramSchemaId": "legacy-query-downloader-v1-instagram",
    "cacheTtlSeconds": 300,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 15
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "Instagram Downloader (v1)",
      "summary": "Fetch downloadable media from an Instagram post, reel, or story link.",
      "description": "Fetch downloadable media from an Instagram post, reel, or story link. Provider responses are normalized into the Kyyinfinite response envelope; provider details are never exposed.",
      "params": [
        {
          "name": "url",
          "type": "string",
          "required": true,
          "description": "Instagram post/reel URL",
          "location": "query",
          "example": "https://www.instagram.com/p/POST_ID/"
        }
      ],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "success",
        "code": 200,
        "message": "Request completed successfully",
        "data": {
          "result": "Provider response data"
        }
      },
      "responseSchema": [
        {
          "name": "data.result",
          "type": "object | array | string",
          "description": "Normalized response from the service."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-nexray",
      "baseUrl": "https://api.nexray.eu.cc",
      "providerPath": "/downloader/v1/instagram",
      "paramsMap": {
        "url": "url"
      }
    },
    "normalizerId": "legacy-default-v1"
  },
  {
    "slug": "downloader-v2-instagram",
    "publicPath": "/api/v1/downloader/v2/instagram",
    "method": "GET",
    "categorySlug": "downloader",
    "kind": "provider",
    "paramSchemaId": "legacy-query-downloader-v2-instagram",
    "cacheTtlSeconds": 300,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 15
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "Instagram Downloader (v2)",
      "summary": "Alternate Instagram downloader endpoint, useful as a fallback when v1 fails.",
      "description": "Alternate Instagram downloader endpoint, useful as a fallback when v1 fails. Provider responses are normalized into the Kyyinfinite response envelope; provider details are never exposed.",
      "params": [
        {
          "name": "url",
          "type": "string",
          "required": true,
          "description": "Instagram post/reel URL",
          "location": "query",
          "example": "https://www.instagram.com/p/POST_ID/"
        }
      ],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "success",
        "code": 200,
        "message": "Request completed successfully",
        "data": {
          "result": "Provider response data"
        }
      },
      "responseSchema": [
        {
          "name": "data.result",
          "type": "object | array | string",
          "description": "Normalized response from the service."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-nexray",
      "baseUrl": "https://api.nexray.eu.cc",
      "providerPath": "/downloader/v2/instagram",
      "paramsMap": {
        "url": "url"
      }
    },
    "normalizerId": "legacy-default-v1"
  },
  {
    "slug": "downloader-spotifyplay",
    "publicPath": "/api/v1/downloader/spotifyplay",
    "method": "GET",
    "categorySlug": "downloader",
    "kind": "provider",
    "paramSchemaId": "legacy-query-downloader-spotifyplay",
    "cacheTtlSeconds": 300,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 15
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "Spotify Play (Search & Download)",
      "summary": "Search Spotify by keyword and return track metadata plus a downloadable audio link.",
      "description": "Search Spotify by keyword and return track metadata plus a downloadable audio link. Provider responses are normalized into the Kyyinfinite response envelope; provider details are never exposed.",
      "params": [
        {
          "name": "q",
          "type": "string",
          "required": true,
          "description": "Search keyword, e.g. Laufey",
          "location": "query",
          "example": "Laufey"
        }
      ],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "success",
        "code": 200,
        "message": "Request completed successfully",
        "data": {
          "result": "Provider response data"
        }
      },
      "responseSchema": [
        {
          "name": "data.result",
          "type": "object | array | string",
          "description": "Normalized response from the service."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-nexray",
      "baseUrl": "https://api.nexray.eu.cc",
      "providerPath": "/downloader/spotifyplay",
      "paramsMap": {
        "q": "q"
      }
    },
    "normalizerId": "legacy-default-v1"
  },
  {
    "slug": "downloader-gdrive",
    "publicPath": "/api/v1/downloader/gdrive",
    "method": "GET",
    "categorySlug": "downloader",
    "kind": "provider",
    "paramSchemaId": "legacy-query-downloader-gdrive",
    "cacheTtlSeconds": 300,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 15
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "Google Drive Downloader",
      "summary": "Fetch a direct download link for a shared Google Drive file.",
      "description": "Fetch a direct download link for a shared Google Drive file. Provider responses are normalized into the Kyyinfinite response envelope; provider details are never exposed.",
      "params": [
        {
          "name": "url",
          "type": "string",
          "required": true,
          "description": "Google Drive share URL",
          "location": "query",
          "example": "https://drive.google.com/file/d/FILE_ID/view"
        }
      ],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "success",
        "code": 200,
        "message": "Request completed successfully",
        "data": {
          "result": "Provider response data"
        }
      },
      "responseSchema": [
        {
          "name": "data.result",
          "type": "object | array | string",
          "description": "Normalized response from the service."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-siputzx",
      "baseUrl": "https://api.siputzx.my.id",
      "providerPath": "/api/d/gdrive",
      "paramsMap": {
        "url": "url"
      }
    },
    "normalizerId": "legacy-default-v1"
  },
  {
    "slug": "downloader-savefrom",
    "publicPath": "/api/v1/downloader/savefrom",
    "method": "GET",
    "categorySlug": "downloader",
    "kind": "provider",
    "paramSchemaId": "legacy-query-downloader-savefrom",
    "cacheTtlSeconds": 300,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 15
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "SaveFrom Multi-Platform Downloader",
      "summary": "Fetch downloadable media links from SoundCloud and other SaveFrom-supported links.",
      "description": "Fetch downloadable media links from SoundCloud and other SaveFrom-supported links. Provider responses are normalized into the Kyyinfinite response envelope; provider details are never exposed.",
      "params": [
        {
          "name": "url",
          "type": "string",
          "required": true,
          "description": "Media URL, e.g. a SoundCloud track link",
          "location": "query",
          "example": "https://example.com/your-url"
        }
      ],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "success",
        "code": 200,
        "message": "Request completed successfully",
        "data": {
          "result": "Provider response data"
        }
      },
      "responseSchema": [
        {
          "name": "data.result",
          "type": "object | array | string",
          "description": "Normalized response from the service."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-siputzx",
      "baseUrl": "https://api.siputzx.my.id",
      "providerPath": "/api/d/savefrom",
      "paramsMap": {
        "url": "url"
      }
    },
    "normalizerId": "legacy-default-v1"
  },
  {
    "slug": "tools-translate",
    "publicPath": "/api/v1/tools/translate",
    "method": "GET",
    "categorySlug": "tools",
    "kind": "provider",
    "paramSchemaId": "legacy-query-tools-translate",
    "cacheTtlSeconds": 0,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 30
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "Text Translator",
      "summary": "Translate text into a target language.",
      "description": "Translate text into a target language. Provider responses are normalized into the Kyyinfinite response envelope; provider details are never exposed.",
      "params": [
        {
          "name": "text",
          "type": "string",
          "required": true,
          "description": "Text to translate",
          "location": "query",
          "example": "YOUR_TEXT"
        },
        {
          "name": "lang",
          "type": "string",
          "required": true,
          "description": "Target language code, e.g. En",
          "location": "query",
          "example": "en"
        }
      ],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "success",
        "code": 200,
        "message": "Request completed successfully",
        "data": {
          "result": "Provider response data"
        }
      },
      "responseSchema": [
        {
          "name": "data.result",
          "type": "object | array | string",
          "description": "Normalized response from the service."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-nexray",
      "baseUrl": "https://api.nexray.eu.cc",
      "providerPath": "/tools/translate",
      "paramsMap": {
        "text": "text",
        "lang": "lang"
      }
    },
    "normalizerId": "legacy-default-v1"
  },
  {
    "slug": "tools-tts-google",
    "publicPath": "/api/v1/tools/tts-google",
    "method": "GET",
    "categorySlug": "tools",
    "kind": "stream",
    "paramSchemaId": "legacy-query-tools-tts-google",
    "cacheTtlSeconds": 0,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 10
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "Text to Speech (Google)",
      "summary": "Convert text into a downloadable spoken-audio file.",
      "description": "Convert text into a downloadable spoken-audio file. The file bytes are streamed through Kyyinfinite; provider details are never exposed.",
      "params": [
        {
          "name": "text",
          "type": "string",
          "required": true,
          "description": "Text to speak",
          "location": "query",
          "example": "YOUR_TEXT"
        }
      ],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "binary",
        "message": "Returns raw file bytes with the upstream content type; no JSON envelope."
      },
      "responseSchema": [
        {
          "name": "(binary)",
          "type": "file",
          "description": "Raw file bytes with the upstream content type."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-nexray",
      "baseUrl": "https://api.nexray.eu.cc",
      "providerPath": "/tools/tts-google",
      "paramsMap": {
        "text": "text"
      }
    },
    "handlerId": "legacy-provider-stream"
  },
  {
    "slug": "tools-unblur",
    "publicPath": "/api/v1/tools/unblur",
    "method": "GET",
    "categorySlug": "tools",
    "kind": "stream",
    "paramSchemaId": "legacy-query-tools-unblur",
    "cacheTtlSeconds": 0,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 10
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "Image Unblur / Upscale",
      "summary": "Sharpen and upscale a blurry image from a direct image URL.",
      "description": "Sharpen and upscale a blurry image from a direct image URL. The file bytes are streamed through Kyyinfinite; provider details are never exposed.",
      "params": [
        {
          "name": "url",
          "type": "string",
          "required": true,
          "description": "Direct image URL to unblur",
          "location": "query",
          "example": "https://example.com/your-url"
        }
      ],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "binary",
        "message": "Returns raw file bytes with the upstream content type; no JSON envelope."
      },
      "responseSchema": [
        {
          "name": "(binary)",
          "type": "file",
          "description": "Raw file bytes with the upstream content type."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-nexray",
      "baseUrl": "https://api.nexray.eu.cc",
      "providerPath": "/tools/unblur",
      "paramsMap": {
        "url": "url"
      }
    },
    "handlerId": "legacy-provider-stream"
  },
  {
    "slug": "tools-blur",
    "publicPath": "/api/v1/tools/blur",
    "method": "GET",
    "categorySlug": "tools",
    "kind": "stream",
    "paramSchemaId": "legacy-query-tools-blur",
    "cacheTtlSeconds": 0,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 10
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "Image Blur",
      "summary": "Apply a blur effect to an image from a URL.",
      "description": "Apply a blur effect to an image from a URL. The file bytes are streamed through Kyyinfinite; provider details are never exposed.",
      "params": [
        {
          "name": "image",
          "type": "string",
          "required": true,
          "description": "Direct image URL to blur",
          "location": "query",
          "example": "https://example.com/image.jpg"
        }
      ],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "binary",
        "message": "Returns raw file bytes with the upstream content type; no JSON envelope."
      },
      "responseSchema": [
        {
          "name": "(binary)",
          "type": "file",
          "description": "Raw file bytes with the upstream content type."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-siputzx",
      "baseUrl": "https://api.siputzx.my.id",
      "providerPath": "/api/canvas/blur",
      "paramsMap": {
        "image": "image"
      }
    },
    "handlerId": "legacy-provider-stream"
  },
  {
    "slug": "tools-kodepos",
    "publicPath": "/api/v1/tools/kodepos",
    "method": "GET",
    "categorySlug": "tools",
    "kind": "provider",
    "paramSchemaId": "legacy-query-tools-kodepos",
    "cacheTtlSeconds": 86400,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 30
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "Indonesian Postal Code Lookup",
      "summary": "Look up Indonesian postal codes (kode pos) by area or village name.",
      "description": "Look up Indonesian postal codes (kode pos) by area or village name. Provider responses are normalized into the Kyyinfinite response envelope; provider details are never exposed.",
      "params": [
        {
          "name": "form",
          "type": "string",
          "required": true,
          "description": "Area/village name, e.g. pasiran jaya",
          "location": "query",
          "example": "YOUR_VILLAGE_NAME"
        }
      ],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "success",
        "code": 200,
        "message": "Request completed successfully",
        "data": {
          "result": "Provider response data"
        }
      },
      "responseSchema": [
        {
          "name": "data.result",
          "type": "object | array | string",
          "description": "Normalized response from the service."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-siputzx",
      "baseUrl": "https://api.siputzx.my.id",
      "providerPath": "/api/tools/kodepos",
      "paramsMap": {
        "form": "form"
      }
    },
    "normalizerId": "legacy-default-v1"
  },
  {
    "slug": "tools-countryinfo",
    "publicPath": "/api/v1/tools/countryinfo",
    "method": "GET",
    "categorySlug": "tools",
    "kind": "provider",
    "paramSchemaId": "legacy-query-tools-countryinfo",
    "cacheTtlSeconds": 86400,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 30
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "Country Info Lookup",
      "summary": "Look up general information about a country by name.",
      "description": "Look up general information about a country by name. Provider responses are normalized into the Kyyinfinite response envelope; provider details are never exposed.",
      "params": [
        {
          "name": "name",
          "type": "string",
          "required": true,
          "description": "Country name, e.g. Indonesia",
          "location": "query",
          "example": "Indonesia"
        }
      ],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "success",
        "code": 200,
        "message": "Request completed successfully",
        "data": {
          "result": "Provider response data"
        }
      },
      "responseSchema": [
        {
          "name": "data.result",
          "type": "object | array | string",
          "description": "Normalized response from the service."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-siputzx",
      "baseUrl": "https://api.siputzx.my.id",
      "providerPath": "/api/tools/countryInfo",
      "paramsMap": {
        "name": "name"
      }
    },
    "normalizerId": "legacy-default-v1"
  },
  {
    "slug": "ai-glm47flash",
    "publicPath": "/api/v1/ai/glm47flash",
    "method": "GET",
    "categorySlug": "ai",
    "kind": "provider",
    "paramSchemaId": "legacy-query-ai-glm47flash",
    "cacheTtlSeconds": 0,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 10
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "GLM-4.7 Flash Chat",
      "summary": "Send a prompt to the GLM-4.7 Flash model and get a text completion back.",
      "description": "Send a prompt to the GLM-4.7 Flash model and get a text completion back. Provider responses are normalized into the Kyyinfinite response envelope; provider details are never exposed.",
      "params": [
        {
          "name": "prompt",
          "type": "string",
          "required": true,
          "description": "User prompt",
          "location": "query",
          "example": "YOUR_PROMPT"
        },
        {
          "name": "system",
          "type": "string",
          "required": false,
          "description": "System instruction",
          "location": "query",
          "example": "You are a helpful assistant."
        },
        {
          "name": "temperature",
          "type": "string",
          "required": false,
          "description": "Sampling temperature, e.g. 0.7",
          "location": "query",
          "example": 0.7
        }
      ],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "success",
        "code": 200,
        "message": "Request completed successfully",
        "data": {
          "result": "Provider response data"
        }
      },
      "responseSchema": [
        {
          "name": "data.result",
          "type": "object | array | string",
          "description": "Normalized response from the service."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-siputzx",
      "baseUrl": "https://api.siputzx.my.id",
      "providerPath": "/api/ai/glm47flash",
      "paramsMap": {
        "prompt": "prompt",
        "system": "system",
        "temperature": "temperature"
      }
    },
    "normalizerId": "legacy-default-v1"
  },
  {
    "slug": "ai-chatgpt",
    "publicPath": "/api/v1/ai/chatgpt",
    "method": "GET",
    "categorySlug": "ai",
    "kind": "provider",
    "paramSchemaId": "legacy-query-ai-chatgpt",
    "cacheTtlSeconds": 0,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 10
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "ChatGPT",
      "summary": "Send a prompt to ChatGPT and get a text reply back.",
      "description": "Send a prompt to ChatGPT and get a text reply back. Provider responses are normalized into the Kyyinfinite response envelope; provider details are never exposed.",
      "params": [
        {
          "name": "text",
          "type": "string",
          "required": true,
          "description": "Prompt to send",
          "location": "query",
          "example": "YOUR_TEXT"
        }
      ],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "success",
        "code": 200,
        "message": "Request completed successfully",
        "data": {
          "result": "Provider response data"
        }
      },
      "responseSchema": [
        {
          "name": "data.result",
          "type": "object | array | string",
          "description": "Normalized response from the service."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-nexray",
      "baseUrl": "https://api.nexray.eu.cc",
      "providerPath": "/ai/chatgpt",
      "paramsMap": {
        "text": "text"
      }
    },
    "normalizerId": "legacy-default-v1"
  },
  {
    "slug": "ai-claude",
    "publicPath": "/api/v1/ai/claude",
    "method": "GET",
    "categorySlug": "ai",
    "kind": "provider",
    "paramSchemaId": "legacy-query-ai-claude",
    "cacheTtlSeconds": 0,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 10
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "Claude",
      "summary": "Send a prompt to Claude and get a text reply back.",
      "description": "Send a prompt to Claude and get a text reply back. Provider responses are normalized into the Kyyinfinite response envelope; provider details are never exposed.",
      "params": [
        {
          "name": "text",
          "type": "string",
          "required": true,
          "description": "Prompt to send",
          "location": "query",
          "example": "YOUR_TEXT"
        }
      ],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "success",
        "code": 200,
        "message": "Request completed successfully",
        "data": {
          "result": "Provider response data"
        }
      },
      "responseSchema": [
        {
          "name": "data.result",
          "type": "object | array | string",
          "description": "Normalized response from the service."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-nexray",
      "baseUrl": "https://api.nexray.eu.cc",
      "providerPath": "/ai/claude",
      "paramsMap": {
        "text": "text"
      }
    },
    "normalizerId": "legacy-default-v1"
  },
  {
    "slug": "ai-copilot",
    "publicPath": "/api/v1/ai/copilot",
    "method": "GET",
    "categorySlug": "ai",
    "kind": "provider",
    "paramSchemaId": "legacy-query-ai-copilot",
    "cacheTtlSeconds": 0,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 10
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "Microsoft Copilot",
      "summary": "Send a prompt to Microsoft Copilot and get a text reply back.",
      "description": "Send a prompt to Microsoft Copilot and get a text reply back. Provider responses are normalized into the Kyyinfinite response envelope; provider details are never exposed.",
      "params": [
        {
          "name": "text",
          "type": "string",
          "required": true,
          "description": "Prompt to send",
          "location": "query",
          "example": "YOUR_TEXT"
        }
      ],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "success",
        "code": 200,
        "message": "Request completed successfully",
        "data": {
          "result": "Provider response data"
        }
      },
      "responseSchema": [
        {
          "name": "data.result",
          "type": "object | array | string",
          "description": "Normalized response from the service."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-nexray",
      "baseUrl": "https://api.nexray.eu.cc",
      "providerPath": "/ai/copilot",
      "paramsMap": {
        "text": "text"
      }
    },
    "normalizerId": "legacy-default-v1"
  },
  {
    "slug": "news-kompas",
    "publicPath": "/api/v1/news/kompas",
    "method": "GET",
    "categorySlug": "news",
    "kind": "provider",
    "paramSchemaId": "legacy-query-news-kompas",
    "cacheTtlSeconds": 300,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 30
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "Kompas News Feed",
      "summary": "Fetch the latest headlines from Kompas.",
      "description": "Fetch the latest headlines from Kompas. Provider responses are normalized into the Kyyinfinite response envelope; provider details are never exposed.",
      "params": [],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "success",
        "code": 200,
        "message": "Request completed successfully",
        "data": {
          "result": "Provider response data"
        }
      },
      "responseSchema": [
        {
          "name": "data.result",
          "type": "object | array | string",
          "description": "Normalized response from the service."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-siputzx",
      "baseUrl": "https://api.siputzx.my.id",
      "providerPath": "/api/berita/kompas",
      "paramsMap": {}
    },
    "normalizerId": "legacy-default-v1"
  },
  {
    "slug": "news-cnn",
    "publicPath": "/api/v1/news/cnn",
    "method": "GET",
    "categorySlug": "news",
    "kind": "provider",
    "paramSchemaId": "legacy-query-news-cnn",
    "cacheTtlSeconds": 300,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 30
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "CNN Indonesia News Feed",
      "summary": "Fetch the latest headlines from CNN Indonesia.",
      "description": "Fetch the latest headlines from CNN Indonesia. Provider responses are normalized into the Kyyinfinite response envelope; provider details are never exposed.",
      "params": [],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "success",
        "code": 200,
        "message": "Request completed successfully",
        "data": {
          "result": "Provider response data"
        }
      },
      "responseSchema": [
        {
          "name": "data.result",
          "type": "object | array | string",
          "description": "Normalized response from the service."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-siputzx",
      "baseUrl": "https://api.siputzx.my.id",
      "providerPath": "/api/berita/cnn",
      "paramsMap": {}
    },
    "normalizerId": "legacy-default-v1"
  },
  {
    "slug": "news-tribunnews",
    "publicPath": "/api/v1/news/tribunnews",
    "method": "GET",
    "categorySlug": "news",
    "kind": "provider",
    "paramSchemaId": "legacy-query-news-tribunnews",
    "cacheTtlSeconds": 300,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 30
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "Tribunnews Feed",
      "summary": "Fetch the latest headlines from Tribunnews.",
      "description": "Fetch the latest headlines from Tribunnews. Provider responses are normalized into the Kyyinfinite response envelope; provider details are never exposed.",
      "params": [],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "success",
        "code": 200,
        "message": "Request completed successfully",
        "data": {
          "result": "Provider response data"
        }
      },
      "responseSchema": [
        {
          "name": "data.result",
          "type": "object | array | string",
          "description": "Normalized response from the service."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-siputzx",
      "baseUrl": "https://api.siputzx.my.id",
      "providerPath": "/api/berita/tribunnews",
      "paramsMap": {}
    },
    "normalizerId": "legacy-default-v1"
  },
  {
    "slug": "news-liputan6",
    "publicPath": "/api/v1/news/liputan6",
    "method": "GET",
    "categorySlug": "news",
    "kind": "provider",
    "paramSchemaId": "legacy-query-news-liputan6",
    "cacheTtlSeconds": 300,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 30
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "Liputan6 Feed",
      "summary": "Fetch the latest headlines from Liputan6.",
      "description": "Fetch the latest headlines from Liputan6. Provider responses are normalized into the Kyyinfinite response envelope; provider details are never exposed.",
      "params": [],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "success",
        "code": 200,
        "message": "Request completed successfully",
        "data": {
          "result": "Provider response data"
        }
      },
      "responseSchema": [
        {
          "name": "data.result",
          "type": "object | array | string",
          "description": "Normalized response from the service."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-siputzx",
      "baseUrl": "https://api.siputzx.my.id",
      "providerPath": "/api/berita/liputan6",
      "paramsMap": {}
    },
    "normalizerId": "legacy-default-v1"
  },
  {
    "slug": "news-sindonews",
    "publicPath": "/api/v1/news/sindonews",
    "method": "GET",
    "categorySlug": "news",
    "kind": "provider",
    "paramSchemaId": "legacy-query-news-sindonews",
    "cacheTtlSeconds": 300,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 30
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "Sindonews Feed",
      "summary": "Fetch the latest headlines from Sindonews.",
      "description": "Fetch the latest headlines from Sindonews. Provider responses are normalized into the Kyyinfinite response envelope; provider details are never exposed.",
      "params": [],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "success",
        "code": 200,
        "message": "Request completed successfully",
        "data": {
          "result": "Provider response data"
        }
      },
      "responseSchema": [
        {
          "name": "data.result",
          "type": "object | array | string",
          "description": "Normalized response from the service."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-siputzx",
      "baseUrl": "https://api.siputzx.my.id",
      "providerPath": "/api/berita/sindonews",
      "paramsMap": {}
    },
    "normalizerId": "legacy-default-v1"
  },
  {
    "slug": "news-cnbcindonesia",
    "publicPath": "/api/v1/news/cnbcindonesia",
    "method": "GET",
    "categorySlug": "news",
    "kind": "provider",
    "paramSchemaId": "legacy-query-news-cnbcindonesia",
    "cacheTtlSeconds": 300,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 30
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "CNBC Indonesia Feed",
      "summary": "Fetch the latest headlines from CNBC Indonesia.",
      "description": "Fetch the latest headlines from CNBC Indonesia. Provider responses are normalized into the Kyyinfinite response envelope; provider details are never exposed.",
      "params": [],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "success",
        "code": 200,
        "message": "Request completed successfully",
        "data": {
          "result": "Provider response data"
        }
      },
      "responseSchema": [
        {
          "name": "data.result",
          "type": "object | array | string",
          "description": "Normalized response from the service."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-siputzx",
      "baseUrl": "https://api.siputzx.my.id",
      "providerPath": "/api/berita/cnbcindonesia",
      "paramsMap": {}
    },
    "normalizerId": "legacy-default-v1"
  },
  {
    "slug": "news-antara",
    "publicPath": "/api/v1/news/antara",
    "method": "GET",
    "categorySlug": "news",
    "kind": "provider",
    "paramSchemaId": "legacy-query-news-antara",
    "cacheTtlSeconds": 300,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 30
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "Antara News Feed",
      "summary": "Fetch the latest headlines from Antara News.",
      "description": "Fetch the latest headlines from Antara News. Provider responses are normalized into the Kyyinfinite response envelope; provider details are never exposed.",
      "params": [],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "success",
        "code": 200,
        "message": "Request completed successfully",
        "data": {
          "result": "Provider response data"
        }
      },
      "responseSchema": [
        {
          "name": "data.result",
          "type": "object | array | string",
          "description": "Normalized response from the service."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-siputzx",
      "baseUrl": "https://api.siputzx.my.id",
      "providerPath": "/api/berita/antara",
      "paramsMap": {}
    },
    "normalizerId": "legacy-default-v1"
  },
  {
    "slug": "info-cuaca",
    "publicPath": "/api/v1/info/cuaca",
    "method": "GET",
    "categorySlug": "information",
    "kind": "provider",
    "paramSchemaId": "legacy-query-info-cuaca",
    "cacheTtlSeconds": 900,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 30
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "Weather Lookup",
      "summary": "Fetch current weather for a location by name.",
      "description": "Fetch current weather for a location by name. Provider responses are normalized into the Kyyinfinite response envelope; provider details are never exposed.",
      "params": [
        {
          "name": "q",
          "type": "string",
          "required": true,
          "description": "Location name, e.g. pasiran jaya",
          "location": "query",
          "example": "Jakarta"
        }
      ],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "success",
        "code": 200,
        "message": "Request completed successfully",
        "data": {
          "result": "Provider response data"
        }
      },
      "responseSchema": [
        {
          "name": "data.result",
          "type": "object | array | string",
          "description": "Normalized response from the service."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-siputzx",
      "baseUrl": "https://api.siputzx.my.id",
      "providerPath": "/api/info/cuaca",
      "paramsMap": {
        "q": "q"
      }
    },
    "normalizerId": "legacy-default-v1"
  },
  {
    "slug": "info-bmkg",
    "publicPath": "/api/v1/info/bmkg",
    "method": "GET",
    "categorySlug": "information",
    "kind": "provider",
    "paramSchemaId": "legacy-query-info-bmkg",
    "cacheTtlSeconds": 900,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 30
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "BMKG Earthquake Info",
      "summary": "Fetch the latest earthquake data from BMKG (Indonesia meteorological agency).",
      "description": "Fetch the latest earthquake data from BMKG (Indonesia meteorological agency). Provider responses are normalized into the Kyyinfinite response envelope; provider details are never exposed.",
      "params": [],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "success",
        "code": 200,
        "message": "Request completed successfully",
        "data": {
          "result": "Provider response data"
        }
      },
      "responseSchema": [
        {
          "name": "data.result",
          "type": "object | array | string",
          "description": "Normalized response from the service."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-siputzx",
      "baseUrl": "https://api.siputzx.my.id",
      "providerPath": "/api/info/bmkg",
      "paramsMap": {}
    },
    "normalizerId": "legacy-default-v1"
  },
  {
    "slug": "info-jadwaltv",
    "publicPath": "/api/v1/info/jadwaltv",
    "method": "GET",
    "categorySlug": "information",
    "kind": "provider",
    "paramSchemaId": "legacy-query-info-jadwaltv",
    "cacheTtlSeconds": 900,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 30
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "TV Schedule Lookup",
      "summary": "Fetch today's broadcast schedule for a given Indonesian TV channel.",
      "description": "Fetch today's broadcast schedule for a given Indonesian TV channel. Provider responses are normalized into the Kyyinfinite response envelope; provider details are never exposed.",
      "params": [
        {
          "name": "channel",
          "type": "string",
          "required": true,
          "description": "Channel name, e.g. sctv",
          "location": "query",
          "example": "sctv"
        }
      ],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "success",
        "code": 200,
        "message": "Request completed successfully",
        "data": {
          "result": "Provider response data"
        }
      },
      "responseSchema": [
        {
          "name": "data.result",
          "type": "object | array | string",
          "description": "Normalized response from the service."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-siputzx",
      "baseUrl": "https://api.siputzx.my.id",
      "providerPath": "/api/info/jadwaltv",
      "paramsMap": {
        "channel": "channel"
      }
    },
    "normalizerId": "legacy-default-v1"
  },
  {
    "slug": "maker-photooxy",
    "publicPath": "/api/v1/maker/photooxy",
    "method": "GET",
    "categorySlug": "maker",
    "kind": "stream",
    "paramSchemaId": "legacy-query-maker-photooxy",
    "cacheTtlSeconds": 0,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 10
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "PhotoOxy Text Effect",
      "summary": "Render text into a PhotoOxy text-effect template image.",
      "description": "Render text into a PhotoOxy text-effect template image. The file bytes are streamed through Kyyinfinite; provider details are never exposed.",
      "params": [
        {
          "name": "url",
          "type": "string",
          "required": true,
          "description": "PhotoOxy template page URL",
          "location": "query",
          "example": "https://example.com/your-url"
        },
        {
          "name": "text1",
          "type": "string",
          "required": true,
          "description": "Text to render into the effect",
          "location": "query",
          "example": "YOUR_TEXT"
        }
      ],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "binary",
        "message": "Returns raw file bytes with the upstream content type; no JSON envelope."
      },
      "responseSchema": [
        {
          "name": "(binary)",
          "type": "file",
          "description": "Raw file bytes with the upstream content type."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-siputzx",
      "baseUrl": "https://api.siputzx.my.id",
      "providerPath": "/api/m/photooxy",
      "paramsMap": {
        "url": "url",
        "text1": "text1"
      }
    },
    "handlerId": "legacy-provider-stream"
  },
  {
    "slug": "maker-textpro",
    "publicPath": "/api/v1/maker/textpro",
    "method": "GET",
    "categorySlug": "maker",
    "kind": "stream",
    "paramSchemaId": "legacy-query-maker-textpro",
    "cacheTtlSeconds": 0,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 10
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "TextPro Text Effect",
      "summary": "Render text into a TextPro text-effect template image.",
      "description": "Render text into a TextPro text-effect template image. The file bytes are streamed through Kyyinfinite; provider details are never exposed.",
      "params": [
        {
          "name": "url",
          "type": "string",
          "required": true,
          "description": "TextPro template page URL",
          "location": "query",
          "example": "https://example.com/your-url"
        },
        {
          "name": "text1",
          "type": "string",
          "required": true,
          "description": "Text to render into the effect",
          "location": "query",
          "example": "YOUR_TEXT"
        }
      ],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "binary",
        "message": "Returns raw file bytes with the upstream content type; no JSON envelope."
      },
      "responseSchema": [
        {
          "name": "(binary)",
          "type": "file",
          "description": "Raw file bytes with the upstream content type."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-siputzx",
      "baseUrl": "https://api.siputzx.my.id",
      "providerPath": "/api/m/textpro",
      "paramsMap": {
        "url": "url",
        "text1": "text1"
      }
    },
    "handlerId": "legacy-provider-stream"
  },
  {
    "slug": "primbon-artinama",
    "publicPath": "/api/v1/primbon/artinama",
    "method": "GET",
    "categorySlug": "primbon",
    "kind": "provider",
    "paramSchemaId": "legacy-query-primbon-artinama",
    "cacheTtlSeconds": 0,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 30
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "Name Meaning Lookup",
      "summary": "Fetch the traditional meaning behind a given name.",
      "description": "Fetch the traditional meaning behind a given name. Provider responses are normalized into the Kyyinfinite response envelope; provider details are never exposed.",
      "params": [
        {
          "name": "nama",
          "type": "string",
          "required": true,
          "description": "Name to look up",
          "location": "query",
          "example": "YOUR_NAME"
        }
      ],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "success",
        "code": 200,
        "message": "Request completed successfully",
        "data": {
          "result": "Provider response data"
        }
      },
      "responseSchema": [
        {
          "name": "data.result",
          "type": "object | array | string",
          "description": "Normalized response from the service."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-siputzx",
      "baseUrl": "https://api.siputzx.my.id",
      "providerPath": "/api/primbon/artinama",
      "paramsMap": {
        "nama": "nama"
      }
    },
    "normalizerId": "legacy-default-v1"
  },
  {
    "slug": "primbon-nomorhoki",
    "publicPath": "/api/v1/primbon/nomorhoki",
    "method": "GET",
    "categorySlug": "primbon",
    "kind": "provider",
    "paramSchemaId": "legacy-query-primbon-nomorhoki",
    "cacheTtlSeconds": 0,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 30
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "Lucky Phone Number Reading",
      "summary": "Get a numerology-style reading for a phone number.",
      "description": "Get a numerology-style reading for a phone number. Provider responses are normalized into the Kyyinfinite response envelope; provider details are never exposed.",
      "params": [
        {
          "name": "phoneNumber",
          "type": "string",
          "required": true,
          "description": "Phone number, e.g. 6285658939117",
          "location": "query",
          "example": "6281234567890"
        }
      ],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "success",
        "code": 200,
        "message": "Request completed successfully",
        "data": {
          "result": "Provider response data"
        }
      },
      "responseSchema": [
        {
          "name": "data.result",
          "type": "object | array | string",
          "description": "Normalized response from the service."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-siputzx",
      "baseUrl": "https://api.siputzx.my.id",
      "providerPath": "/api/primbon/nomorhoki",
      "paramsMap": {
        "phoneNumber": "phoneNumber"
      }
    },
    "normalizerId": "legacy-default-v1"
  },
  {
    "slug": "primbon-tafsirmimpi",
    "publicPath": "/api/v1/primbon/tafsirmimpi",
    "method": "GET",
    "categorySlug": "primbon",
    "kind": "provider",
    "paramSchemaId": "legacy-query-primbon-tafsirmimpi",
    "cacheTtlSeconds": 0,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 30
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "Dream Interpretation",
      "summary": "Get a traditional interpretation for a dream keyword.",
      "description": "Get a traditional interpretation for a dream keyword. Provider responses are normalized into the Kyyinfinite response envelope; provider details are never exposed.",
      "params": [
        {
          "name": "mimpi",
          "type": "string",
          "required": true,
          "description": "Dream keyword, e.g. bertemu",
          "location": "query",
          "example": "bertemu"
        }
      ],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "success",
        "code": 200,
        "message": "Request completed successfully",
        "data": {
          "result": "Provider response data"
        }
      },
      "responseSchema": [
        {
          "name": "data.result",
          "type": "object | array | string",
          "description": "Normalized response from the service."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-siputzx",
      "baseUrl": "https://api.siputzx.my.id",
      "providerPath": "/api/primbon/tafsirmimpi",
      "paramsMap": {
        "mimpi": "mimpi"
      }
    },
    "normalizerId": "legacy-default-v1"
  },
  {
    "slug": "primbon-kecocokan-nama-pasangan",
    "publicPath": "/api/v1/primbon/kecocokan-nama-pasangan",
    "method": "GET",
    "categorySlug": "primbon",
    "kind": "provider",
    "paramSchemaId": "legacy-query-primbon-kecocokan-nama-pasangan",
    "cacheTtlSeconds": 0,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 30
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "Name Compatibility Reading",
      "summary": "Get a traditional compatibility reading between two names.",
      "description": "Get a traditional compatibility reading between two names. Provider responses are normalized into the Kyyinfinite response envelope; provider details are never exposed.",
      "params": [
        {
          "name": "nama1",
          "type": "string",
          "required": true,
          "description": "First name",
          "location": "query",
          "example": "YOUR_FIRST_NAME"
        },
        {
          "name": "nama2",
          "type": "string",
          "required": true,
          "description": "Second name",
          "location": "query",
          "example": "YOUR_SECOND_NAME"
        }
      ],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "success",
        "code": 200,
        "message": "Request completed successfully",
        "data": {
          "result": "Provider response data"
        }
      },
      "responseSchema": [
        {
          "name": "data.result",
          "type": "object | array | string",
          "description": "Normalized response from the service."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-siputzx",
      "baseUrl": "https://api.siputzx.my.id",
      "providerPath": "/api/primbon/kecocokan_nama_pasangan",
      "paramsMap": {
        "nama1": "nama1",
        "nama2": "nama2"
      }
    },
    "normalizerId": "legacy-default-v1"
  },
  {
    "slug": "maker-fakethreads",
    "publicPath": "/api/v1/maker/fakethreads",
    "method": "GET",
    "categorySlug": "maker",
    "kind": "stream",
    "paramSchemaId": "legacy-query-maker-fakethreads",
    "cacheTtlSeconds": 0,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 10
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "Fake Threads Post Maker",
      "summary": "Generate a fake Threads post screenshot with a custom username, avatar, text, and like count.",
      "description": "Generate a fake Threads post screenshot with a custom username, avatar, text, and like count. The file bytes are streamed through Kyyinfinite; provider details are never exposed.",
      "params": [
        {
          "name": "username",
          "type": "string",
          "required": true,
          "description": "Display username",
          "location": "query",
          "example": "YOUR_USERNAME"
        },
        {
          "name": "avatar",
          "type": "string",
          "required": true,
          "description": "Direct image URL for the avatar",
          "location": "query",
          "example": "https://www.threads.net/@username/post/POST_ID"
        },
        {
          "name": "text",
          "type": "string",
          "required": true,
          "description": "Post text",
          "location": "query",
          "example": "YOUR_TEXT"
        },
        {
          "name": "likes",
          "type": "string",
          "required": false,
          "description": "Like count to display, e.g. 10000",
          "location": "query",
          "example": "10000"
        }
      ],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "binary",
        "message": "Returns raw file bytes with the upstream content type; no JSON envelope."
      },
      "responseSchema": [
        {
          "name": "(binary)",
          "type": "file",
          "description": "Raw file bytes with the upstream content type."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-nexray",
      "baseUrl": "https://api.nexray.eu.cc",
      "providerPath": "/maker/fakethreads",
      "paramsMap": {
        "username": "username",
        "avatar": "avatar",
        "text": "text",
        "likes": "likes"
      }
    },
    "handlerId": "legacy-provider-stream"
  },
  {
    "slug": "maker-qc",
    "publicPath": "/api/v1/maker/qc",
    "method": "GET",
    "categorySlug": "maker",
    "kind": "stream",
    "paramSchemaId": "legacy-query-maker-qc",
    "cacheTtlSeconds": 0,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 10
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "Quote Card Maker",
      "summary": "Generate a phone-style quote card image with custom text, name, avatar, and color theme.",
      "description": "Generate a phone-style quote card image with custom text, name, avatar, and color theme. The file bytes are streamed through Kyyinfinite; provider details are never exposed.",
      "params": [
        {
          "name": "text",
          "type": "string",
          "required": true,
          "description": "Quote text",
          "location": "query",
          "example": "YOUR_TEXT"
        },
        {
          "name": "name",
          "type": "string",
          "required": true,
          "description": "Display name",
          "location": "query",
          "example": "Indonesia"
        },
        {
          "name": "avatar",
          "type": "string",
          "required": true,
          "description": "Direct image URL for the avatar",
          "location": "query",
          "example": "https://example.com/avatar.jpg"
        },
        {
          "name": "color",
          "type": "string",
          "required": false,
          "description": "Theme color, e.g. putih",
          "location": "query",
          "example": "putih"
        }
      ],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "binary",
        "message": "Returns raw file bytes with the upstream content type; no JSON envelope."
      },
      "responseSchema": [
        {
          "name": "(binary)",
          "type": "file",
          "description": "Raw file bytes with the upstream content type."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-nexray",
      "baseUrl": "https://api.nexray.eu.cc",
      "providerPath": "/maker/qc",
      "paramsMap": {
        "text": "text",
        "name": "name",
        "avatar": "avatar",
        "color": "color"
      }
    },
    "handlerId": "legacy-provider-stream"
  },
  {
    "slug": "maker-brathd",
    "publicPath": "/api/v1/maker/brathd",
    "method": "GET",
    "categorySlug": "maker",
    "kind": "stream",
    "paramSchemaId": "legacy-query-maker-brathd",
    "cacheTtlSeconds": 0,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 10
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "Brat Image Maker (HD)",
      "summary": "Generate a higher-resolution brat-style text image.",
      "description": "Generate a higher-resolution brat-style text image. The file bytes are streamed through Kyyinfinite; provider details are never exposed.",
      "params": [
        {
          "name": "text",
          "type": "string",
          "required": true,
          "description": "Text to render on the image",
          "location": "query",
          "example": "YOUR_TEXT"
        }
      ],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "binary",
        "message": "Returns raw file bytes with the upstream content type; no JSON envelope."
      },
      "responseSchema": [
        {
          "name": "(binary)",
          "type": "file",
          "description": "Raw file bytes with the upstream content type."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-nexray",
      "baseUrl": "https://api.nexray.eu.cc",
      "providerPath": "/maker/brathd",
      "paramsMap": {
        "text": "text"
      }
    },
    "handlerId": "legacy-provider-stream"
  },
  {
    "slug": "maker-bratvidhd",
    "publicPath": "/api/v1/maker/bratvidhd",
    "method": "GET",
    "categorySlug": "maker",
    "kind": "stream",
    "paramSchemaId": "legacy-query-maker-bratvidhd",
    "cacheTtlSeconds": 0,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 10
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "Brat Video Maker (HD)",
      "summary": "Generate a higher-resolution brat-style animated video.",
      "description": "Generate a higher-resolution brat-style animated video. The file bytes are streamed through Kyyinfinite; provider details are never exposed.",
      "params": [
        {
          "name": "text",
          "type": "string",
          "required": true,
          "description": "Text to render in the video",
          "location": "query",
          "example": "YOUR_TEXT"
        }
      ],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "binary",
        "message": "Returns raw file bytes with the upstream content type; no JSON envelope."
      },
      "responseSchema": [
        {
          "name": "(binary)",
          "type": "file",
          "description": "Raw file bytes with the upstream content type."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-nexray",
      "baseUrl": "https://api.nexray.eu.cc",
      "providerPath": "/maker/bratvidhd",
      "paramsMap": {
        "text": "text"
      }
    },
    "handlerId": "legacy-provider-stream"
  },
  {
    "slug": "random-anime",
    "publicPath": "/api/v1/random/anime",
    "method": "GET",
    "categorySlug": "random",
    "kind": "stream",
    "paramSchemaId": "legacy-query-random-anime",
    "cacheTtlSeconds": 0,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 10
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "Random Anime Image",
      "summary": "Fetch a random anime-style image by category.",
      "description": "Fetch a random anime-style image by category. The file bytes are streamed through Kyyinfinite; provider details are never exposed.",
      "params": [
        {
          "name": "type",
          "type": "string",
          "required": true,
          "description": "Category, e.g. waifu",
          "location": "query",
          "example": "waifu"
        }
      ],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "binary",
        "message": "Returns raw file bytes with the upstream content type; no JSON envelope."
      },
      "responseSchema": [
        {
          "name": "(binary)",
          "type": "file",
          "description": "Raw file bytes with the upstream content type."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-nexray",
      "baseUrl": "https://api.nexray.eu.cc",
      "providerPath": "/random/anime",
      "paramsMap": {
        "type": "type"
      }
    },
    "handlerId": "legacy-provider-stream"
  },
  {
    "slug": "random-ba",
    "publicPath": "/api/v1/random/ba",
    "method": "GET",
    "categorySlug": "random",
    "kind": "stream",
    "paramSchemaId": "legacy-query-random-ba",
    "cacheTtlSeconds": 0,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 10
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "Random Blue Archive Image",
      "summary": "Fetch a random Blue Archive character image.",
      "description": "Fetch a random Blue Archive character image. The file bytes are streamed through Kyyinfinite; provider details are never exposed.",
      "params": [],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "binary",
        "message": "Returns raw file bytes with the upstream content type; no JSON envelope."
      },
      "responseSchema": [
        {
          "name": "(binary)",
          "type": "file",
          "description": "Raw file bytes with the upstream content type."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-nexray",
      "baseUrl": "https://api.nexray.eu.cc",
      "providerPath": "/random/ba",
      "paramsMap": {}
    },
    "handlerId": "legacy-provider-stream"
  },
  {
    "slug": "stalker-tiktok",
    "publicPath": "/api/v1/stalker/tiktok",
    "method": "GET",
    "categorySlug": "stalker",
    "kind": "provider",
    "paramSchemaId": "legacy-query-stalker-tiktok",
    "cacheTtlSeconds": 0,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 30
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "TikTok Profile Lookup",
      "summary": "Fetch public profile info for a TikTok username.",
      "description": "Fetch public profile info for a TikTok username. Provider responses are normalized into the Kyyinfinite response envelope; provider details are never exposed.",
      "params": [
        {
          "name": "username",
          "type": "string",
          "required": true,
          "description": "TikTok username",
          "location": "query",
          "example": "YOUR_USERNAME"
        }
      ],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "success",
        "code": 200,
        "message": "Request completed successfully",
        "data": {
          "result": "Provider response data"
        }
      },
      "responseSchema": [
        {
          "name": "data.result",
          "type": "object | array | string",
          "description": "Normalized response from the service."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-nexray",
      "baseUrl": "https://api.nexray.eu.cc",
      "providerPath": "/stalker/tiktok",
      "paramsMap": {
        "username": "username"
      }
    },
    "normalizerId": "legacy-default-v1"
  },
  {
    "slug": "stalker-twitter",
    "publicPath": "/api/v1/stalker/twitter",
    "method": "GET",
    "categorySlug": "stalker",
    "kind": "provider",
    "paramSchemaId": "legacy-query-stalker-twitter",
    "cacheTtlSeconds": 0,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 30
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "Twitter/X Profile Lookup",
      "summary": "Fetch public profile info for a Twitter/X username.",
      "description": "Fetch public profile info for a Twitter/X username. Provider responses are normalized into the Kyyinfinite response envelope; provider details are never exposed.",
      "params": [
        {
          "name": "username",
          "type": "string",
          "required": true,
          "description": "Twitter/X username",
          "location": "query",
          "example": "YOUR_USERNAME"
        }
      ],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "success",
        "code": 200,
        "message": "Request completed successfully",
        "data": {
          "result": "Provider response data"
        }
      },
      "responseSchema": [
        {
          "name": "data.result",
          "type": "object | array | string",
          "description": "Normalized response from the service."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-nexray",
      "baseUrl": "https://api.nexray.eu.cc",
      "providerPath": "/stalker/twitter",
      "paramsMap": {
        "username": "username"
      }
    },
    "normalizerId": "legacy-default-v1"
  },
  {
    "slug": "stalker-youtube",
    "publicPath": "/api/v1/stalker/youtube",
    "method": "GET",
    "categorySlug": "stalker",
    "kind": "provider",
    "paramSchemaId": "legacy-query-stalker-youtube",
    "cacheTtlSeconds": 0,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 30
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "YouTube Channel Lookup",
      "summary": "Fetch public channel info for a YouTube username/handle.",
      "description": "Fetch public channel info for a YouTube username/handle. Provider responses are normalized into the Kyyinfinite response envelope; provider details are never exposed.",
      "params": [
        {
          "name": "username",
          "type": "string",
          "required": true,
          "description": "YouTube username or handle",
          "location": "query",
          "example": "YOUR_USERNAME"
        }
      ],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "success",
        "code": 200,
        "message": "Request completed successfully",
        "data": {
          "result": "Provider response data"
        }
      },
      "responseSchema": [
        {
          "name": "data.result",
          "type": "object | array | string",
          "description": "Normalized response from the service."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-nexray",
      "baseUrl": "https://api.nexray.eu.cc",
      "providerPath": "/stalker/youtube",
      "paramsMap": {
        "username": "username"
      }
    },
    "normalizerId": "legacy-default-v1"
  },
  {
    "slug": "stalker-roblox",
    "publicPath": "/api/v1/stalker/roblox",
    "method": "GET",
    "categorySlug": "stalker",
    "kind": "provider",
    "paramSchemaId": "legacy-query-stalker-roblox",
    "cacheTtlSeconds": 0,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 30
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "Roblox Profile Lookup",
      "summary": "Fetch public profile info for a Roblox username.",
      "description": "Fetch public profile info for a Roblox username. Provider responses are normalized into the Kyyinfinite response envelope; provider details are never exposed.",
      "params": [
        {
          "name": "username",
          "type": "string",
          "required": true,
          "description": "Roblox username",
          "location": "query",
          "example": "YOUR_USERNAME"
        }
      ],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "success",
        "code": 200,
        "message": "Request completed successfully",
        "data": {
          "result": "Provider response data"
        }
      },
      "responseSchema": [
        {
          "name": "data.result",
          "type": "object | array | string",
          "description": "Normalized response from the service."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-nexray",
      "baseUrl": "https://api.nexray.eu.cc",
      "providerPath": "/stalker/roblox",
      "paramsMap": {
        "username": "username"
      }
    },
    "normalizerId": "legacy-default-v1"
  },
  {
    "slug": "stalker-pinterest",
    "publicPath": "/api/v1/stalker/pinterest",
    "method": "GET",
    "categorySlug": "stalker",
    "kind": "provider",
    "paramSchemaId": "legacy-query-stalker-pinterest",
    "cacheTtlSeconds": 0,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 30
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "Pinterest Profile Lookup",
      "summary": "Fetch public profile info for a Pinterest username.",
      "description": "Fetch public profile info for a Pinterest username. Provider responses are normalized into the Kyyinfinite response envelope; provider details are never exposed.",
      "params": [
        {
          "name": "username",
          "type": "string",
          "required": true,
          "description": "Pinterest username",
          "location": "query",
          "example": "YOUR_USERNAME"
        }
      ],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "success",
        "code": 200,
        "message": "Request completed successfully",
        "data": {
          "result": "Provider response data"
        }
      },
      "responseSchema": [
        {
          "name": "data.result",
          "type": "object | array | string",
          "description": "Normalized response from the service."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-nexray",
      "baseUrl": "https://api.nexray.eu.cc",
      "providerPath": "/stalker/pinterest",
      "paramsMap": {
        "username": "username"
      }
    },
    "normalizerId": "legacy-default-v1"
  },
  {
    "slug": "stalker-github",
    "publicPath": "/api/v1/stalker/github",
    "method": "GET",
    "categorySlug": "stalker",
    "kind": "provider",
    "paramSchemaId": "legacy-query-stalker-github",
    "cacheTtlSeconds": 0,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 30
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "GitHub Profile Lookup",
      "summary": "Fetch public profile info for a GitHub username.",
      "description": "Fetch public profile info for a GitHub username. Provider responses are normalized into the Kyyinfinite response envelope; provider details are never exposed.",
      "params": [
        {
          "name": "username",
          "type": "string",
          "required": true,
          "description": "GitHub username",
          "location": "query",
          "example": "YOUR_USERNAME"
        }
      ],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "success",
        "code": 200,
        "message": "Request completed successfully",
        "data": {
          "result": "Provider response data"
        }
      },
      "responseSchema": [
        {
          "name": "data.result",
          "type": "object | array | string",
          "description": "Normalized response from the service."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-nexray",
      "baseUrl": "https://api.nexray.eu.cc",
      "providerPath": "/stalker/github",
      "paramsMap": {
        "username": "username"
      }
    },
    "normalizerId": "legacy-default-v1"
  },
  {
    "slug": "stalker-genshin",
    "publicPath": "/api/v1/stalker/genshin",
    "method": "GET",
    "categorySlug": "stalker",
    "kind": "provider",
    "paramSchemaId": "legacy-query-stalker-genshin",
    "cacheTtlSeconds": 300,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 30
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "Genshin Impact Profile Lookup",
      "summary": "Look up a public Genshin Impact player profile by UID.",
      "description": "Look up a public Genshin Impact player profile by UID. Provider responses are normalized into the Kyyinfinite response envelope; provider details are never exposed.",
      "params": [
        {
          "name": "uid",
          "type": "string",
          "required": true,
          "description": "Genshin Impact player UID",
          "location": "query",
          "example": "YOUR_PLAYER_UID"
        }
      ],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "success",
        "code": 200,
        "message": "Request completed successfully",
        "data": {
          "result": "Provider response data"
        }
      },
      "responseSchema": [
        {
          "name": "data.result",
          "type": "object | array | string",
          "description": "Normalized response from the service."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-nexray",
      "baseUrl": "https://api.nexray.eu.cc",
      "providerPath": "/stalker/genshin",
      "paramsMap": {
        "uid": "uid"
      }
    },
    "normalizerId": "legacy-default-v1"
  },
  {
    "slug": "anime-anichin-home",
    "publicPath": "/api/v1/anime/anichin/home",
    "method": "GET",
    "categorySlug": "anime",
    "kind": "provider",
    "paramSchemaId": "legacy-query-anime-anichin-home",
    "cacheTtlSeconds": 300,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 30
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "Anichin Home Feed",
      "summary": "Fetch Anichin's homepage feed of latest and trending titles.",
      "description": "Fetch Anichin's homepage feed of latest and trending titles. Provider responses are normalized into the Kyyinfinite response envelope; provider details are never exposed.",
      "params": [],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "success",
        "code": 200,
        "message": "Request completed successfully",
        "data": {
          "result": "Provider response data"
        }
      },
      "responseSchema": [
        {
          "name": "data.result",
          "type": "object | array | string",
          "description": "Normalized response from the service."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-nexray",
      "baseUrl": "https://api.nexray.eu.cc",
      "providerPath": "/anime/anichin/home",
      "paramsMap": {}
    },
    "normalizerId": "legacy-default-v1"
  },
  {
    "slug": "anime-anichin-schedule",
    "publicPath": "/api/v1/anime/anichin/schedule",
    "method": "GET",
    "categorySlug": "anime",
    "kind": "provider",
    "paramSchemaId": "legacy-query-anime-anichin-schedule",
    "cacheTtlSeconds": 600,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 30
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "Anichin Release Schedule",
      "summary": "Fetch the weekly release schedule for ongoing Anichin titles.",
      "description": "Fetch the weekly release schedule for ongoing Anichin titles. Provider responses are normalized into the Kyyinfinite response envelope; provider details are never exposed.",
      "params": [],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "success",
        "code": 200,
        "message": "Request completed successfully",
        "data": {
          "result": "Provider response data"
        }
      },
      "responseSchema": [
        {
          "name": "data.result",
          "type": "object | array | string",
          "description": "Normalized response from the service."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-nexray",
      "baseUrl": "https://api.nexray.eu.cc",
      "providerPath": "/anime/anichin/schedule",
      "paramsMap": {}
    },
    "normalizerId": "legacy-default-v1"
  },
  {
    "slug": "anime-anichin-genres",
    "publicPath": "/api/v1/anime/anichin/genres",
    "method": "GET",
    "categorySlug": "anime",
    "kind": "provider",
    "paramSchemaId": "legacy-query-anime-anichin-genres",
    "cacheTtlSeconds": 3600,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 30
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "Anichin Genre List (All)",
      "summary": "List every genre available on Anichin.",
      "description": "List every genre available on Anichin. Provider responses are normalized into the Kyyinfinite response envelope; provider details are never exposed.",
      "params": [],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "success",
        "code": 200,
        "message": "Request completed successfully",
        "data": {
          "result": "Provider response data"
        }
      },
      "responseSchema": [
        {
          "name": "data.result",
          "type": "object | array | string",
          "description": "Normalized response from the service."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-nexray",
      "baseUrl": "https://api.nexray.eu.cc",
      "providerPath": "/anime/anichin/genres",
      "paramsMap": {}
    },
    "normalizerId": "legacy-default-v1"
  },
  {
    "slug": "anime-anichin-genre",
    "publicPath": "/api/v1/anime/anichin/genre",
    "method": "GET",
    "categorySlug": "anime",
    "kind": "provider",
    "paramSchemaId": "legacy-query-anime-anichin-genre",
    "cacheTtlSeconds": 300,
    "rateLimit": {
      "windowSeconds": 60,
      "max": 30
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "Anichin Titles by Genre",
      "summary": "Browse Anichin titles filtered by genre, paginated.",
      "description": "Browse Anichin titles filtered by genre, paginated. Provider responses are normalized into the Kyyinfinite response envelope; provider details are never exposed.",
      "params": [
        {
          "name": "slug",
          "type": "string",
          "required": true,
          "description": "Genre slug, e.g. action",
          "location": "query",
          "example": "action"
        },
        {
          "name": "page",
          "type": "string",
          "required": false,
          "description": "Page number, defaults to 1",
          "location": "query",
          "example": 1
        }
      ],
      "headers": [],
      "requestExample": null,
      "responseExample": {
        "status": "success",
        "code": 200,
        "message": "Request completed successfully",
        "data": {
          "result": "Provider response data"
        }
      },
      "responseSchema": [
        {
          "name": "data.result",
          "type": "object | array | string",
          "description": "Normalized response from the service."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "One or more query parameters are missing or invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Too many requests in the current window."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The upstream service returned an invalid response."
        },
        {
          "code": 504,
          "name": "UPSTREAM_TIMEOUT",
          "description": "The upstream service took too long to respond."
        },
        {
          "code": 500,
          "name": "INTERNAL_ERROR",
          "description": "An unexpected platform error occurred."
        }
      ]
    },
    "provider": {
      "internalName": "legacy-nexray",
      "baseUrl": "https://api.nexray.eu.cc",
      "providerPath": "/anime/anichin/genre",
      "paramsMap": {
        "slug": "slug",
        "page": "page"
      }
    },
    "normalizerId": "legacy-default-v1"
  },
  {
    "slug": "alight-motion-send",
    "publicPath": "/api/v1/am/send",
    "method": "POST",
    "categorySlug": "ai",
    "kind": "native",
    "handlerId": "alight-motion-send",
    "paramSchemaId": "alight-motion-send-body",
    "cacheTtlSeconds": 0,
    "rateLimit": {
      "windowSeconds": 86400,
      "max": 10
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "Alight Motion: Send Activation Link",
      "summary": "Sends an Alight Motion Pro verification link by email.",
      "description": "Sends an Alight Motion Pro verification link by email. This endpoint is public and does not require a Kyyinfinite API key. Server-side provider credentials are required.",
      "params": [
        {
          "name": "email",
          "type": "string",
          "required": true,
          "description": "Customer's email address",
          "location": "body",
          "example": "YOUR_EMAIL_ADDRESS"
        }
      ],
      "headers": [
        {
          "name": "Content-Type",
          "required": true,
          "description": "Must be application/json."
        }
      ],
      "requestExample": {
        "email": "customer@example.com"
      },
      "responseExample": {
        "status": "success",
        "code": 200,
        "message": "Request completed successfully",
        "data": {
          "result": "Provider response"
        }
      },
      "responseSchema": [
        {
          "name": "data.result",
          "type": "object",
          "description": "Activation service response."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "The request body is invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Daily request limit reached."
        },
        {
          "code": 503,
          "name": "SERVICE_UNAVAILABLE",
          "description": "The activation provider is not configured."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The activation provider returned an error."
        }
      ]
    }
  },
  {
    "slug": "alight-motion-verify",
    "publicPath": "/api/v1/am/verify",
    "method": "POST",
    "categorySlug": "ai",
    "kind": "native",
    "handlerId": "alight-motion-verify",
    "paramSchemaId": "alight-motion-verify-body",
    "cacheTtlSeconds": 0,
    "rateLimit": {
      "windowSeconds": 86400,
      "max": 10
    },
    "listed": true,
    "lifecycle": "active",
    "docs": {
      "title": "Alight Motion: Verify Activation",
      "summary": "Verifies the Alight Motion activation link and activates the account.",
      "description": "Verifies the Alight Motion activation link and activates the account. This endpoint is public and does not require a Kyyinfinite API key. Server-side provider credentials are required.",
      "params": [
        {
          "name": "email",
          "type": "string",
          "required": true,
          "description": "Customer's email address",
          "location": "body",
          "example": "YOUR_EMAIL_ADDRESS"
        },
        {
          "name": "link",
          "type": "string",
          "required": true,
          "description": "Verification link from the email",
          "location": "body",
          "example": "YOUR_VERIFICATION_LINK"
        }
      ],
      "headers": [
        {
          "name": "Content-Type",
          "required": true,
          "description": "Must be application/json."
        }
      ],
      "requestExample": {
        "email": "customer@example.com",
        "link": "https://example.com/verify"
      },
      "responseExample": {
        "status": "success",
        "code": 200,
        "message": "Request completed successfully",
        "data": {
          "result": "Provider response"
        }
      },
      "responseSchema": [
        {
          "name": "data.result",
          "type": "object",
          "description": "Activation service response."
        }
      ],
      "errorCodes": [
        {
          "code": 400,
          "name": "INVALID_PARAMS",
          "description": "The request body is invalid."
        },
        {
          "code": 429,
          "name": "RATE_LIMITED",
          "description": "Daily request limit reached."
        },
        {
          "code": 503,
          "name": "SERVICE_UNAVAILABLE",
          "description": "The activation provider is not configured."
        },
        {
          "code": 502,
          "name": "UPSTREAM_ERROR",
          "description": "The activation provider returned an error."
        }
      ]
    }
  },
  {
    slug: 'ai-deepsearch',
    publicPath: '/api/v1/ai/deepsearch',
    method: 'GET',
    categorySlug: 'ai',
    kind: 'provider',
    paramSchemaId: 'legacy-query-ai-deepsearch',
    cacheTtlSeconds: 0,
    rateLimit: { windowSeconds: 60, max: 10 },
    listed: true,
    lifecycle: 'active',
    docs: {
      title: 'DeepSearch',
      summary: 'Send a prompt to DeepSearch and return its response.',
      description: 'Send a prompt to DeepSearch and return its response. Provider responses are normalized into the Kyyinfinite response envelope.',
      params: [{ name: 'text', type: 'string', required: true, description: 'Prompt to send', location: 'query', example: 'YOUR_TEXT' }],
      headers: [],
      requestExample: null,
      responseExample: { status: 'success', code: 200, message: 'Request completed successfully', data: { status: true, result: 'Provider response' } },
      responseSchema: [{ name: 'data.result', type: 'object | array | string', description: 'Normalized response from the service.' }],
      errorCodes: [
        { code: 400, name: 'INVALID_PARAMS', description: 'One or more query parameters are missing or invalid.' },
        { code: 429, name: 'RATE_LIMITED', description: 'Too many requests in the current window.' },
        { code: 502, name: 'UPSTREAM_ERROR', description: 'The upstream service returned an invalid response.' },
        { code: 504, name: 'UPSTREAM_TIMEOUT', description: 'The upstream service took too long to respond.' },
        { code: 500, name: 'INTERNAL_ERROR', description: 'An unexpected platform error occurred.' },
      ],
    },
    provider: {
      internalName: 'legacy-nexray',
      baseUrl: 'https://api.nexray.eu.cc',
      providerPath: '/ai/deepsearch',
      paramsMap: { text: 'text' },
    },
    normalizerId: 'legacy-default-v1',
  },
  {
    slug: 'ai-gemini',
    publicPath: '/api/v1/ai/gemini',
    method: 'GET',
    categorySlug: 'ai',
    kind: 'provider',
    paramSchemaId: 'legacy-query-ai-gemini',
    cacheTtlSeconds: 0,
    rateLimit: { windowSeconds: 60, max: 10 },
    listed: true,
    lifecycle: 'active',
    docs: {
      title: 'Gemini',
      summary: 'Send a prompt to Gemini and return its response.',
      description: 'Send a prompt to Gemini and return its response. Provider responses are normalized into the Kyyinfinite response envelope.',
      params: [{ name: 'text', type: 'string', required: true, description: 'Prompt to send', location: 'query', example: 'YOUR_TEXT' }],
      headers: [],
      requestExample: null,
      responseExample: { status: 'success', code: 200, message: 'Request completed successfully', data: { status: true, result: 'Provider response' } },
      responseSchema: [{ name: 'data.result', type: 'object | array | string', description: 'Normalized response from the service.' }],
      errorCodes: [
        { code: 400, name: 'INVALID_PARAMS', description: 'One or more query parameters are missing or invalid.' },
        { code: 429, name: 'RATE_LIMITED', description: 'Too many requests in the current window.' },
        { code: 502, name: 'UPSTREAM_ERROR', description: 'The upstream service returned an invalid response.' },
        { code: 504, name: 'UPSTREAM_TIMEOUT', description: 'The upstream service took too long to respond.' },
        { code: 500, name: 'INTERNAL_ERROR', description: 'An unexpected platform error occurred.' },
      ],
    },
    provider: {
      internalName: 'legacy-nexray',
      baseUrl: 'https://api.nexray.eu.cc',
      providerPath: '/ai/gemini',
      paramsMap: { text: 'text' },
    },
    normalizerId: 'legacy-default-v1',
  },
] as EndpointDefinition[]
