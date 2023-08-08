import { OpenAI } from 'langchain/llms/openai';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { PromptTemplate } from 'langchain/prompts';
import z from 'zod';

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    type: z
      .string()
      .describe(
        'the type of product that was created, it can be vegtable, fruit, pork, or beef.'
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

const getPrompt = async (product: any) => {
  const instructions = parser.getFormatInstructions();
  const prompt = new PromptTemplate({
    template:
      'Analyze the following product entry. Follow the intructions and format your response to match the format instructions, no matter what! \n{instructions}\n{entry}',
    inputVariables: ['entry'],
    partialVariables: { instructions },
  });

  const input = await prompt.format({
    entry: product,
  });

  return input;
};

export const analyze = async (query: string) => {
  const input = await getPrompt(query);
  const model = new OpenAI({ temperature: 0 });
  const res = await model.call(input);
  try {
    return parser.parse(res);
  } catch (error) {
    console.error('error parsing', error);
  }
};
