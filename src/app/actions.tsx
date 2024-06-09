'use server';

import { BotCard, BotMessage } from '@ai-rsc/components/llm-crypto/message';
import { Price } from '@ai-rsc/components/llm-crypto/price';
import { PriceSkeleton } from '@ai-rsc/components/llm-crypto/price-skeleton';
import { Stats } from '@ai-rsc/components/llm-crypto/stats';
import { StatsSkeleton } from '@ai-rsc/components/llm-crypto/stats-skeleton';
import { env } from '@ai-rsc/env.mjs';
import { openai } from '@ai-sdk/openai';
import type { CoreMessage, ToolInvocation } from 'ai';
import { createAI, getMutableAIState, streamUI } from 'ai/rsc';
import { MainClient } from 'binance';
import { Loader2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { z } from 'zod';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const binance = new MainClient({
  api_key: env.BINANCE_API_KEY,
  api_secret: env.BINANCE_API_SECRET,
});

/* 
  !-- The first implication of user interfaces being generative is that they are not deterministic in nature.
  !-- This is because they depend on the generation output by the model. Since these generations are probabilistic 
  !-- in nature, it is possible for every user query to result in a different user interface being generated.

  !-- Users expect their experience using your application to be predictable, so non-deterministic user interfaces
  !-- can sound like a bad idea at first. However, one way language models can be set up to limit their generations
  !-- to a particular set of outputs is to use their ability to call functions, now called tool calling.

  !-- When language models are provided with a set of function definitions, and instructed that it can choose to 
  !-- execute any of them based on user query, it does either one of the following two things:

  !-- 1. Execute a function that is most relevant to the user query.
  !-- 2. Not execute any function if the user query is out of bounds the set of functions available to them.

  !-- As you can see in the content variable below, we set the initial message so that the LLM understand what to do.
  !-- We define a few tool names which allows the LLM to decide whether or not to call the function. Then, we ensure
  !-- that the LLM understands that if the function is out of bounds of the set of functions available to them, they
  !-- should respond that they are a demo and cannot do that. Besides that, the LLM can chat with users as normal.
*/


const content = `\
You are a crypto bot and you can help users get the prices of cryptocurrencies.

Messages inside [] means that it's a UI element or a user event. For example:
- "[Price of BTC = 69000]" means that the interface of the cryptocurrency price of BTC is shown to the user.

If the user wants the price, call \`get_crypto_price\` to show the price.
If the user wants the market cap or other stats of a given cryptocurrency, call \`get_crypto_stats\` to show the stats.
If the user wants a stock price, it is an impossible task, so you should respond that you are a demo and cannot do that.
If the user wants to do anything else, it is an impossible task, so you should respond that you are a demo and cannot do that.

Besides getting prices of cryptocurrencies, you can also chat with users.
`;

export async function sendMessage(message: string): Promise<{
  id: number,
  role: 'user' | 'assistant',
  display: ReactNode;
}> {

  const history = getMutableAIState<typeof AI>();

  history.update([
    ...history.get(),
    {
      role: 'user',
      content: message,
    },
  ]);

  const reply = await streamUI({
    model: openai('gpt-4o-2024-05-13'),
    messages: [
      {
        role: 'system',
        content,
        toolInvocations: []
      },
      ...history.get(),
    ] as CoreMessage[],
    initial: (
      <BotMessage className="items-center flex shrink-0 select-none justify-center">
        <Loader2 className="h-5 w-5 animate-spin stroke-zinc-900" />
      </BotMessage>
    ),
    text: ({ content, done }) => {
      if (done) history.done([...history.get(), { role: 'assistant', content }]);

      return <BotMessage>{content}</BotMessage>;
    },
    tools: {
      get_crypto_price: {
        description:
          "Get the current price of a given cryptocurrency. Use this to show the price to the user.",
        parameters: z.object({
          symbol: z
            .string()
            .describe("The name or symbol of the cryptocurrency. e.g. BTC/ETH/SOL.")
        }),
        generate: async function* ({ symbol }: { symbol: string; }) {
          yield (
            <BotCard>
              <PriceSkeleton />
            </BotCard>
          );

          const stats = await binance.get24hrChangeStatististics({ symbol: `${symbol}USDT` });
          // get the last price
          const price = Number(stats.lastPrice);
          // extract the delta
          const delta = Number(stats.priceChange);

          await sleep(1000);

          history.done([
            ...history.get(),
            {
              role: 'assistant',
              name: 'get_crypto_price',
              content: `[Price of ${symbol} = ${price}]`,
            },
          ]);

          return (
            <BotCard>
              <Price name={symbol} price={price} delta={delta} />
            </BotCard>
          );
        },
      },
      get_crypto_stats: {
        description:
          "Get the current stats of a given cryptocurrency. Use this to show the stats to the user.",
        parameters: z.object({
          slug: z
            .string()
            .describe("The full name of the cryptocurrency in lowercase. e.g. bitcoin/ethereum/solana.")
        }),
        generate: async function* ({ slug }: { slug: string; }) {
          yield (
            <BotCard>
              <StatsSkeleton />
            </BotCard>
          );

          const url = new URL("https://api.coinmarketcap.com/data-api/v3/cryptocurrency/detail");

          // set the query params which are required
          url.searchParams.append("slug", slug);
          url.searchParams.append("limit", "1");
          url.searchParams.append("sortBy", "market_cap");

          const response = await fetch(url, {
            headers: {
              // set the headers
              Accept: "application/json",
              "Content-Type": "application/json",
              "X-CMC_PRO_API_KEY": env.CMC_API_KEY,
            }
          });

          if (!response.ok) {
            return <BotMessage>Crypto not found!</BotMessage>;
          }

          const res = await response.json() as {
            data: {
              id: number;
              name: string;
              symbol: string;
              volume: number;
              volumeChangePercentage24h: number;
              statistics: {
                rank: number;
                totalSupply: number;
                marketCap: number;
                marketCapDominance: number;
              },
            };
          };

          const data = res.data;
          const stats = res.data.statistics;

          const marketStats = {
            name: data.name,
            volume: data.volume,
            volumeChangePercentage24h: data.volumeChangePercentage24h,
            rank: stats.rank,
            marketCap: stats.marketCap,
            totalSupply: stats.totalSupply,
            dominance: stats.marketCapDominance,
          };

          await sleep(1000);

          history.done([
            ...history.get(),
            {
              role: 'assistant',
              name: 'get_crypto_price',
              content: `[Stats of ${data.symbol}]`,
            },
          ]);

          return (
            <BotCard>
              <Stats {...marketStats} />
            </BotCard>
          );
        },
      }
    },
    temperature: 0,
  });

  return {
    id: Date.now(),
    role: 'assistant' as const,
    display: reply.value,
  };
};
// Define the AI state and UI state types
export type AIState = Array<{
  id?: number;
  name?: 'get_crypto_price' | 'get_crypto_stats';
  role: 'user' | 'assistant' | 'system';
  content: string;
}>;

export type UIState = Array<{
  id: number;
  role: 'user' | 'assistant';
  display: ReactNode;
  toolInvocations?: ToolInvocation[];
}>;

// Create the AI provider with the initial states and allowed actions
export const AI = createAI({
  initialAIState: [] as AIState,
  initialUIState: [] as UIState,
  actions: {
    sendMessage,
  },
});