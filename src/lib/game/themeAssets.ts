import type { WorldId } from "../../components/shared/WorldTheme";

const SHOP_THEME_ASSET_ROOT = "/pages/shop/theme-previews";

export const THEME_BACKGROUND: Partial<Record<WorldId, string>> = {
  cafe: `${SHOP_THEME_ASSET_ROOT}/cozy-cafe.webp`,
  forest: `${SHOP_THEME_ASSET_ROOT}/mossy-forest.webp`,
  ocean: `${SHOP_THEME_ASSET_ROOT}/tide-pool.webp`,
  sakura: `${SHOP_THEME_ASSET_ROOT}/sakura-park.webp`,
  castle: `${SHOP_THEME_ASSET_ROOT}/royal-castle.webp`,
  space: `${SHOP_THEME_ASSET_ROOT}/stardust.webp`,
  autumn: `${SHOP_THEME_ASSET_ROOT}/cozy-campsite.webp`,
  mushroom: `${SHOP_THEME_ASSET_ROOT}/fairy-mushroom-village.webp`,
  sunflower: `${SHOP_THEME_ASSET_ROOT}/sunflower-meadow.webp`,
};
