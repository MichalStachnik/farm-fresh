import { OpenAI } from 'langchain/llms/openai';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { PromptTemplate } from 'langchain/prompts';
import { Document } from 'langchain/document';
import { loadQARefineChain } from 'langchain/chains';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import z from 'zod';
import { Product } from '@prisma/client';

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    type: z
      .string()
      .describe(
        'the type of product that was created, it can ONLY be a vegetable, fruit, pork, poultry, or beef.'
      ),
    recipe: z
      .string()
      .describe(
        'a suggested recipe and instructions to make with the product.'
      ),
    price: z
      .string()
      .describe('the approximate price per pound of the product.'),
  })
);

const getPrompt = async (query: string) => {
  const instructions = parser.getFormatInstructions();
  const prompt = new PromptTemplate({
    template:
      'Analyze the following product entry. It will come in the form "<Title>: <Description>" Follow the intructions and format your response to match the format instructions, no matter what! \n{instructions}\n{entry}',
    inputVariables: ['entry'],
    partialVariables: { instructions },
  });

  const input = await prompt.format({
    entry: query,
  });
  return input;
};

export const analyze = async (query: string) => {
  const input = await getPrompt(query);
  const model = new OpenAI({ temperature: 0 });
  const result = await model.call(input);
  try {
    return parser.parse(result);
  } catch (error) {
    console.error('error parsing', error);
  }
};

export const getAnalysis = async (query: string, products: Product[]) => {
  const docs = products.map((product) => {
    return new Document({
      pageContent: `${product.name} ${product.about}`,
      metadata: { source: product.id },
    });
  });

  const model = new OpenAI({ temperature: 0 });

  // Iterates over the documents one by one, updating an intermediate answer with each iteration
  const chain = loadQARefineChain(model);

  const embeddings = new OpenAIEmbeddings();

  const store = await MemoryVectorStore.fromDocuments(docs, embeddings);

  // Get the relevent documents based on the query
  const relevantDocs = await store.similaritySearch(query);

  const res = await chain.call({
    input_documents: relevantDocs,
    question: query,
  });

  return res.output_text;
};
