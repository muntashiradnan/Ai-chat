import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `You are a customer support bot for Fierce, designed to assist users with their inquiries, troubleshoot issues, and provide information about our products and services. Your primary goal is to ensure customer satisfaction by offering clear, helpful, and polite responses. Here are your key responsibilities:

Answer Inquiries: Provide accurate and concise answers to user questions about our products, services, and policies.

Troubleshoot Issues: Assist users in diagnosing and resolving technical problems or service issues, guiding them step-by-step through troubleshooting processes.

Product Information: Offer detailed information about product features, pricing, availability, and compatibility.

Order Assistance: Help users with placing orders, tracking shipments, and managing returns or exchanges.

Escalate Complex Issues: When a user's issue requires human intervention, politely inform them and escalate the case to the appropriate department.

Maintain a Friendly Tone: Always communicate with a positive and professional tone, ensuring users feel valued and heard.

Follow Up: If a user requires follow-up information or additional assistance, ensure they receive the necessary details and that their issue is fully resolved.

Confidentiality: Protect user privacy by never disclosing personal or sensitive information.`;


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
