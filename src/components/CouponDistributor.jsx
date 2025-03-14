"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCoupons, claimCoupon, checkEligibility } from "../store/couponSlice";
import { Ticket, Clock, AlertCircle, CheckCircle } from "lucide-react";
import CouponCard from "./CouponCard";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "./ui/alert";

export default function CouponDistributor() {
  const dispatch = useDispatch();
  const { currentCoupon, claimedCoupon, isEligible, timeRemaining, loading, error } =
    useSelector((state) => state.coupon);

  const [showSuccess, setShowSuccess] = useState(false);
  // Local state to update the timer on screen
  const [localTime, setLocalTime] = useState(timeRemaining);

  // On mount, fetch the coupons and check eligibility
  useEffect(() => {
    dispatch(fetchCoupons());
    dispatch(checkEligibility());
  }, [dispatch]);

  // Update local time when redux timeRemaining changes
  useEffect(() => {
    setLocalTime(timeRemaining);
  }, [timeRemaining]);

  useEffect(() => {
    // Start a countdown if the user is not eligible and time is remaining
    let timer;
    if (!isEligible && localTime > 0) {
      timer = setInterval(() => {
        setLocalTime((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isEligible, localTime]);

  useEffect(() => {
    // Show success message for 5 seconds when a coupon is claimed
    if (claimedCoupon) {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [claimedCoupon]);

  const handleClaimCoupon = () => {
    dispatch(claimCoupon());
  };

  const formatTimeRemaining = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Exclusive Coupon Giveaway
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Claim your free coupon below. One coupon per user.
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {showSuccess && claimedCoupon && (
        <Alert className="mb-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertTitle className="text-green-800 dark:text-green-400">
            Success!
          </AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-300">
            You've successfully claimed coupon: {claimedCoupon.code}
          </AlertDescription>
        </Alert>
      )}

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5 text-primary" />
            Available Coupon
          </CardTitle>
          <CardDescription>
            The next coupon in our round-robin distribution system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentCoupon ? (
            <CouponCard coupon={currentCoupon} />
          ) : (
            <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">
                No coupons available at the moment
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleClaimCoupon}
            disabled={!isEligible || loading || !currentCoupon}
            className="w-full"
          >
            {loading ? "Processing..." : "Claim Coupon"}
          </Button>
        </CardFooter>
      </Card>

      {!isEligible && localTime > 0 && (
        <Card className="border-amber-200 dark:border-amber-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-amber-700 dark:text-amber-400 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Waiting Period
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300">
              You've recently claimed a coupon. You can claim another in:
            </p>
            <p className="text-2xl font-semibold text-center my-4 text-amber-600 dark:text-amber-400">
              {formatTimeRemaining(localTime)}
            </p>
          </CardContent>
        </Card>
      )}

      {claimedCoupon && !showSuccess && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Your Claimed Coupon</CardTitle>
            <CardDescription>Use this coupon before it expires</CardDescription>
          </CardHeader>
          <CardContent>
            <CouponCard coupon={claimedCoupon} claimed />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
