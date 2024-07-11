import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React, { useContext, useEffect, useState } from "react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Context } from "features/game/GameProvider";
import { Context as AuthContext } from "features/auth/lib/Provider";
import { useActor } from "@xstate/react";

import tradeIcon from "assets/icons/trade.png";
import {
  FloorPrices,
  getListingsFloorPrices,
} from "features/game/actions/getListingsFloorPrices";
import { BuyPanel } from "./BuyPanel";
import { Trade } from "./Trade";
import { FactionEmblem, FactionName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { Emblems } from "./Emblems";
import { SpeakingModal } from "features/game/components/SpeakingModal";

interface Props {
  onClose: () => void;
  emblem: FactionEmblem;
}

export const EMBLEM_TO_FACTION: Record<FactionEmblem, FactionName> = {
  "Bumpkin Emblem": "bumpkins",
  "Goblin Emblem": "goblins",
  "Nightshade Emblem": "nightshades",
  "Sunflorian Emblem": "sunflorians",
};

export const EmblemsTrading: React.FC<Props> = ({ onClose, emblem }) => {
  const [showIntro, setShowIntro] = useState(true);
  const [tab, setTab] = useState(0);
  const { t } = useAppTranslation();

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const { authService } = useContext(AuthContext);
  const [authState] = useActor(authService);

  const [floorPrices, setFloorPrices] = useState<FloorPrices>({});

  const notCloseable = gameService.state.matches("fulfillTradeListing");

  useEffect(() => {
    const load = async () => {
      const floorPrices = await getListingsFloorPrices(
        authState.context.user.rawToken
      );
      setFloorPrices((prevFloorPrices) => ({
        ...prevFloorPrices,
        ...floorPrices,
      }));
    };
    load();
  }, []);

  const faction = gameState.context.state.faction?.name;

  if (!faction || EMBLEM_TO_FACTION[emblem] !== faction) {
    return (
      <SpeakingModal
        message={[
          {
            text: t("faction.restrited.area", {
              faction: EMBLEM_TO_FACTION[emblem],
            }),
          },
        ]}
        onClose={onClose}
      />
    );
  }

  if (showIntro) {
    return (
      <SpeakingModal
        message={[
          {
            text: t("faction.emblems.intro.one"),
          },
          {
            text: t("faction.emblems.intro.three"),
          },
        ]}
        onClose={() => setShowIntro(false)}
      />
    );
  }

  return (
    <CloseButtonPanel
      onClose={notCloseable ? undefined : onClose}
      tabs={[
        { icon: ITEM_DETAILS[emblem].image, name: t("faction.emblems") },
        { icon: SUNNYSIDE.icons.search, name: t("buy") },
        { icon: tradeIcon, name: t("sell") },
      ]}
      setCurrentTab={setTab}
      currentTab={tab}
    >
      {tab === 0 && <Emblems emblem={emblem} factionName={faction} />}
      {tab === 1 && <BuyPanel emblem={emblem} />}
      {tab === 2 && <Trade floorPrices={floorPrices} emblem={emblem} />}
    </CloseButtonPanel>
  );
};
