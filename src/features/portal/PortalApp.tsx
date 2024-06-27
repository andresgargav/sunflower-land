import React from "react";

import { PortalProvider } from "./recipeRush/lib/PortalProvider";
import { Ocean } from "features/world/ui/Ocean";

import { WalletProvider } from "features/wallet/WalletProvider";

import { RecipeRush } from "./recipeRush/RecipeRush";

export const PortalApp: React.FC = () => {
  return (
    // WalletProvider - if you need to connect to a players wallet
    <WalletProvider>
      {/* PortalProvider - gives you access to a xstate machine which handles state management */}
      <PortalProvider>
        <Ocean>
          <RecipeRush />
        </Ocean>
      </PortalProvider>
    </WalletProvider>
  );
};
