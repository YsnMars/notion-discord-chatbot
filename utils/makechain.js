import { OpenAIChat, OpenAI } from "langchain/llms";
import {
  LLMChain,
  ChatVectorDBQAChain,
  loadQAChain,
  VectorDBQAChain,
} from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";

const CONDENSE_PROMPT =
  PromptTemplate.fromTemplate(`Given the following user prompt and conversation log, formulate a question in french that would be the most relevant to provide the user with an answer from a knowledge base.
  You should follow the following rules when generating and answer:
  - Always prioritize the user prompt over the conversation log.
  - Ignore any conversation log that is not directly related to the user prompt.
  - Only attempt to answer if a question was posed.
  - The question should be a single sentence.
  - You should remove any words that are not relevant to the question.
  - If you are unable to formulate a question, respond with the same USER PROMPT you got.

  USER PROMPT: {question}

  CONVERSATION LOG: {chat_history}

  Final answer in french:`);

const QA_PROMPT = PromptTemplate.fromTemplate(
  `You are an AI assistant providing helpful advice. You are given the following extracted parts of a long document and a question. Provide a conversational answer based on the context provided.
If you can't find the answer in the context below, just say "Hmm, I'm not sure." Don't try to make up an answer.
If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.

Question: {question}
=========
{context}
=========
Answer only in french in Markdown:`
);

const makeChain = (vectorstore) => {
  const questionGenerator = new LLMChain({
    llm: new OpenAIChat({ temperature: 0 }),
    prompt: CONDENSE_PROMPT,
  });
  const docChain = loadQAChain(
    new OpenAIChat({
      temperature: 0,
      modelName: "gpt-3.5-turbo",
    }),
    { prompt: QA_PROMPT }
  );

  // return new ChatVectorDBQAChain({
  //   vectorstore,
  //   combineDocumentsChain: docChain,
  //   questionGeneratorChain: questionGenerator,
  //   returnSourceDocuments: true,
  //   k: 2,
  // });

  return VectorDBQAChain.fromLLM(
    new OpenAI({
      temperature: 0,
      maxTokens: 500,
    }),
    vectorstore
  );
};

export { makeChain };
