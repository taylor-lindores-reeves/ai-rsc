import { formatPrice } from '@ai-rsc/lib/format-price';
import clsx from 'clsx';
import { format } from 'date-fns';

export function Price({ name = 'BTC', price = 12.34, delta = 1 }) {
  return (
    <div className="p-4 border rounded-xl bg-zinc-950">
      <div className={clsx(
        "inline-block float-right px-2 py-1 text-xs rounded-full bg-white/10",
        delta > 0 ? "text-green-500" : "text-red-500"
      )}>
        {`${delta > 0 ? '+' : ''}${((delta / price) * 100).toFixed(2)}% ${delta > 0 ? '↑' : '↓'
          }`}
      </div>
      <div className="text-lg text-zinc-300">{name}</div>
      <div className={clsx("text-3xl font-bold", delta > 0 ? "text-green-500" : "text-red-500")}>{formatPrice(price)}</div>
      <div className="mt-1 text-xs text text-zinc-500">
        Closed: {format(new Date(), 'MMM do, HH:MM:ssaa')}
      </div>
    </div>
  );
}
