# Phase 6 Implementation Plan: Voice & Multilingual Integration

## Goal
To build a universally accessible chatbot that caters to a diverse audience, including both highly educated users and those who prefer speaking over typing. We will implement a robust Voice Interface and native language support while keeping the UI clean and intuitive for all users.

## 1. Multi-Language Support

**The Strategy:**
Meta's `llama3` model natively understands and generates dozens of languages. 
- **Implementation**: We will update the Python AI prompt to explicitly instruct the model: *"Detect the language of the user's question and always respond in that exact same language."*
- **Benefit**: The Vector Database can remain entirely in English. The AI will retrieve the English data, understand it, and seamlessly translate the final answer into the user's spoken language on the fly.

## 2. Voice Input (Speech-to-Text)

**Approach: Web Speech API (Native Browser)**
- **How it works**: We will add a sleek, unobtrusive microphone button to the React widget's input bar. When clicked, it uses the browser's built-in voice recognition to convert speech to text instantly.
- **Why**: It is 100% free, zero latency, natively supports multiple languages automatically, and doesn't clutter the UI for users who prefer to type.

## 3. Voice Output (Reading Answers Aloud)

**Approach: Web Speech API (Native Browser)**
- **How it works**: We will add an auto-play Speaker toggle. When the AI finishes generating its response, the browser's `speechSynthesis` engine will read the text aloud in the matching language.
- **Why**: It provides instant, free playback without requiring heavy backend architecture changes.

## Execution Plan
1. **Frontend**: Add a Microphone icon button to the `ChatInterface.tsx` input area.
2. **Frontend**: Add a Speaker icon toggle to allow users to turn auto-read on or off.
3. **Frontend**: Implement `SpeechRecognition` to capture voice in the user's language and populate the input field.
4. **Frontend**: Implement `speechSynthesis` to read the AI's response aloud when the stream completes.
5. **Backend**: Update the Python system prompt in `rag_service.py` to enforce strict auto-translation.
