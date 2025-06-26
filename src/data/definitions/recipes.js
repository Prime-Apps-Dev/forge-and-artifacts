// src/data/definitions/recipes.js
import { IMAGE_PATHS } from '../../constants/paths';

export const recipes = {
    iron: { name: "Железный слиток", input: { ironOre: 10 }, output: { ironIngots: 1 }, requiredProgress: 20, icon: IMAGE_PATHS.INGOTS.IRON },
    copper: { name: "Медный слиток", input: { copperOre: 10 }, output: { copperIngots: 1 }, requiredProgress: 20, requiredSkill: 'findCopper', icon: IMAGE_PATHS.INGOTS.COPPER },
    mithril: { name: "Мифриловый слиток", input: { mithrilOre: 15 }, output: { mithrilIngots: 1 }, requiredProgress: 30, requiredSkill: 'mithrilProspecting', icon: IMAGE_PATHS.INGOTS.MITHRIL },
    adamantite: { name: "Адамантитовый слиток", input: { adamantiteOre: 20 }, output: { adamantiteIngots: 1 }, requiredProgress: 50, requiredSkill: 'adamantiteMining', icon: IMAGE_PATHS.INGOTS.ADAMANTITE },
    bronze: { name: "Бронзовый слиток", input: { ironIngots: 1, copperIngots: 1 }, output: { bronzeIngots: 1 }, requiredProgress: 40, requiredSkill: 'artOfAlloys', icon: IMAGE_PATHS.INGOTS.BRONZE },
    sparksteel: { name: "Слиток Искростали", input: { bronzeIngots: 2, sparks: 1000 }, output: { sparksteelIngots: 1 }, requiredProgress: 60, requiredSkill: 'artOfAlloys', icon: IMAGE_PATHS.INGOTS.SPARKSTEEL },
    arcanite: { name: "Арканитовый слиток", input: { adamantiteIngots: 1, matter: 500 }, output: { arcaniteIngots: 1 }, requiredProgress: 80, requiredSkill: 'arcaneMetallurgy', icon: IMAGE_PATHS.INGOTS.ARCANITE },
};