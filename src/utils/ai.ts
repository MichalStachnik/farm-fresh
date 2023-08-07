import { OpenAI } from 'langchain/llms/openai';

export const analyze = async (query: string) => {
  const model = new OpenAI({ temperature: 0 });
  const res = await model.call(query);
  console.log('our analysis', res);
};
