const API=import.meta.env.VITE_API_URL;


// Get all available coupons from the backend
export const getCoupons = async () => {
  try {
    const response = await fetch(`${API}/coupons`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Failed to fetch coupons:", error);
    return []; // Return an empty array if an error occurs
  }
};


// Check if the user is eligible to claim a coupon
export const checkUserEligibility = async () => {
  try {
    
    const response = await fetch(`${API}/eligibility`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    console.error("Failed to check eligibility:", error);
    return false; 
  }
};

// Claim a coupon via the backend
export const claimCouponAPI = async () => {
  const response = await fetch(`${API}/claim`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Failed to claim coupon");
  }
  const data = await response.json();
  return data.claimedCoupon;
};
