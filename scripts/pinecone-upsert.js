import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings";
import { PineconeStore } from "langchain/vectorstores";
import { pinecone } from "../utils/pinecone-client.js";
import { processMarkDownFiles } from "../utils/helpers.js";
import {
  PINECONE_INDEX_NAME,
  PINECONE_NAME_SPACE,
} from "../config/pinecone.js";

const directoryPath = "notion-data";

export const run = async () => {
  try {
    /*load raw docs from the markdown files in the directory */
    const rawDocs = await processMarkDownFiles(directoryPath);

    /* Split text into chunks */
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const docs = await textSplitter.splitDocuments(rawDocs);
    console.log("split docs", docs);

    console.log("creating vector store...");
    /*create and store the embeddings in the vectorStore*/
    const upsertChunkSize = 50;
    const embeddings = new OpenAIEmbeddings();
    const index = pinecone.Index(PINECONE_INDEX_NAME);
    for (let i = 0; i < docs.length; i += upsertChunkSize) {
      const chunk = docs.slice(i, i + upsertChunkSize);
      console.log(`Chunk ${i} / ${docs.length}`);
      await PineconeStore.fromDocuments(
        index,
        chunk,
        embeddings,
        "text",
        PINECONE_NAME_SPACE
      );
    }
    console.log("vector store created");
  } catch (error) {
    console.log("error", error);
    throw new Error("Failed to upsert data");
  }
};

(async () => {
  await run();
  console.log("upsert complete");
})();
