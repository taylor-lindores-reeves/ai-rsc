import { Card, CardContent, CardHeader, CardTitle } from "@ai-rsc/components/ui/card";
import { ActivityIcon, CoinsIcon, DollarSignIcon, GaugeIcon, TrendingUpIcon, UsersIcon } from "@ai-rsc/components/ui/icons";

export const StatsSkeleton = () => {
  return (
    <Card className="w-full mx-auto max-w-md rounded-2xl">
      <CardHeader className="px-6 py-4 border-b">
        <CardTitle>Market Stats</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 p-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <DollarSignIcon className="w-4 h-4 inline-block mr-1" />
              Market Cap
            </div>
            <div className="text-transparent w-24 animate-pulse bg-zinc-700 rounded-md mb-2">
              xxxxxxxxxx
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <ActivityIcon className="w-4 h-4 inline-block mr-1" />
              24h Volume
            </div>
            <div className="text-transparent w-24 animate-pulse bg-zinc-700 rounded-md mb-2">
              xxxxxxxxxx
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <GaugeIcon className="w-4 h-4 inline-block mr-1" />
              Dominance
            </div>
            <div className="text-transparent w-24 animate-pulse bg-zinc-700 rounded-md mb-2">
              xxxx
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <TrendingUpIcon className="w-4 h-4 inline-block mr-1" />
              24h Volume Change
            </div>
            <div className="text-transparent w-24 animate-pulse bg-zinc-700 rounded-md mb-2">
              xxxx
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <CoinsIcon className="w-4 h-4 inline-block mr-1" />
              Max Supply
            </div>
            <div className="text-transparent w-24 animate-pulse bg-zinc-700 rounded-md mb-2">
              xxxxxxxxx
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <UsersIcon className="w-4 h-4 inline-block mr-1" />
              Rank
            </div>
            <div className="text-transparent w-24 animate-pulse bg-zinc-700 rounded-md mb-2">
              xx
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};