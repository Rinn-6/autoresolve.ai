import os
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from openai import OpenAI

load_dotenv()

client = OpenAI (
    api_key = os.getenv("OPENROUTER_API_KEY"),
    base_url = "https://openrouter.ai/api/v1"
)

app = FastAPI()

@app.post("/chat")
async def chat(request: Request):
        try:
            data = await request.json()
            query = data.get("query", "")

            if not query:
                return JSONResponse(content={"error": "Query missing"}, status_code=400)
        
            system_prompt = (
                "You are a friendly and helpful support assistant for an e-commerce platfrom. "
                "Answer concisely in 2-3 lines. If the query is too vague or complex, reply: "
                "'Let me connect you to a human agent for further help.'"
            )

            response = client.chat.completions.create(
                model = "mistralai/mistral-7b-instruct:free",
                messages = [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": query}
                ]
            )

            reply = response.choices[0].message.content.strip()
            escalation = "connecting you to a human" in reply.lower()

            return {"reply":reply, "escalation": escalation}

        except Exception as e:
             return JSONResponse(content={"error": str(e)}, status_code=500)
