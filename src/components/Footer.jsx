export default function Footer() {
    return (
      <footer className="bg-white dark:bg-gray-800 shadow-inner transition-colors duration-200">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>© {new Date().getFullYear()} CouponHub. All rights reserved.</p>
            <p className="mt-1">Secure coupon distribution with abuse prevention</p>
          </div>
        </div>
      </footer>
    );
  }
  