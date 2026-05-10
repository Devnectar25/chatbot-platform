// test_ollama.js
// This script verifies that our Node.js backend can successfully connect to the local Ollama AI.

async function testOllamaConnection() {
    console.log("⏳ Sending a test message to Ollama (llama3)...");

    try {
        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama3',
                prompt: 'Reply with exactly these three words: "Connection is successful!"',
                stream: false // We want the full response at once, not a stream
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("\n✅ SUCCESS! Ollama Responded:");
        console.log("-----------------------------------");
        console.log(data.response);
        console.log("-----------------------------------");

    } catch (error) {
        console.error("\n❌ FAILED TO CONNECT TO OLLAMA.");
        console.error("Make sure Ollama is running in the background.");
        console.error("Error details:", error.message);
    }
}

testOllamaConnection();
