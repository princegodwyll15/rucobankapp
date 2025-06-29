import React from "react";

const Card = ({ bg = "bg-white", }) => {
  return (
    <div class="${bg}bg-white rounded-lg shadow-lg p-8 max-w-3xl mx-auto w-full mt-10">
      <h2 class="text-3xl font-bold mb-6 text-blue-900 text-center">
        Manage Your Finances with Ease
      </h2>

      <ul class="list-disc list-inside text-gray-700 space-y-2 mb-8 text-lg">
        <li>Check your account balances</li>
        <li>Transfer funds securely</li>
        <li>View transaction history</li>
        <li>Pay bills online</li>
        <li>24/7 customer support</li>
      </ul>

      <div class="flex flex-col sm:flex-row gap-4 mb-6 justify-center">
        <a
          href="/user/login"
          class="bg-blue-900 hover:bg-blue-900 text-white px-6 py-3 rounded-lg text-center transition font-medium"
        >
          Login to Your Account
        </a>
        <a
          href="/user/register"
          class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-center transition font-medium"
        >
          Open an Account
        </a>
      </div>
    </div>
  );
};

export default Card;
