# Round-Robin Coupon Distribution with Abuse Prevention

A live web application that distributes coupons to guest users in a round-robin manner, incorporating mechanisms to prevent users from exploiting page refreshes to claim multiple coupons within a restricted time frame.

## Features

- **Coupon Distribution**: Maintains a list of available coupons and assigns them sequentially to users to ensure even distribution.
- **Guest Access**: Allows users to access the system without requiring login or account creation.
- **Abuse Prevention**:
  - IP Tracking: Records each user's IP address upon claiming a coupon, restricting subsequent claims from the same IP within a specified time frame (one hour).
  - Cookie Tracking: Uses cookies to monitor coupon claims from the same browser session.
- **User Feedback**: Provides clear messages indicating successful coupon claims or informs users of the time remaining before they can claim another.
- **Responsive Design**: Fully responsive UI that works on all device sizes.
- **Theme Support**: Includes both light and dark theme options.

## Tech Stack

- **Frontend**: React.js with Vite and Tailwind CSS
- **State Management**: Redux and Redux Toolkit for user tracking
- **UI Components**: Custom components with shadcn/ui styling
- **Theme**: Dark/light theme using React Context API

## Abuse Prevention Strategy

The application uses a multi-layered approach to prevent abuse:

1. **IP Address Tracking**: In a production environment, the server would track IP addresses and enforce cooldown periods. In this demo, we simulate this behavior using localStorage.

2. **Browser Fingerprinting**: A session ID is generated and stored in cookies to identify returning users, even if they clear local storage.

3. **Cooldown Period**: Users must wait for a specified period (1 hour) before claiming another coupon.

4. **Round-Robin Distribution**: Coupons are distributed in a sequential manner, ensuring fair distribution.

## Setup Instructions

1. Clone the repository
2. Install dependencies:

