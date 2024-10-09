import { OpenAIEmbeddings } from "@langchain/openai";
import { Neo4jVectorStore } from "@langchain/community/vectorstores/neo4j_vector";
import {uri, user, password} from '../config.js'
// Configuration object for Neo4j connection and other related settings
const config = {
  url: uri, // URL for the Neo4j instance
  username: user, // Username for Neo4j authentication
  password: password, // Password for Neo4j authentication
  indexName: "class", // Name of the vector index
  searchType: "vector" as const, // Type of search (e.g., vector, hybrid)
  nodeLabel: "Chunk", // Label for the nodes in the graph
  textNodeProperty: "text", // Property of the node containing text
  embeddingNodeProperty: "embedding", // Property of the node containing embedding
};

const documents = [
  { pageContent: "what's this", metadata: { a: 2 } },
  { pageContent: "Cat drinks milk", metadata: { a: 1 } },
];

const neo4jVectorIndex = await Neo4jVectorStore.fromDocuments(
  documents,
  new OpenAIEmbeddings(),
  config
);

const results = await neo4jVectorIndex.similaritySearch("water", 1);

console.log(results);

/*
  [ Document { pageContent: 'Cat drinks milk', metadata: { a: 1 } } ]
*/

await neo4jVectorIndex.close();