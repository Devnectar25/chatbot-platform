# Phase 8: Production Packaging & Embeddable Widget

The goal of this phase is to transform the standalone React application into a self-contained, embeddable **Chat Widget**. This will allow clients to integrate the chatbot into their websites using a single script tag.

## 1. Objectives
- **Single File Bundle**: Compile all React logic and CSS into one `chatbot-widget.js`.
- **Shadow DOM Isolation**: Use a Shadow DOM to ensure the client website's CSS does not interfere with the chatbot's styling (and vice versa).
- **Floating UI**: Implement a floating action button (FAB) that opens/closes the chat window.
- **Client Configuration**: Allow the widget to be configured via `data-` attributes (e.g., `data-app-id`, `data-theme`).

## 2. Technical Components

### [NEW] Widget Entry Point (`src/widget-main.tsx`)
- Instead of mounting to `#root`, this entry point will:
    1. Create a `div` and attach a Shadow Root.
    2. Inject the Chat Interface into the Shadow Root.
    3. Monitor for a floating button click to toggle visibility.

### [MODIFY] Vite Configuration (`vite.config.ts`)
- Configure Vite for **Library Mode**.
- Use `vite-plugin-css-injected-by-js` to bundle all CSS into the JavaScript file.
- Set the output filename to `chatbot-widget.js`.

### [NEW] Demo Test Page (`public/test-embed.html`)
- A simple HTML page that simulates a client's website.
- It will contain the `<script>` tag pointing to our local widget to verify the installation flow.

## 3. Deployment Strategy
- The `chatbot-widget.js` will be hosted on our backend or a CDN.
- **CORS Policy**: The Python/Node.js backend must be updated to allow requests from the specific domains of authorized clients.

## 4. Execution Steps
1. **Infrastructure**: Install `vite-plugin-css-injected-by-js`.
2. **Component Refactor**: Create the `WidgetWrapper` to handle the floating button and Shadow DOM.
3. **Bundling**: Update `vite.config.ts` and run the build.
4. **Testing**: Load `test-embed.html` and verify the chat functions perfectly as an overlay.

## 5. Verification Plan
- **Isolation Test**: Ensure the widget looks identical even on a website with "messy" CSS.
- **Multi-Tenant Test**: Verify that the `data-app-id` attribute correctly switches between Homeveda and other clients.
