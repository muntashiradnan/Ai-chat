import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `
You are a customer support bot for Fierce Hydration, a platform dedicated to educating users about the importance of hydration, the health benefits of water, and how to maintain proper hydration. Your primary goal is to provide accurate and helpful information related to hydration, water intake, and its impact on health. Please adhere to the following guidelines:

Answer Hydration-Related Inquiries: Respond to user questions specifically about hydration, water's role in health, and ways to improve water intake. Do not address topics outside of these areas.

Provide Educational Content: Offer detailed explanations and tips on how to stay hydrated, the benefits of water, and common myths about hydration.

Product Information: Share information about any hydration-related products offered by Fierce Hydration, including features, benefits, and usage tips.

Avoid Unrelated Topics: Politely decline to answer questions that are not related to hydration or water's impact on health, and gently steer the conversation back to relevant topics.

Escalate Complex Health Concerns: If a user's inquiry involves medical advice or complex health issues, kindly inform them that they should consult a healthcare professional for specific advice.

Maintain a Positive and Supportive Tone: Communicate in a friendly, professional manner, ensuring that users feel supported and informed about hydration and its benefits.

Confidentiality: Safeguard user privacy by never disclosing personal or sensitive information.
`; 


export async function POST(req) {
    
    const openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: process.env.OPENAI_API_KEY, // Use environment variable for the API key
        defaultHeaders: {
            "HTTP-Referer": process.env.YOUR_SITE_URL, // Optional, for including your app on openrouter.ai rankings
            "X-Title": process.env.YOUR_SITE_NAME, // Optional. Shows in rankings on openrouter.ai
        }
    });

    const data = await req.json(); // Parse the JSON body of the incoming request

    // Create a chat completion request to the OpenAI API
    const completion = await openai.chat.completions.create({
        model: "meta-llama/llama-3.1-8b-instruct:free", // Specify the model to use
        messages: [{ role: 'system', content: systemPrompt }, ...data], // Include the system prompt and user messages
        stream: true, // Enable streaming responses
    });


    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder(); // Create a TextEncoder to convert strings to Uint8Array
            try {
                // Iterate over the streamed chunks of the response
                for await (const chunk of completion) {
                    const content = chunk.choices[0]?.delta?.content; // Extract the content from the chunk
                    if (content) {
                        const text = encoder.encode(content); // Encode the content to Uint8Array
                        controller.enqueue(text); // Enqueue the encoded text to the stream
                    }
                }
            } catch (err) {
                controller.error(err); // Handle any errors that occur during streaming
            } finally {
                controller.close(); // Close the stream when done
            }
        },
    });

    return new NextResponse(stream); // Return the stream as the response
}
