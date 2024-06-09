import { Card, CardContent, CardHeader, CardTitle } from "@ai-rsc/components/ui/card";
import { ActivityIcon, CoinsIcon, DollarSignIcon, GaugeIcon, TrendingUpIcon, UsersIcon } from "@ai-rsc/components/ui/icons";
import { formatPrice } from "@ai-rsc/lib/format-price";
import { cn } from "@ai-rsc/lib/utils";

interface StatsProps {
  name: string;
  rank: number,
  totalSupply: number,
  volume: number,
  volumeChangePercentage24h: number,
  marketCap: number,
  dominance: number,

}

const PropDefaults: StatsProps = {
  name: "Bitcoin",
  rank: 1,
  totalSupply: 21000000,
  volume: 14817933452.303745,
  volumeChangePercentage24h: 0.1991271,
  marketCap: 1367347641840.1716,
  dominance: 53.9279,
};

export function Stats(props: StatsProps = PropDefaults) {
  const { name, rank, totalSupply, volume, volumeChangePercentage24h, marketCap, dominance } = props;

  return (
    <Card className="w-full mx-auto max-w-md rounded-2xl">
      <CardHeader className="px-6 py-4 border-b">
        <CardTitle>Market Stats for {name}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 p-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <DollarSignIcon className="w-4 h-4 inline-block mr-1" />
              Market Cap
            </div>
            <div className="text-lg font-medium">{formatPrice(marketCap)}</div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <ActivityIcon className="w-4 h-4 inline-block mr-1" />
              24h Volume
            </div>
            <div className="text-lg font-medium">{formatPrice(volume)}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <GaugeIcon className="w-4 h-4 inline-block mr-1" />
              Dominance
            </div>
            <div className="text-lg font-medium">{dominance}%</div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <TrendingUpIcon className="w-4 h-4 inline-block mr-1" />
              24h Volume Change
            </div>
            <div className={cn("text-lg font-medium", volumeChangePercentage24h > 0 ? "text-green-500" : "text-red-500")}>{volumeChangePercentage24h}%</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <CoinsIcon className="w-4 h-4 inline-block mr-1" />
              Total Supply
            </div>
            <div className="text-lg font-medium">{totalSupply}</div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <UsersIcon className="w-4 h-4 inline-block mr-1" />
              Rank
            </div>
            <div className="text-lg font-medium">{rank}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}