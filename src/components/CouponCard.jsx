import { CalendarClock, Tag, Percent } from "lucide-react";

export default function CouponCard({ coupon, claimed = false }) {
  return (
    <div
      className={`
      relative overflow-hidden rounded-lg border p-4
      ${
        claimed
          ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
          : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
      }
    `}
    >
      {claimed && (
        <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-2 py-1 transform rotate-0 origin-top-right">
          CLAIMED
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-shrink-0 flex items-center justify-center w-full sm:w-24 h-24 bg-primary/10 rounded-lg">
          <Percent className="h-10 w-10 text-primary" />
        </div>

        <div className="flex-grow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {coupon.discount}% OFF
          </h3>

          <p className="text-gray-600 dark:text-gray-300 mb-3">
            {coupon.description}
          </p>

          <div className="flex flex-wrap gap-3 text-sm">
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <Tag className="h-4 w-4 mr-1" />
              <span className="font-mono">{coupon.code}</span>
            </div>

            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <CalendarClock className="h-4 w-4 mr-1" />
              <span>
                Expires: {new Date(coupon.expiresAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
