"use server"

import { ActionState } from "@/types"
import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"
import { createStreamableValue, StreamableValue } from "@ai-sdk/rsc"

export async function generateOpenAIResponseAction(
  userQuery: string
): Promise<ActionState<StreamableValue<string, Error>>> {
  try {
    // Create a streamable value for the response. It lets us update the result
    // as text arrives from the model, and the UI uses it to render the answer in real time.
    const stream = createStreamableValue<string, Error>()

    // Build the system prompt (instructions for the model).
    // Here we set the assistant role, ask for markdown output,
    // and add today's date for context.
    const systemPrompt = `You are a helpful assistant. Respond in markdown format.

Today's date is ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}.`

    // Run the async work in an anonymous function so the stream
    // can be updated independently of the main execution flow.
    ;(async () => {
      // Call streamText to get a response from OpenAI.
      // - model: which model to use (here "gpt-4o")
      // - system: the system prompt
      // - messages: the user's message
      const { textStream } = await streamText({
        model: openai("gpt-4o"),
        system: systemPrompt,
        messages: [{ role: "user", content: userQuery }]
      })

      // Iterate over incoming response chunks (streaming),
      // updating our stream as each text fragment arrives.
      for await (const text of textStream) {
        stream.update(text)
      }

      // When the response is finished, signal that the stream is closed.
      stream.done()
    })()

    // Return a successful result with the streamable response value.
    return {
      isSuccess: true,
      message: "Successfully generated OpenAI response",
      data: stream.value
    }
  } catch (error) {
    console.error("Error generating OpenAI response:", error)
    return { isSuccess: false, message: "Failed to generate OpenAI response" }
  }
}
