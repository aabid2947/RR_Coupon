// Mock data for coupons
const COUPONS = [
    {
      id: "1",
      code: "SAVE20",
      discount: 20,
      description: "Save 20% on your next purchase",
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    },
    {
      id: "2",
      code: "FREESHIP",
      discount: 100,
      description: "Free shipping on orders over $50",
      expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
    },
    {
      id: "3",
      code: "SUMMER25",
      discount: 25,
      description: "Summer sale discount on all items",
      expiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days from now
    },
    {
      id: "4",
      code: "WELCOME10",
      discount: 10,
      description: "Welcome discount for new customers",
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days from now
    },
    {
      id: "5",
      code: "WELCOME11",
      discount: 19,
      description: "Welcome discount for new customers",
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days from now
    },
    {
      id: "6",
      code: "WELCOME12",
      discount: 155,
      description: "Welcome discount for new customers",
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days from now
    },
  ];
  
  // Simulate API delay
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  
  // Get all available coupons
  export const getCoupons = async () => {
    await delay(800); 
    return [...COUPONS];
  };
  
  // Check if user is eligible to claim a coupon
  export const checkUserEligibility = async () => {
    await delay(600);
  
    const lastClaimTime = localStorage.getItem("lastClaimTime");
    const claimedCouponId = localStorage.getItem("claimedCouponId");
  
    let claimedCoupon = null;
    if (claimedCouponId) {
      claimedCoupon = COUPONS.find((c) => c.id === claimedCouponId) || null;
    }
  
    // Get the next coupon in round-robin
    const nextCouponIndex = Number.parseInt(localStorage.getItem("nextCouponIndex") || "0");
    const nextCoupon = COUPONS[nextCouponIndex] || COUPONS[0];
  
    if (!lastClaimTime) {
      return {
        isEligible: true,
        timeRemaining: 0,
        claimedCoupon,
        nextCoupon,
      };
    }
  
    const now = Date.now();
    const lastClaim = Number.parseInt(lastClaimTime);
    const timeSinceClaim = now - lastClaim;
    const cooldownPeriod = 60 * 60 * 1000; // 1 hour in milliseconds
  
    if (timeSinceClaim >= cooldownPeriod) {
      return {
        isEligible: true,
        timeRemaining: 0,
        claimedCoupon,
        nextCoupon,
      };
    }
  
    const timeRemaining = Math.ceil((cooldownPeriod - timeSinceClaim) / 1000); // in seconds
  
    return {
      isEligible: false,
      timeRemaining,
      claimedCoupon,
      nextCoupon,
    };
  };
  
  // Claim a coupon
  export const claimCouponAPI = async (couponId) => {
    await delay(1000);

    const coupon = COUPONS.find((c) => c.id === couponId);
    if (!coupon) {
      throw new Error("Coupon not found");
    }
  
    // Store claim time and coupon ID in localStorage (simulating server-side storage)
    localStorage.setItem("lastClaimTime", Date.now().toString());
    localStorage.setItem("claimedCouponId", couponId);
  
    // Update the next coupon index for round-robin
    const currentIndex = COUPONS.findIndex((c) => c.id === couponId);
    const nextIndex = (currentIndex + 1) % COUPONS.length;
    localStorage.setItem("nextCouponIndex", nextIndex.toString());
  
    return coupon;
  };
  