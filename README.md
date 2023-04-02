# Notion to Discord Chatbot with Pinecone, Langchain & OpenAI

A Discord chatbot that responds to user questions about a Notion knowledge base. It uses Pinecone as a vector database, OpenAI as a model provider and LangChain.

## Features

- Processes Markdown files to create a Pinecone index
- Responds to user messages when mentioned
- Searches for the most relevant docs and generates a summarized response

## Prerequisites

- A Discord bot token
- An OpenAI API key
- A Pinecone API key, index and environement

## Installation

1. Clone the repository:

```
git clone https://github.com/ysnmrsl/notion-discord-chatbot.git
```

2. Install the dependencies:

```
cd notion-discord-chatbot
npm install
```

3. Create a `.env` file in the root of the project and add your Discord bot token, OpenAI API key and Pinecone API key, index and environement:

```
DISCORD_TOKEN=
OPENAI_API_KEY=
PINECONE_API_KEY=
PINECONE_ENVIRONMENT=
PINECONE_INDEX_NAME=
```

5. Place your exported Notion files in `notion-data` folder

6. Run the `pinecone-upsert.js` script to process the Markdown files to create a Pinecone index:

```
node scripts/pinecone-upsert.js
```

5. Start the Discord chatbot:

```
node index.js
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Credit

This repo is inspired by [notion-qa](https://github.com/hwchase17/notion-qa)
