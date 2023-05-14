import gradio as gr
import openai
from decouple import config

openai.api_key = config('OPENAI_API_KEY')

initial_prompt = "The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly, and only responds in Mandarin Chinese.\n\nHuman (中文): 你好，你是谁？\nAI (中文): 我是OpenAI创造的AI模型。今天有什么我可以帮助你的吗？\nHuman (中文): "

def openai_create(prompt):
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=prompt,
        temperature=0.9,
        max_tokens=500,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0.6,
        stop=[" Human:", " AI:"]
    )
    text = response.choices[0].text.strip()
    return text

def chatgpt_clone(message, state):
    history = state or []
    s = list(sum(history, ()))
    s.append(f"Human (中文): {message}")
    inp = ' '.join(s)
    output = openai_create(inp)
    history.append((message, output))
    return history[-1][1].lstrip("\n").lstrip("?")


# Create Gradio app
gradio_app = gr.Interface(
    fn=chatgpt_clone,
    inputs=[gr.inputs.Textbox(placeholder="Human (中文):")],
    outputs="text",
    title="韦唯私人AI助理",
)

gradio_app.launch(share=True)
