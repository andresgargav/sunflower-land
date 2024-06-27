import React, { useContext } from "react";

import { useActor, useSelector } from "@xstate/react";
import { Modal } from "components/ui/Modal";
import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";

import { PortalContext } from "./lib/PortalProvider";
import { Label } from "components/ui/Label";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { RecipeRushHUD } from "./components/RecipeRushHUD";
import { RecipeRushPhaser } from "./RecipeRushPhaser";

import { authorisePortal } from "../lib/portalUtil";
import { PortalMachineState } from "./lib/recipeRushMachine";
import { Loading } from "features/auth/components";
import { CONFIG } from "lib/config";

const _gameState = (state: PortalMachineState) => state.context.state;

/**
 * A Portal Example which demonstrates basic state management
 */
export const RecipeRush: React.FC = () => {
  const { portalService } = useContext(PortalContext);
  const [portalState] = useActor(portalService);
  const { t } = useAppTranslation();

  const gameState = useSelector(portalService, _gameState);

  if (portalState.matches("error")) {
    return (
      <Modal show>
        <Panel>
          <div className="p-2">
            <Label type="danger">{t("error")}</Label>
            <span className="text-sm my-2">{t("error.wentWrong")}</span>
          </div>
          <Button onClick={() => portalService.send("RETRY")}>
            {t("retry")}
          </Button>
        </Panel>
      </Modal>
    );
  }

  if (portalState.matches("unauthorised")) {
    return (
      <Modal show>
        <Panel>
          <div className="p-2">
            <Label type="danger">{t("error")}</Label>
            <span className="text-sm my-2">{t("session.expired")}</span>
          </div>
          <Button onClick={authorisePortal}>{t("welcome.login")}</Button>
        </Panel>
      </Modal>
    );
  }

  if (portalState.matches("loading")) {
    return (
      <Modal show>
        <Panel>
          <Loading />
          <span className="text-xs">
            {`${t("last.updated")}:${CONFIG.CLIENT_VERSION}`}
          </span>
        </Panel>
      </Modal>
    );
  }

  return (
    <div>
      {gameState && (
        <>
          <RecipeRushHUD />
          <RecipeRushPhaser />
        </>
      )}
    </div>
  );
};
