import type { ApiEndpoint } from '@/services/api/api.types'

export const endpoints: ApiEndpoint[] = [
  {
    id: 'ai-chat',
    category: 'ai',
    title: 'AI Chat',
    summary: 'Generate a conversational completion for a prompt.',
    description:
      'Sends a prompt to the Kyyinfinite text engine and returns a single conversational completion. The prompt is processed by the platform model and answered in a consistent envelope.',
    method: 'POST',
    path: '/api/v1/ai/chat',
    auth: 'none',
    free: true,
    params: [
      {
        name: 'prompt',
        type: 'string',
        required: true,
        description: 'The user prompt to complete.',
        location: 'query',
        example: 'Explain APIs in one sentence',
      },
      {
        name: 'lang',
        type: 'enum',
        required: false,
        description: 'Response language.',
        location: 'query',
        enumValues: ['en', 'id'],
        example: 'en',
      },
    ],
    headers: [
      { name: 'Content-Type', required: true, description: 'Must be application/json.' },
      { name: 'Accept', required: false, description: 'Application/json by default.' },
    ],
    requestExample: { prompt: 'Explain APIs in one sentence', lang: 'en' },
    responseExample: {
      status: 'success',
      code: 200,
      data: {
        reply: 'An API lets one program ask another program for data or actions over the network.',
        model: 'kyyinfinite-lite',
        tokens: 18,
      },
    },
    responseSchema: [
      { name: 'status', type: 'string', description: 'Result status, always success or error.' },
      { name: 'code', type: 'number', description: 'HTTP-equivalent status code.' },
      { name: 'data.reply', type: 'string', description: 'Generated completion text.' },
      { name: 'data.model', type: 'string', description: 'Model identifier used for the completion.' },
      { name: 'data.tokens', type: 'number', description: 'Approximate token count of the reply.' },
    ],
    errorCodes: [
      { code: 400, name: 'BAD_REQUEST', description: 'The prompt parameter is missing or empty.' },
      { code: 429, name: 'RATE_LIMITED', description: 'Too many requests in the current window.' },
    ],
  },
  {
    id: 'ai-summarize',
    category: 'ai',
    title: 'Text Summarizer',
    summary: 'Condense long text into a short summary.',
    description:
      'Accepts a block of text and returns a condensed summary. Useful for article digests, chat transcripts, and documentation overviews.',
    method: 'POST',
    path: '/api/v1/ai/summarize',
    auth: 'none',
    free: true,
    params: [
      { name: 'text', type: 'string', required: true, description: 'Text to summarize.', location: 'query', example: 'A long article body…' },
      { name: 'sentences', type: 'number', required: false, description: 'Target summary length in sentences.', location: 'query', example: 3 },
    ],
    headers: [{ name: 'Content-Type', required: true, description: 'Must be application/json.' }],
    requestExample: { text: 'A long article body…', sentences: 3 },
    responseExample: {
      status: 'success',
      code: 200,
      data: { summary: 'Short digest of the input.', sentences: 1 },
    },
    responseSchema: [
      { name: 'data.summary', type: 'string', description: 'Generated summary.' },
      { name: 'data.sentences', type: 'number', description: 'Number of sentences produced.' },
    ],
    errorCodes: [{ code: 400, name: 'BAD_REQUEST', description: 'The text parameter is missing.' }],
  },
  {
    id: 'ai-tools-info',
    category: 'ai',
    title: 'Tools Info',
    summary: 'Platform welcome and service metadata.',
    description:
      'Returns the canonical Kyyinfinite welcome envelope. Commonly used as a health and integration smoke test.',
    method: 'GET',
    path: '/api/v1/tools/info',
    auth: 'none',
    free: true,
    params: [],
    headers: [],
    requestExample: null,
    responseExample: {
      status: 'success',
      message: 'Welcome to Kyyinfinite',
      free: true,
    },
    responseSchema: [
      { name: 'status', type: 'string', description: 'Result status.' },
      { name: 'message', type: 'string', description: 'Welcome message.' },
      { name: 'free', type: 'boolean', description: 'Always true. Every endpoint is free.' },
    ],
    errorCodes: [{ code: 500, name: 'INTERNAL', description: 'Unexpected server error.' }],
  },
  {
    id: 'downloader-info',
    category: 'downloader',
    title: 'Downloader Info',
    summary: 'List supported media sources.',
    description:
      'Enumerates the media sources the downloader pipeline currently accepts, together with their media types.',
    method: 'GET',
    path: '/api/v1/downloader/info',
    auth: 'none',
    free: true,
    params: [],
    headers: [],
    requestExample: null,
    responseExample: {
      status: 'success',
      code: 200,
      data: {
        sources: ['video', 'audio', 'image'],
        max_file_mb: 128,
      },
    },
    responseSchema: [
      { name: 'data.sources', type: 'array', description: 'Supported source kinds.' },
      { name: 'data.max_file_mb', type: 'number', description: 'Maximum media size in megabytes.' },
    ],
    errorCodes: [{ code: 500, name: 'INTERNAL', description: 'Unexpected server error.' }],
  },
  {
    id: 'downloader-fetch',
    category: 'downloader',
    title: 'Media Fetch',
    summary: 'Resolve a media link into download formats.',
    description:
      'Given a public media URL, resolves the available download formats, durations, and direct links without storing any media server-side.',
    method: 'GET',
    path: '/api/v1/downloader/fetch',
    auth: 'none',
    free: true,
    params: [
      { name: 'url', type: 'string', required: true, description: 'Public media URL to resolve.', location: 'query', example: 'https://example.com/watch?v=abc' },
      { name: 'format', type: 'enum', required: false, description: 'Preferred output format.', location: 'query', enumValues: ['mp4', 'mp3', 'auto'], example: 'auto' },
    ],
    headers: [],
    requestExample: null,
    responseExample: {
      status: 'success',
      code: 200,
      data: {
        title: 'Example media title',
        duration_s: 214,
        formats: [
          { format: 'mp4', quality: '720p', size_mb: 48.2 },
          { format: 'mp3', quality: '128kbps', size_mb: 3.4 },
        ],
      },
    },
    responseSchema: [
      { name: 'data.title', type: 'string', description: 'Resolved media title.' },
      { name: 'data.duration_s', type: 'number', description: 'Duration in seconds.' },
      { name: 'data.formats', type: 'array', description: 'Available download formats.' },
    ],
    errorCodes: [
      { code: 400, name: 'BAD_REQUEST', description: 'The url parameter is missing or malformed.' },
      { code: 422, name: 'UNSUPPORTED', description: 'The source is not supported yet.' },
    ],
  },
  {
    id: 'search-web',
    category: 'search',
    title: 'Web Search',
    summary: 'Search the public web and return ranked results.',
    description:
      'Performs a web search for the given query and returns ranked organic results with title, URL, and snippet.',
    method: 'GET',
    path: '/api/v1/search/web',
    auth: 'none',
    free: true,
    params: [
      { name: 'q', type: 'string', required: true, description: 'Search query.', location: 'query', example: 'free public apis' },
      { name: 'limit', type: 'number', required: false, description: 'Maximum number of results.', location: 'query', example: 5 },
    ],
    headers: [],
    requestExample: null,
    responseExample: {
      status: 'success',
      code: 200,
      data: {
        query: 'free public apis',
        results: [
          { title: 'Kyyinfinite: Free APIs', url: 'https://kyyinfinite.example', snippet: 'A free API ecosystem for developers.' },
          { title: 'Public API directories', url: 'https://example.com/apis', snippet: 'Curated lists of open APIs.' },
        ],
      },
    },
    responseSchema: [
      { name: 'data.query', type: 'string', description: 'Echo of the search query.' },
      { name: 'data.results', type: 'array', description: 'Ranked search results.' },
    ],
    errorCodes: [
      { code: 400, name: 'BAD_REQUEST', description: 'The q parameter is missing.' },
      { code: 429, name: 'RATE_LIMITED', description: 'Too many requests in the current window.' },
    ],
  },
  {
    id: 'search-images',
    category: 'search',
    title: 'Image Search',
    summary: 'Find images across the open web.',
    description:
      'Returns image results for a query, including thumbnail and full-size URLs plus dimension metadata.',
    method: 'GET',
    path: '/api/v1/search/images',
    auth: 'none',
    free: true,
    params: [
      { name: 'q', type: 'string', required: true, description: 'Image search query.', location: 'query', example: 'satellite' },
      { name: 'safe', type: 'boolean', required: false, description: 'Enable safe filtering.', location: 'query', example: true },
    ],
    headers: [],
    requestExample: null,
    responseExample: {
      status: 'success',
      code: 200,
      data: {
        results: [
          { title: 'Satellite over Earth', url: 'https://images.example/satellite.jpg', width: 1920, height: 1080 },
        ],
      },
    },
    responseSchema: [
      { name: 'data.results', type: 'array', description: 'Image search results.' },
      { name: 'data.results[].width', type: 'number', description: 'Image width in pixels.' },
    ],
    errorCodes: [{ code: 400, name: 'BAD_REQUEST', description: 'The q parameter is missing.' }],
  },
  {
    id: 'image-metadata',
    category: 'image',
    title: 'Image Metadata',
    summary: 'Extract dimensions, format, and palette.',
    description:
      'Reads technical metadata from a public image URL: format, dimensions, aspect ratio, and dominant colors.',
    method: 'GET',
    path: '/api/v1/image/metadata',
    auth: 'none',
    free: true,
    params: [
      { name: 'url', type: 'string', required: true, description: 'Public image URL.', location: 'query', example: 'https://example.com/photo.jpg' },
    ],
    headers: [],
    requestExample: null,
    responseExample: {
      status: 'success',
      code: 200,
      data: {
        format: 'jpeg',
        width: 1920,
        height: 1080,
        aspect: '16:9',
        palette: ['#111827', '#3457D5', '#F2F0E9'],
      },
    },
    responseSchema: [
      { name: 'data.format', type: 'string', description: 'Detected image format.' },
      { name: 'data.width', type: 'number', description: 'Width in pixels.' },
      { name: 'data.height', type: 'number', description: 'Height in pixels.' },
      { name: 'data.palette', type: 'array', description: 'Dominant colors as hex values.' },
    ],
    errorCodes: [
      { code: 400, name: 'BAD_REQUEST', description: 'The url parameter is missing.' },
      { code: 422, name: 'UNSUPPORTED', description: 'The image format is not supported.' },
    ],
  },
  {
    id: 'image-compress',
    category: 'image',
    title: 'Image Compress',
    summary: 'Reduce image size with quality control.',
    description:
      'Compresses a public image URL to the requested quality and returns the optimized image details.',
    method: 'POST',
    path: '/api/v1/image/compress',
    auth: 'none',
    free: true,
    params: [
      { name: 'url', type: 'string', required: true, description: 'Public image URL.', location: 'query', example: 'https://example.com/photo.jpg' },
      { name: 'quality', type: 'number', required: false, description: 'Quality from 1 to 100.', location: 'query', example: 75 },
    ],
    headers: [{ name: 'Content-Type', required: true, description: 'Must be application/json.' }],
    requestExample: { url: 'https://example.com/photo.jpg', quality: 75 },
    responseExample: {
      status: 'success',
      code: 200,
      data: { output_url: 'https://cdn.example/compressed.jpg', original_kb: 820, optimized_kb: 214 },
    },
    responseSchema: [
      { name: 'data.output_url', type: 'string', description: 'Optimized image URL.' },
      { name: 'data.original_kb', type: 'number', description: 'Original size in kilobytes.' },
      { name: 'data.optimized_kb', type: 'number', description: 'Optimized size in kilobytes.' },
    ],
    errorCodes: [{ code: 422, name: 'UNSUPPORTED', description: 'The image format is not supported.' }],
  },
  {
    id: 'whatsapp-status',
    category: 'whatsapp',
    title: 'WhatsApp Status',
    summary: 'Availability of the WhatsApp bridge.',
    description:
      'Reports whether the WhatsApp utilities bridge is currently connected and accepting jobs.',
    method: 'GET',
    path: '/api/v1/whatsapp/status',
    auth: 'none',
    free: true,
    params: [],
    headers: [],
    requestExample: null,
    responseExample: {
      status: 'success',
      code: 200,
      data: { connected: true, uptime_hours: 731, region: 'global' },
    },
    responseSchema: [
      { name: 'data.connected', type: 'boolean', description: 'Bridge connection state.' },
      { name: 'data.uptime_hours', type: 'number', description: 'Current uptime in hours.' },
    ],
    errorCodes: [{ code: 503, name: 'UNAVAILABLE', description: 'The bridge is reconnecting.' }],
  },
  {
    id: 'whatsapp-device',
    category: 'whatsapp',
    title: 'WhatsApp Device Info',
    summary: 'Inspect the linked device session.',
    description:
      'Returns metadata about the linked device session used by WhatsApp utilities, including pairing state and expiry.',
    method: 'GET',
    path: '/api/v1/whatsapp/device',
    auth: 'none',
    free: true,
    params: [
      { name: 'session', type: 'string', required: true, description: 'Session identifier.', location: 'query', example: 'default' },
    ],
    headers: [],
    requestExample: null,
    responseExample: {
      status: 'success',
      code: 200,
      data: { paired: true, expires_at: '2026-12-01T00:00:00Z', platform: 'android' },
    },
    responseSchema: [
      { name: 'data.paired', type: 'boolean', description: 'Whether the device is paired.' },
      { name: 'data.platform', type: 'string', description: 'Reported device platform.' },
    ],
    errorCodes: [{ code: 404, name: 'NOT_FOUND', description: 'Unknown session identifier.' }],
  },
  {
    id: 'information-ip',
    category: 'information',
    title: 'IP Lookup',
    summary: 'Geolocate an IP address.',
    description:
      'Returns country, city, and network metadata for an IPv4 or IPv6 address. Omit the ip parameter to inspect the caller address.',
    method: 'GET',
    path: '/api/v1/info/ip',
    auth: 'none',
    free: true,
    params: [
      { name: 'ip', type: 'string', required: false, description: 'IP address, defaults to caller.', location: 'query', example: '8.8.8.8' },
    ],
    headers: [],
    requestExample: null,
    responseExample: {
      status: 'success',
      code: 200,
      data: { ip: '8.8.8.8', country: 'United States', city: 'Mountain View', asn: 'AS15169' },
    },
    responseSchema: [
      { name: 'data.ip', type: 'string', description: 'Queried IP address.' },
      { name: 'data.country', type: 'string', description: 'Country name.' },
      { name: 'data.city', type: 'string', description: 'City name.' },
    ],
    errorCodes: [{ code: 422, name: 'INVALID_IP', description: 'The ip value is not a valid address.' }],
  },
  {
    id: 'information-weather',
    category: 'information',
    title: 'Weather',
    summary: 'Current conditions for a city.',
    description:
      'Returns the current temperature, humidity, and conditions summary for a city name.',
    method: 'GET',
    path: '/api/v1/info/weather',
    auth: 'none',
    free: true,
    params: [
      { name: 'city', type: 'string', required: true, description: 'City name.', location: 'query', example: 'Jakarta' },
      { name: 'units', type: 'enum', required: false, description: 'Temperature units.', location: 'query', enumValues: ['metric', 'imperial'], example: 'metric' },
    ],
    headers: [],
    requestExample: null,
    responseExample: {
      status: 'success',
      code: 200,
      data: { city: 'Jakarta', temp_c: 31, humidity: 74, condition: 'Partly cloudy' },
    },
    responseSchema: [
      { name: 'data.temp_c', type: 'number', description: 'Temperature in Celsius.' },
      { name: 'data.humidity', type: 'number', description: 'Relative humidity percent.' },
      { name: 'data.condition', type: 'string', description: 'Short condition summary.' },
    ],
    errorCodes: [{ code: 404, name: 'NOT_FOUND', description: 'Unknown city name.' }],
  },
  {
    id: 'information-time',
    category: 'information',
    title: 'World Time',
    summary: 'Current time for a timezone.',
    description:
      'Returns the current date, time, and UTC offset for an IANA timezone identifier.',
    method: 'GET',
    path: '/api/v1/info/time',
    auth: 'none',
    free: true,
    params: [
      { name: 'tz', type: 'string', required: false, description: 'IANA timezone, defaults to UTC.', location: 'query', example: 'Asia/Jakarta' },
    ],
    headers: [],
    requestExample: null,
    responseExample: {
      status: 'success',
      code: 200,
      data: { timezone: 'Asia/Jakarta', datetime: '2026-11-11T17:04:00+07:00', offset: '+07:00' },
    },
    responseSchema: [
      { name: 'data.timezone', type: 'string', description: 'Resolved timezone identifier.' },
      { name: 'data.datetime', type: 'string', description: 'ISO-8601 local datetime.' },
    ],
    errorCodes: [{ code: 422, name: 'INVALID_TZ', description: 'Unknown timezone identifier.' }],
  },
]

export function findEndpoint(category: string, endpoint: string): ApiEndpoint | undefined {
  return endpoints.find(
    (e) => e.category === category && (e.id === endpoint || e.path.endsWith(`/${endpoint}`)),
  )
}
