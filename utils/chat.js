import { pinecone } from "./pinecone-client.js";
import { makeChain } from "./makechain.js";
import {
  PINECONE_INDEX_NAME,
  PINECONE_NAME_SPACE,
} from "../config/pinecone.js";
import { PineconeStore } from "langchain/vectorstores";
import { OpenAIEmbeddings } from "langchain/embeddings";

const chat = async (question, history) => {
  const sanitizedQuestion = question.trim().replaceAll("\n", " ");

  const index = pinecone.Index(PINECONE_INDEX_NAME);

  const vectorStore = await PineconeStore.fromExistingIndex(
    new OpenAIEmbeddings({}),
    {
      pineconeIndex: index,
      textKey: "text",
      namespace: PINECONE_NAME_SPACE,
    }
  );

  const chain = makeChain(vectorStore);

  try {
    // const response = await chain.call({
    //   question: sanitizedQuestion,
    //   chat_history: history || [],
    // });
    const response = await chain.call({
      query: sanitizedQuestion,
    });

    return response;
  } catch (error) {
    console.log("Error while calling chain", error);
  }
};

export { chat };
