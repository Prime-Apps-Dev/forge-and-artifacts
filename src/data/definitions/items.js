// src/data/definitions/items.js
import { IMAGE_PATHS } from '../../constants/paths';

export const items = {
      nail: {
          name: 'Простой Гвоздь', icon: IMAGE_PATHS.ITEMS.NAIL, requiredSkill: null, baseIngot: 'ironIngots', baseIngotType: 'basic', hasInlaySlots: false,
          components: [{ id: 'forging', name: "Ковка", progress: 10, cost: { ironIngots: 1 }, workstation: 'anvil' }]
      },
      horseshoe: {
          name: 'Подкова', icon: IMAGE_PATHS.ITEMS.HORSESHOE, requiredSkill: null, baseIngot: 'ironIngots', baseIngotType: 'basic', hasInlaySlots: false,
          components: [{ id: "shaping", name: "Формовка", progress: 25, cost: { ironIngots: 2 }, workstation: 'anvil' }]
      },
      dagger: {
          name: 'Простой Кинжал', icon: IMAGE_PATHS.ITEMS.DAGGER, requiredSkill: null, baseIngot: 'ironIngots', baseIngotType: 'basic', hasInlaySlots: false,
          components: [
              {
                  id: "blade", name: "Лезвие", progress: 40, cost: { ironIngots: 3 }, workstation: 'anvil',
                  minigame: {
                      triggerChance: 0.1,
                      barSpeed: 1.5,
                      zones: [
                          { from: 48, to: 52, quality: 'perfect', qualityBonus: 1.5, progressBonus: 5 },
                          { from: 40, to: 60, quality: 'good', qualityBonus: 1.0, progressBonus: 2 }
                      ]
                  }
              },
              { id: "hilt", name: "Рукоять", progress: 20, cost: { ironIngots: 2 }, workstation: 'workbench' },
              { id: "assembly", name: "Сборка", progress: 10, requires: ["blade", "hilt"], workstation: 'workbench' }
          ]
      },
      ironHelmet: {
          name: "Железный шлем", icon: IMAGE_PATHS.ITEMS.IRON_HELMET, requiredSkill: 'blueprint_basicArmor', baseIngot: 'ironIngots', baseIngotType: 'basic', hasInlaySlots: true,
          components: [
              {
                  id: "dome", name: "Купол", progress: 60, cost: { ironIngots: 5 }, workstation: 'anvil',
                  minigame: {
                      triggerChance: 0.08,
                      barSpeed: 1.6,
                      zones: [
                          { from: 47, to: 53, quality: 'perfect', qualityBonus: 1.8, progressBonus: 6 },
                          { from: 38, to: 62, quality: 'good', qualityBonus: 1.1, progressBonus: 3 }
                      ]
                  }
              },
              { id: "visor", name: "Забрало", progress: 30, cost: { ironIngots: 3 }, workstation: 'anvil', requires: ["dome"] },
              { id: "padding", name: "Подкладка", progress: 20, cost: { sparks: 50 }, workstation: 'workbench', requires: ["dome"] },
              { id: "assembly", name: "Сборка", progress: 15, requires: ["dome", "visor", "padding"], workstation: 'workbench' }
          ]
      },
      ironGreaves: {
          name: "Железные поножи", icon: IMAGE_PATHS.ITEMS.IRON_GREAVES, requiredSkill: 'blueprint_basicArmor', baseIngot: 'ironIngots', baseIngotType: 'basic', hasInlaySlots: true,
          components: [
              {
                  id: "plates", name: "Пластины", progress: 80, cost: { ironIngots: 7 }, workstation: 'anvil',
                  minigame: {
                      triggerChance: 0.07,
                      barSpeed: 1.7,
                      zones: [
                          { from: 46, to: 54, quality: 'perfect', qualityBonus: 1.7, progressBonus: 7 },
                          { from: 36, to: 64, quality: 'good', qualityBonus: 1.0, progressBonus: 3.5 }
                      ]
                  }
              },
              { id: "straps", name: "Ремни", progress: 25, cost: { sparks: 70 }, workstation: 'workbench', requires: ["plates"] },
              { id: "assembly", name: "Сборка", progress: 20, requires: ["plates", "straps"], workstation: 'workbench' }
          ]
      },
      twoHandedAxe: {
          name: "Двуручный топор", icon: IMAGE_PATHS.ITEMS.TWO_HANDED_AXE, requiredSkill: 'blueprint_advancedTools', baseIngot: 'ironIngots', baseIngotType: 'basic', hasInlaySlots: true,
          components: [
              {
                  id: "axehead", name: "Лезвие топора", progress: 120, cost: { ironIngots: 10 }, workstation: 'anvil',
                  minigame: {
                      triggerChance: 0.06,
                      barSpeed: 1.8,
                      zones: [
                          { from: 45, to: 55, quality: 'perfect', qualityBonus: 2.0, progressBonus: 8 },
                          { from: 35, to: 65, quality: 'good', qualityBonus: 1.2, progressBonus: 4 }
                      ]
                  }
              },
              { id: "handle", name: "Древко", progress: 40, cost: { ironIngots: 4 }, workstation: 'workbench' },
              { id: "sharpening", name: "Заточка", progress: 50, cost: { sparks: 100 }, workstation: 'grindstone', requires: ["axehead"] },
              { id: "assembly", name: "Сборка", progress: 30, requires: ["axehead", "handle"], workstation: 'workbench' }
          ]
      },
      reinforcedShield: {
          name: "Усиленный щит", icon: IMAGE_PATHS.ITEMS.REINFORCED_SHIELD, requiredSkill: 'blueprint_advancedTools', baseIngot: 'ironIngots', baseIngotType: 'basic', hasInlaySlots: true,
          components: [
              {
                  id: "base", name: "Основа", progress: 90, cost: { ironIngots: 8 }, workstation: 'anvil',
                  minigame: {
                      triggerChance: 0.07,
                      barSpeed: 1.7,
                      zones: [
                          { from: 47, to: 53, quality: 'perfect', qualityBonus: 1.7, progressBonus: 6 },
                          { from: 38, to: 62, quality: 'good', qualityBonus: 1.0, progressBonus: 3 }
                      ]
                  }
              },
              { id: "iron_rim", name: "Железная окантовка", progress: 50, cost: { ironIngots: 5 }, workstation: 'anvil', requires: ["base"] },
              { id: "boss", name: "Умбон", progress: 40, cost: { ironIngots: 3 }, workstation: 'anvil', requires: ["base"] },
              { id: "assembly", name: "Сборка", progress: 25, requires: ["base", "iron_rim", "boss"], workstation: 'workbench' }
          ]
      },
      copperBracelet: {
          name: 'Медный браслет', icon: IMAGE_PATHS.ITEMS.COPPER_BRACELET, requiredSkill: 'jewelryCrafting', baseIngot: 'copperIngots', baseIngotType: 'basic', hasInlaySlots: true,
          components: [
               { id: "shaping", name: "Формовка", progress: 50, cost: { copperIngots: 4 }, workstation: 'anvil' },
               {
                   id: "polishing", name: "Полировка", progress: 30, cost: { copperIngots: 2 }, workstation: 'grindstone', requires: ["shaping"],
                   minigame: {
                       triggerChance: 0.12,
                       barSpeed: 1.4,
                       zones: [
                           { from: 48, to: 52, quality: 'perfect', qualityBonus: 1.6, progressBonus: 5 },
                           { from: 40, to: 60, quality: 'good', qualityBonus: 0.9, progressBonus: 2 }
                       ]
                   }
               }
          ]
      },
      copperAmulet: {
          name: "Медный амулет", icon: IMAGE_PATHS.ITEMS.COPPER_AMULET, requiredSkill: 'jewelryCrafting', baseIngot: 'copperIngots', baseIngotType: 'basic', hasInlaySlots: true,
          components: [
              {
                  id: "pendant", name: "Подвеска", progress: 70, cost: { copperIngots: 6 }, workstation: 'anvil',
                  minigame: {
                      triggerChance: 0.10,
                      barSpeed: 1.5,
                      zones: [
                          { from: 47, to: 53, quality: 'perfect', qualityBonus: 1.7, progressBonus: 6 },
                          { from: 38, to: 62, quality: 'good', qualityBonus: 1.0, progressBonus: 2.5 }
                      ]
                  }
              },
              { id: "chain", name: "Цепочка", progress: 40, cost: { copperIngots: 4 }, workstation: 'workbench', requires: ["pendant"] }
          ]
      },
      bronzeShield: {
          name: 'Бронзовый щит', icon: IMAGE_PATHS.ITEMS.BRONZE_SHIELD, requiredSkill: 'artOfAlloys', baseIngot: 'bronzeIngots', baseIngotType: 'basic', hasInlaySlots: true,
          components: [
              {
                  id: 'base', name: 'Основа щита', progress: 100, cost: { bronzeIngots: 3 }, workstation: 'anvil',
                  minigame: {
                      triggerChance: 0.08,
                      barSpeed: 1.8,
                      zones: [
                          { from: 46, to: 54, quality: 'perfect', qualityBonus: 1.9, progressBonus: 7 },
                          { from: 36, to: 64, quality: 'good', qualityBonus: 1.1, progressBonus: 3.5 }
                      ]
                  }
              },
              { id: 'handle', name: 'Рукоять', progress: 30, cost: { ironIngots: 2 }, workstation: 'workbench' },
              { id: 'edging', name: 'Окантовка', progress: 20, cost: { bronzeIngots: 1 }, workstation: 'anvil', requires: ['base'] },
              { id: 'assembly', name: 'Сборка', progress: 15, requires: ['base', 'handle', 'edging'], workstation: 'workbench' }
          ]
      },
      bronzeSword: {
          name: "Бронзовый меч", icon: IMAGE_PATHS.ITEMS.BRONZE_SWORD, requiredSkill: 'artOfAlloys', baseIngot: 'bronzeIngots', baseIngotType: 'basic', hasInlaySlots: true,
           components: [
              {
                  id: "blade", name: "Клинок", progress: 150, cost: { bronzeIngots: 8 }, workstation: 'anvil',
                  minigame: {
                      triggerChance: 0.07,
                      barSpeed: 1.9,
                      zones: [
                          { from: 45, to: 55, quality: 'perfect', qualityBonus: 2.1, progressBonus: 9 },
                          { from: 35, to: 65, quality: 'good', qualityBonus: 1.3, progressBonus: 4.5 }
                      ]
                  }
              },
              { id: "guard", name: "Гарда", progress: 50, cost: { bronzeIngots: 3 }, workstation: 'anvil' },
              { id: "hilt", name: "Эфес", progress: 40, cost: { ironIngots: 2 }, workstation: 'workbench' },
              { id: "assembly", name: "Сборка", progress: 30, requires: ["blade", "guard", "hilt"], workstation: 'workbench' }
          ]
      },
      bronzeCuirass: {
          name: "Бронзовая кираса", icon: IMAGE_PATHS.ITEMS.BRONZE_CUIRASS, requiredSkill: 'blueprint_eliteArmor', baseIngot: 'bronzeIngots', baseIngotType: 'basic', hasInlaySlots: true,
          components: [
              {
                  id: 'breastplate', name: "Нагрудник", progress: 250, cost: { bronzeIngots: 12 }, workstation: 'anvil',
                  minigame: {
                      triggerChance: 0.06,
                      barSpeed: 2.0,
                      zones: [
                          { from: 44, to: 56, quality: 'perfect', qualityBonus: 2.2, progressBonus: 10 },
                          { from: 34, to: 66, quality: 'good', qualityBonus: 1.4, progressBonus: 5 }
                      ]
                  }
              },
              { id: 'backplate', name: "Наспинник", progress: 200, cost: { bronzeIngots: 10 }, workstation: 'anvil' },
              { id: 'straps', name: "Крепления", progress: 80, cost: { ironIngots: 5 }, workstation: 'workbench' },
              { id: 'assembly', name: 'Сборка', progress: 50, requires: ['breastplate', 'backplate', 'straps'], workstation: 'workbench' }
          ]
      },
      bronzeGauntlets: {
          name: "Бронзовые перчатки", icon: IMAGE_PATHS.ITEMS.BRONZE_GAUNTLETS, requiredSkill: 'blueprint_eliteArmor', baseIngot: 'bronzeIngots', baseIngotType: 'basic', hasInlaySlots: true,
           components: [
              {
                  id: 'plates', name: "Пластины", progress: 120, cost: { bronzeIngots: 6 }, workstation: 'anvil',
                  minigame: {
                      triggerChance: 0.08,
                      barSpeed: 1.8,
                      zones: [
                          { from: 46, to: 54, quality: 'perfect', qualityBonus: 1.9, progressBonus: 7 },
                          { from: 36, to: 64, quality: 'good', qualityBonus: 1.1, progressBonus: 3.5 }
                      ]
                  }
              },
              { id: 'joints', name: "Суставы", progress: 100, cost: { copperIngots: 4 }, workstation: 'workbench' },
              { id: 'lining', name: "Подкладка", progress: 50, cost: { sparks: 250 }, workstation: 'workbench' },
              { id: 'assembly', name: 'Сборка', progress: 40, requires: ['plates', 'joints', 'lining'], workstation: 'workbench' }
          ]
      },
      bronzeHelmet: {
          name: "Бронзовый шлем", icon: IMAGE_PATHS.ITEMS.BRONZE_HELMET, requiredSkill: 'blueprint_eliteArmor', baseIngot: 'bronzeIngots', baseIngotType: 'basic', hasInlaySlots: true,
          components: [
              {
                  id: "dome", name: "Купол", progress: 200, cost: { bronzeIngots: 8 }, workstation: 'anvil',
                  minigame: {
                      triggerChance: 0.07,
                      barSpeed: 1.9,
                      zones: [
                          { from: 45, to: 55, quality: 'perfect', qualityBonus: 2.1, progressBonus: 9 },
                          { from: 35, to: 65, quality: 'good', qualityBonus: 1.3, progressBonus: 4.5 }
                      ]
                  }
              },
              { id: "cheek_guards", name: "Нащечники", progress: 80, cost: { bronzeIngots: 4 }, workstation: 'anvil', requires: ["dome"] },
              { id: "padding", name: "Прочная подкладка", progress: 70, cost: { sparks: 200 }, workstation: 'workbench', requires: ["dome"] },
              { id: "assembly", name: "Сборка", progress: 40, requires: ["dome", "cheek_guards", "padding"], workstation: 'workbench' }
          ]
      },
      bronzeGreaves: {
        name: "Бронзовые поножи", icon: IMAGE_PATHS.ITEMS.BRONZE_GREAVES, requiredSkill: 'blueprint_eliteArmor', baseIngot: 'bronzeIngots', baseIngotType: 'basic', hasInlaySlots: true,
        components: [
            { id: "plates", name: "Фигурные пластины", progress: 220, cost: { bronzeIngots: 10 }, workstation: 'anvil', minigame: { triggerChance: 0.06, barSpeed: 2.0, zones: [ { from: 44, to: 56, quality: 'perfect', qualityBonus: 2.2, progressBonus: 10 }, { from: 34, to: 66, quality: 'good', qualityBonus: 1.4, progressBonus: 5 } ] } },
            { id: "straps", name: "Кожаные ремни", progress: 60, cost: { sparks: 250 }, workstation: 'workbench', requires: ["plates"] },
            { id: "assembly", name: "Сборка", progress: 50, requires: ["plates", "straps"], workstation: 'workbench' }
        ]
    },

    sparksteelMace: {
        name: "Булава из Искростали",
        icon: IMAGE_PATHS.ITEMS.SPARKSTEEL_MACE,
        requiredSkill: 'artOfAlloys',
        baseIngot: 'sparksteelIngots',
        baseIngotType: 'uncommon',
        hasInlaySlots: true,
        components: [
            { id: "head", name: "Навершие из Искростали", progress: 350, cost: { sparksteelIngots: 5 }, workstation: 'anvil', minigame: { triggerChance: 0.08, barSpeed: 2.2, zones: [ { from: 45, to: 55, quality: 'perfect', qualityBonus: 2.3, progressBonus: 11 }, { from: 35, to: 65, quality: 'good', qualityBonus: 1.5, progressBonus: 5.5 } ] } },
            { id: "handle", name: "Укрепленная рукоять", progress: 100, cost: { ironIngots: 15 }, workstation: 'workbench' },
            { id: "spikes", name: "Энергетические шипы", progress: 150, cost: { sparks: 2500 }, workstation: 'grindstone', requires: ["head"] },
            { id: "assembly", name: "Сборка", progress: 70, requires: ["head", "handle", "spikes"], workstation: 'workbench' }
        ]
    },
       ornateGreatsword: {
          name: "Богато украшенный меч", icon: IMAGE_PATHS.ITEMS.ORNATE_GREATSWORD, requiredSkill: 'blueprint_masterwork', baseIngot: 'bronzeIngots', baseIngotType: 'basic', hasInlaySlots: true, firstPlaythroughLocked: true,
              components: [
              {
                  id: "blade", name: "Дамасский клинок", progress: 400, cost: { bronzeIngots: 15, ironIngots: 10 }, workstation: 'anvil',
                  minigame: {
                      triggerChance: 0.05,
                      barSpeed: 2.1,
                      zones: [
                          { from: 43, to: 57, quality: 'perfect', qualityBonus: 2.5, progressBonus: 12 },
                          { from: 33, to: 67, quality: 'good', qualityBonus: 1.5, progressBonus: 6 }
                      ]
                  }
              },
              { id: "guard", name: "Серебряная гарда", progress: 150, cost: { copperIngots: 10, sparks: 500 }, workstation: 'workbench' },
              { id: "hilt", name: "Украшенный эфес", progress: 120, cost: { ironIngots: 5, matter: 100 }, workstation: 'workbench' },
              { id: "engraving", name: "Гравировка", progress: 200, cost: { sparks: 1000 }, workstation: 'grindstone', requires: ["blade"] },
              { id: 'assembly', name: 'Финальная сборка', progress: 80, requires: ['blade', 'guard', 'hilt', 'engraving'], workstation: 'workbench' }
          ]
       },
       royalCrown: {
            name: "Королевская корона", icon: IMAGE_PATHS.ITEMS.ROYAL_CROWN, requiredSkill: 'blueprint_masterwork', baseIngot: 'copperIngots', baseIngotType: 'basic', hasInlaySlots: true, firstPlaythroughLocked: true,
            components: [
              {
                  id: 'frame', name: "Золотая основа", progress: 300, cost: { copperIngots: 20, sparks: 2000 }, workstation: 'anvil',
                  minigame: {
                      triggerChance: 0.06,
                      barSpeed: 2.0,
                      zones: [
                          { from: 45, to: 55, quality: 'perfect', qualityBonus: 2.3, progressBonus: 10 },
                          { from: 35, to: 65, quality: 'good', qualityBonus: 1.4, progressBonus: 5 }
                      ]
                  }
              },
              { id: 'filigree', name: "Серебряная филигрань", progress: 250, cost: { copperIngots: 15, sparks: 1500 }, workstation: 'workbench' },
              { id: 'gem_setting', name: "Оправка для камней", progress: 150, cost: { bronzeIngots: 10, matter: 200 }, workstation: 'workbench' },
              { id: 'assembly', name: 'Финальная сборка', progress: 100, requires: ['frame', 'filigree', 'gem_setting'], workstation: 'workbench' }
            ]
       },
       mithrilDagger: {
           name: "Мифриловый кинжал", icon: IMAGE_PATHS.ITEMS.MITHRIL_DAGGER, requiredSkill: 'blueprint_mithrilCrafting', baseIngot: 'mithrilIngots', baseIngotType: 'uncommon', hasInlaySlots: true, firstPlaythroughLocked: true,
           components: [
               {
                   id: 'blade', name: 'Мифриловый клинок', progress: 500, cost: { mithrilIngots: 5 }, workstation: 'anvil',
                   minigame: {
                       triggerChance: 0.05,
                       barSpeed: 2.2,
                       zones: [
                           { from: 48, to: 52, quality: 'perfect', qualityBonus: 2.6, progressBonus: 13 },
                           { from: 40, to: 60, quality: 'good', qualityBonus: 1.6, progressBonus: 6.5 }
                       ]
                   }
               },
               { id: 'hilt', name: 'Укрепленная рукоять', progress: 150, cost: { ironIngots: 10 }, workstation: 'workbench' },
               { id: 'sharpening', name: 'Магическая заточка', progress: 300, cost: { sparks: 2500 }, workstation: 'grindstone', requires: ['blade'] },
               { id: 'assembly', name: 'Сборка', progress: 100, requires: ['blade', 'hilt'], workstation: 'workbench' }
           ]
       },
       mithrilShield: {
           name: "Мифриловый щит", icon: IMAGE_PATHS.ITEMS.MITHRIL_SHIELD, requiredSkill: 'blueprint_mithrilCrafting', baseIngot: 'mithrilIngots', baseIngotType: 'uncommon', hasInlaySlots: true, firstPlaythroughLocked: true,
           components: [
              {
                id: 'base', name: 'Мифриловая основа', progress: 800, cost: { mithrilIngots: 8 }, workstation: 'anvil',
                minigame: {
                    triggerChance: 0.04,
                    barSpeed: 2.5,
                    zones: [
                        { from: 49, to: 51, quality: 'perfect', qualityBonus: 2.8, progressBonus: 15 },
                        { from: 42, to: 58, quality: 'good', qualityBonus: 1.8, progressBonus: 7.5 }
                    ]
                }
              },
              { id: 'edging', name: 'Бронзовая окантовка', progress: 200, cost: { bronzeIngots: 20 }, workstation: 'anvil' },
              { id: 'infusion', name: 'Насыщение материей', progress: 400, cost: { matter: 1500 }, workstation: 'workbench', requires: ['base'] },
              { id: 'assembly', name: 'Сборка', progress: 150, requires: ['base', 'edging', 'infusion'], workstation: 'workbench' }
           ]
       },
       mithrilLongsword: {
           name: "Мифриловый длинный меч", icon: IMAGE_PATHS.ITEMS.MITHRIL_LONGSWORD, requiredSkill: 'blueprint_mithrilCrafting', baseIngot: 'mithrilIngots', baseIngotType: 'uncommon', hasInlaySlots: true, firstPlaythroughLocked: true,
           components: [
               {
                   id: "blade", name: "Длинный клинок", progress: 900, cost: { mithrilIngots: 10 }, workstation: 'anvil',
                   minigame: {
                       triggerChance: 0.04,
                       barSpeed: 2.6,
                       zones: [
                           { from: 48, to: 52, quality: 'perfect', qualityBonus: 3.0, progressBonus: 16 },
                           { from: 40, to: 60, quality: 'good', qualityBonus: 2.0, progressBonus: 8 }
                       ]
                   }
               },
               { id: "guard", name: "Бронзовая гарда", progress: 250, cost: { bronzeIngots: 8 }, workstation: 'anvil'},
               { id: "hilt", name: "Эфес из железного дерева", progress: 300, cost: { sparks: 3000 }, workstation: 'workbench'},
               { id: "sharpening", name: "Финальная заточка", progress: 400, cost: { mithrilIngots: 2 }, requires: ['blade'], workstation: 'grindstone'},
               { id: "assembly", name: "Сборка", progress: 100, requires: ['blade', 'guard', 'hilt'], workstation: 'workbench'}
           ]
       },
       mithrilChainmail: {
           name: "Мифриловая кольчуга", icon: IMAGE_PATHS.ITEMS.MITHRIL_CHAINMAIL, requiredSkill: 'blueprint_mithrilCrafting', baseIngot: 'mithrilIngots', baseIngotType: 'uncommon', hasInlaySlots: true, firstPlaythroughLocked: true,
           components: [
               {
                   id: "rings", name: "Плетение колец", progress: 1500, cost: { mithrilIngots: 15 }, workstation: 'workbench',
                   minigame: {
                       triggerChance: 0.03,
                       barSpeed: 2.8,
                       zones: [
                           { from: 47, to: 53, quality: 'perfect', qualityBonus: 3.2, progressBonus: 18 },
                           { from: 38, to: 62, quality: 'good', qualityBonus: 2.2, progressBonus: 9 }
                       ]
                   }
               },
               { id: "straps", name: "Ремни и заклепки", progress: 300, cost: { ironIngots: 20 }, workstation: 'workbench'},
               { id: "assembly", name: "Сборка", progress: 200, requires: ['rings', 'straps'], workstation: 'workbench'}
           ]
       },
       adamantitePlatebody: {
           name: "Адамантитовый нагрудник", icon: IMAGE_PATHS.ITEMS.ADAMANTITE_PLATEBODY, requiredSkill: "blueprint_adamantiteForging", baseIngot: 'adamantiteIngots', baseIngotType: 'uncommon', hasInlaySlots: true, firstPlaythroughLocked: true,
           components: [
               {
                   id: 'main_plate', name: 'Цельная пластина', progress: 2000, cost: { adamantiteIngots: 10 }, workstation: 'anvil',
                   minigame: {
                       triggerChance: 0.03,
                       barSpeed: 3.0,
                       zones: [
                           { from: 46, to: 54, quality: 'perfect', qualityBonus: 3.5, progressBonus: 20 },
                           { from: 36, to: 64, quality: 'good', qualityBonus: 2.5, progressBonus: 10 }
                       ]
                   }
               },
               { id: 'joint_plates', name: 'Соединительные пластины', progress: 1200, cost: { mithrilIngots: 25 }, workstation: 'anvil'},
               { id: 'padding', name: 'Силовая подкладка', progress: 800, cost: { matter: 500 }, workstation: 'workbench'},
               { id: 'assembly', name: 'Сборка', progress: 500, requires: ['main_plate', 'joint_plates', 'padding'], workstation: 'workbench'}
           ]
       },
       arcaniteSpellblade: {
           name: "Арканитовый чародейский клинок", icon: IMAGE_PATHS.ITEMS.ARCANITE_SPELLBLADE, requiredSkill: "blueprint_arcaniteMastery", baseIngot: 'arcaniteIngots', baseIngotType: 'uncommon', hasInlaySlots: true, firstPlaythroughLocked: true,
           components: [
               {
                   id: 'core', name: 'Ядро из арканита', progress: 3000, cost: { arcaniteIngots: 5 }, workstation: 'anvil',
                   minigame: {
                       triggerChance: 0.02,
                       barSpeed: 3.5,
                       zones: [
                           { from: 48, to: 52, quality: 'perfect', qualityBonus: 4.0, progressBonus: 25 },
                           { from: 40, to: 60, quality: 'good', qualityBonus: 3.0, progressBonus: 12.5 }
                       ]
                   }
               },
               { id: 'edge', name: 'Мифриловые лезвия', progress: 1500, cost: { mithrilIngots: 20 }, workstation: 'grindstone'},
               { id: 'hilt', name: 'Рукоять с самоцветом', progress: 1000, cost: { gem: 20, sparks: 25000 }, workstation: 'workbench'},
               { id: 'enchanting', name: 'Наложение чар', progress: 2500, cost: { matter: 15000 }, requires:['core', 'edge', 'hilt'], workstation: 'workbench'}
           ]
       },
        craftable_adamantiteCore: {
            name: "Адамантитовое ядро",
            isQuestRecipe: true,
            isArtifactComponent: true,
            icon: IMAGE_PATHS.ITEMS.CRAFTABLE_ADAMANTITE_CORE,
            firstPlaythroughLocked: true,
            components: [
                {id: 'molding', name: "Отливка формы", progress: 2500, cost: {adamantiteIngots: 15}, workstation: 'anvil'},
                {id: 'compression', name: "Сверхплотное сжатие", progress: 3500, cost: {sparks: 50000}, workstation: 'anvil', requires:['molding']},
                {id: 'cooling', name: "Магическое охлаждение", progress: 1500, cost: {matter: 7500}, workstation: 'workbench', requires:['compression']}
            ]
        },
        craftable_runeOfFortitude: {
            name: "Руна Стойкости",
            isQuestRecipe: true,
            isArtifactComponent: true,
            icon: IMAGE_PATHS.ITEMS.CRAFTABLE_RUNE_OF_FORTITUDE,
            firstPlaythroughLocked: true,
            components: [
                {id: 'carving', name: "Вырезание на арканите", progress: 4000, cost: {arcaniteIngots: 3}, workstation: 'grindstone'},
                {id: 'empowering', name: "Наполнение руны", progress: 5000, cost: {matter: 12000}, workstation: 'workbench', requires:['carving']}
            ]
        },
        craftable_purifiedMithril: {
            name: "Очищенный Мифрил",
            isQuestRecipe: true,
            isArtifactComponent: true,
            icon: IMAGE_PATHS.ITEMS.CRAFTABLE_PURIFIED_MITHRIL,
            firstPlaythroughLocked: true,
            components: [
                {id: 'remelting', name: "Многократная переплавка", progress: 3000, cost: {mithrilIngots: 20}, workstation: 'anvil'},
                {id: 'filtering', name: "Фильтрация через искры", progress: 2000, cost: {sparks: 30000}, workstation: 'workbench', requires:['remelting']}
            ]
        },
        craftable_focusingLens: {
            name: "Фокусирующая Линза",
            isQuestRecipe: true,
            isArtifactComponent: true,
            icon: IMAGE_PATHS.ITEMS.CRAFTABLE_FOCUSING_LENS,
            firstPlaythroughLocked: true,
            components: [
                {id: 'casting', name: "Отливка основы линзы", progress: 3500, cost: {arcaniteIngots: 2}, workstation: 'anvil'},
                {id: 'polishing', name: "Ювелирная полировка", progress: 4500, cost: {gem: 15}, workstation: 'grindstone', requires:['casting']}
            ]
        },
        ironCrowbar: {
            name: 'Железный Лом', icon: IMAGE_PATHS.ITEMS.IRON_CROWBAR, requiredSkill: null, baseIngot: 'ironIngots', baseIngotType: 'basic', hasInlaySlots: false,
            components: [
                { id: 'shaping', name: "Формовка", progress: 30, cost: { ironIngots: 2 }, workstation: 'anvil' },
                { id: 'handle', name: "Рукоять", progress: 15, cost: { ironIngots: 1 }, workstation: 'workbench', requires: ["shaping"] }
            ]
        },
        copperCauldron: {
            name: 'Медный Котелок', icon: IMAGE_PATHS.ITEMS.COPPER_CAULDRON, requiredSkill: 'findCopper', baseIngot: 'copperIngots', baseIngotType: 'basic', hasInlaySlots: false,
            components: [
                {
                    id: 'body', name: "Корпус", progress: 80, cost: { copperIngots: 6 }, workstation: 'anvil',
                    minigame: {
                        triggerChance: 0.1,
                        barSpeed: 1.6,
                        zones: [
                            { from: 46, to: 54, quality: 'perfect', qualityBonus: 1.8, progressBonus: 6 },
                            { from: 38, to: 62, quality: 'good', qualityBonus: 1.0, progressBonus: 3 }
                        ]
                    }
                },
                { id: 'handle', name: "Ручка", progress: 30, cost: { copperIngots: 2 }, workstation: 'workbench', requires: ["body"] }
            ]
        },
        bronzeGreataxe: {
            name: 'Бронзовая Секира', icon: IMAGE_PATHS.ITEMS.BRONZE_GREATAXE, requiredSkill: 'blueprint_fineWeapons', baseIngot: 'bronzeIngots', baseIngotType: 'basic', hasInlaySlots: true,
            components: [
                {
                    id: 'axehead', name: "Лезвие секиры", progress: 180, cost: { bronzeIngots: 10 }, workstation: 'anvil',
                    minigame: {
                        triggerChance: 0.08,
                        barSpeed: 2.0,
                        zones: [
                            { from: 45, to: 55, quality: 'perfect', qualityBonus: 2.2, progressBonus: 10 },
                            { from: 35, to: 65, quality: 'good', qualityBonus: 1.4, progressBonus: 5 }
                        ]
                    }
                },
                { id: 'haft', name: "Древко", progress: 60, cost: { ironIngots: 5 }, workstation: 'workbench' },
                { id: 'sharpening', name: "Заточка", progress: 70, cost: { sparks: 200 }, workstation: 'grindstone', requires: ["axehead"] },
                { id: 'assembly', name: "Сборка", progress: 40, requires: ["axehead", "haft"], workstation: 'workbench' }
            ]
        },
        sparksteelToolset: {
            name: 'Комплект инструментов из Искростали', icon: IMAGE_PATHS.ITEMS.SPARKSTEEL_TOOLSET, requiredSkill: 'optimizedSmelting', baseIngot: 'sparksteelIngots', baseIngotType: 'uncommon', hasInlaySlots: true,
            components: [
                { id: 'hammer_head', name: "Боек молота", progress: 150, cost: { sparksteelIngots: 2 }, workstation: 'anvil' },
                { id: 'chisel_blade', name: "Лезвие зубила", progress: 120, cost: { sparksteelIngots: 1 }, workstation: 'grindstone' },
                { id: 'pliers_jaws', name: "Губки клещей", progress: 100, cost: { sparksteelIngots: 1 }, workstation: 'anvil' },
                { id: 'handles', name: "Рукояти", progress: 80, cost: { ironIngots: 10 }, workstation: 'workbench', requires: ["hammer_head", "chisel_blade", "pliers_jaws"] },
                { id: 'assembly', name: "Сборка комплекта", progress: 100, cost: { matter: 50 }, requires: ["hammer_head", "chisel_blade", "pliers_jaws", "handles"], workstation: 'workbench' }
            ]
        },
        ironVice: {
            name: 'Железные Тиски', icon: IMAGE_PATHS.ITEMS.IRON_VICE, requiredSkill: 'divisionOfLabor', baseIngot: 'ironIngots', baseIngotType: 'basic', hasInlaySlots: false,
            components: [
                { id: 'frame', name: "Основа", progress: 100, cost: { ironIngots: 8 }, workstation: 'anvil' },
                { id: 'screw', name: "Винтовой механизм", progress: 50, cost: { ironIngots: 4 }, workstation: 'workbench', requires: ["frame"] },
                { id: 'assembly', name: "Сборка", progress: 30, requires: ["frame", "screw"], workstation: 'workbench' }
            ]
        },
        copperChain: {
            name: 'Медная Цепь', icon: IMAGE_PATHS.ITEMS.COPPER_CHAIN, requiredSkill: 'findCopper', baseIngot: 'copperIngots', baseIngotType: 'basic', hasInlaySlots: false,
            components: [
                { id: 'links', name: "Плетение звеньев", progress: 60, cost: { copperIngots: 5 }, workstation: 'workbench' },
                { id: 'fastener', name: "Застежка", progress: 20, cost: { copperIngots: 1 }, workstation: 'anvil', requires: ["links"] }
            ]
        },
        bronzeHammer: {
            name: 'Бронзовый Молот', icon: IMAGE_PATHS.ITEMS.BRONZE_HAMMER, requiredSkill: 'artOfAlloys', baseIngot: 'bronzeIngots', baseIngotType: 'basic', hasInlaySlots: true,
            components: [
                {
                    id: 'head', name: "Боек", progress: 100, cost: { bronzeIngots: 5 }, workstation: 'anvil',
                    minigame: {
                        triggerChance: 0.1,
                        barSpeed: 1.8,
                        zones: [
                            { from: 47, to: 53, quality: 'perfect', qualityBonus: 2.0, progressBonus: 8 },
                            { from: 38, to: 62, quality: 'good', qualityBonus: 1.2, progressBonus: 4 }
                        ]
                    }
                },
                { id: 'handle', name: "Рукоять", progress: 40, cost: { ironIngots: 3 }, workstation: 'workbench' },
                { id: 'assembly', name: "Сборка", progress: 20, requires: ["head", "handle"], workstation: 'workbench' }
            ]
        },
        armorRepairKit: {
            name: 'Комплект для Ремонта Брони', icon: IMAGE_PATHS.ITEMS.ARMOR_REPAIR_KIT, requiredSkill: 'blueprint_eliteArmor', baseIngot: 'ironIngots', baseIngotType: 'basic', hasInlaySlots: false,
            components: [
                { id: 'plates', name: "Ремкомплектные пластины", progress: 80, cost: { ironIngots: 5, copperIngots: 3 }, workstation: 'anvil' },
                { id: 'tools', name: "Специальные инструменты", progress: 60, cost: { sparks: 200 }, workstation: 'grindstone' },
                { id: 'pouches', name: "Сумка для инструментов", progress: 40, cost: { matter: 50 }, workstation: 'workbench' },
                { id: 'packing', name: "Упаковка", progress: 20, requires: ["plates", "tools", "pouches"], workstation: 'workbench' }
            ]
        },
        mithrilBow: {
            name: 'Мифриловый Лук', icon: IMAGE_PATHS.ITEMS.MITHRIL_BOW, requiredSkill: 'blueprint_mithrilCrafting', baseIngot: 'mithrilIngots', baseIngotType: 'uncommon', hasInlaySlots: true, firstPlaythroughLocked: true,
            components: [
                {
                    id: 'limb_core', name: "Основа плеч", progress: 600, cost: { mithrilIngots: 7 }, workstation: 'anvil',
                    minigame: {
                        triggerChance: 0.04,
                        barSpeed: 2.4,
                        zones: [
                            { from: 48, to: 52, quality: 'perfect', qualityBonus: 2.7, progressBonus: 14 },
                            { from: 40, to: 60, quality: 'good', qualityBonus: 1.7, progressBonus: 7 }
                        ]
                    }
                },
                { id: 'string', name: "Тетива", progress: 200, cost: { sparks: 2000, matter: 100 }, workstation: 'workbench' },
                { id: 'grip', name: "Рукоять", progress: 150, cost: { bronzeIngots: 10 }, workstation: 'workbench' },
                { id: 'assembly', name: "Сборка", progress: 100, requires: ["limb_core", "string", "grip"], workstation: 'workbench' }
            ]
        },
        adamantiteHelmet: {
            name: 'Адамантитовый Шлем', icon: IMAGE_PATHS.ITEMS.ADAMANTITE_HELMET, requiredSkill: 'blueprint_adamantiteForging', baseIngot: 'adamantiteIngots', baseIngotType: 'uncommon', hasInlaySlots: true, firstPlaythroughLocked: true,
            components: [
                {
                    id: 'main_shell', name: "Основная оболочка", progress: 1500, cost: { adamantiteIngots: 8 }, workstation: 'anvil',
                    minigame: {
                        triggerChance: 0.03,
                        barSpeed: 3.2,
                        zones: [
                            { from: 46, to: 54, quality: 'perfect', qualityBonus: 3.8, progressBonus: 22 },
                            { from: 36, to: 64, quality: 'good', qualityBonus: 2.8, progressBonus: 11 }
                        ]
                    }
                },
                { id: 'visor_plate', name: "Пластина забрала", progress: 800, cost: { adamantiteIngots: 4 }, workstation: 'anvil', requires: ["main_shell"] },
                { id: 'inner_lining', name: "Внутренняя подкладка", progress: 600, cost: { matter: 300, sparks: 5000 }, workstation: 'workbench', requires: ["main_shell"] },
                { id: 'assembly', name: "Финальная сборка", progress: 400, requires: ["main_shell", "visor_plate", "inner_lining"], workstation: 'workbench' }
            ]
        },
        arcaniteAmulet: {
            name: 'Арканитовый Амулет', icon: IMAGE_PATHS.ITEMS.ARCANITE_AMULET, requiredSkill: 'blueprint_arcaniteMastery', baseIngot: 'arcaniteIngots', baseIngotType: 'uncommon', hasInlaySlots: true, firstPlaythroughLocked: true,
            components: [
                {
                    id: 'pendant_base', name: "Основа подвески", progress: 2000, cost: { arcaniteIngots: 3 }, workstation: 'anvil',
                    minigame: {
                        triggerChance: 0.02,
                        barSpeed: 3.8,
                        zones: [
                            { from: 48, to: 52, quality: 'perfect', qualityBonus: 4.5, progressBonus: 28 },
                            { from: 40, to: 60, quality: 'good', qualityBonus: 3.5, progressBonus: 14 }
                        ]
                    }
                },
                { id: 'gem_setting', name: "Оправа для самоцвета", progress: 1000, cost: { gem: 10, sparks: 10000 }, workstation: 'workbench', requires: ["pendant_base"] },
                { id: 'enchantment', name: "Наложение чар", progress: 1500, cost: { matter: 8000 }, workstation: 'workbench', requires: ["pendant_base", "gem_setting"] }
            ]
        },
        sparksteelJewelersKit: {
            name: 'Набор ювелирных инструментов из Искростали', icon: IMAGE_PATHS.ITEMS.SPARKSTEEL_JEWELERS_KIT, requiredSkill: 'jewelryCrafting', baseIngot: 'sparksteelIngots', baseIngotType: 'uncommon', hasInlaySlots: false,
            components: [
                { id: 'mini_anvil', name: "Мини-наковальня", progress: 100, cost: { sparksteelIngots: 1 }, workstation: 'anvil' },
                { id: 'precision_pliers', name: "Прецизионные клещи", progress: 80, cost: { sparksteelIngots: 1 }, workstation: 'workbench' },
                { id: 'fine_file', name: "Надфиль", progress: 60, cost: { sparksteelIngots: 1 }, workstation: 'grindstone' },
                { id: 'assembly', name: "Сборка набора", progress: 50, requires: ["mini_anvil", "precision_pliers", "fine_file"], workstation: 'workbench' }
            ]
        },
        sparksteelCrossbow: {
            name: 'Арбалет из Искростали', icon: IMAGE_PATHS.ITEMS.SPARKSTEEL_CROSSBOW, requiredSkill: 'blueprint_fineWeapons', baseIngot: 'sparksteelIngots', baseIngotType: 'uncommon', hasInlaySlots: true,
            components: [
                {
                    id: 'limb_core', name: "Плечи арбалета", progress: 400, cost: { sparksteelIngots: 5 }, workstation: 'anvil',
                    minigame: {
                        triggerChance: 0.07,
                        barSpeed: 2.3,
                        zones: [
                            { from: 46, to: 54, quality: 'perfect', qualityBonus: 2.4, progressBonus: 12 },
                            { from: 36, to: 64, quality: 'good', qualityBonus: 1.6, progressBonus: 6 }
                        ]
                    }
                },
                { id: 'stock', name: "Ложа", progress: 150, cost: { ironIngots: 15 }, workstation: 'workbench' },
                { id: 'trigger_mechanism', name: "Спусковой механизм", progress: 120, cost: { bronzeIngots: 5, sparks: 1500 }, workstation: 'workbench', requires: ["limb_core"] },
                { id: 'assembly', name: "Финальная сборка", progress: 80, requires: ["limb_core", "stock", "trigger_mechanism"], workstation: 'workbench' }
            ]
        },
        sparksteelPincers: {
            name: 'Клещи из Искростали', icon: IMAGE_PATHS.ITEMS.SPARKSTEEL_PINCERS, requiredSkill: 'artOfAlloys', baseIngot: 'sparksteelIngots', baseIngotType: 'uncommon', hasInlaySlots: false,
            components: [
                { id: 'jaws', name: "Губки", progress: 100, cost: { sparksteelIngots: 2 }, workstation: 'anvil' },
                { id: 'pivot', name: "Шарнир", progress: 40, cost: { ironIngots: 3 }, workstation: 'workbench' },
                { id: 'handles', name: "Рукояти", progress: 60, cost: { sparks: 500 }, workstation: 'grindstone' },
                { id: 'assembly', name: "Сборка", progress: 30, requires: ["jaws", "pivot", "handles"], workstation: 'workbench' }
            ]
        },
        sparksteelArmorPlates: {
            name: 'Бронепластины из Искростали', icon: IMAGE_PATHS.ITEMS.SPARKSTEEL_ARMOR_PLATES, requiredSkill: 'blueprint_eliteArmor', baseIngot: 'sparksteelIngots', baseIngotType: 'uncommon', hasInlaySlots: true,
            components: [
                {
                    id: 'molding', name: "Формовка", progress: 300, cost: { sparksteelIngots: 4 }, workstation: 'anvil',
                    minigame: {
                        triggerChance: 0.06,
                        barSpeed: 2.1,
                        zones: [
                            { from: 45, to: 55, quality: 'perfect', qualityBonus: 2.3, progressBonus: 11 },
                            { from: 35, to: 65, quality: 'good', qualityBonus: 1.5, progressBonus: 5.5 }
                        ]
                    }
                },
                { id: 'reinforcements', name: "Усиление", progress: 150, cost: { bronzeIngots: 8 }, workstation: 'anvil', requires: ["molding"] },
                { id: 'polishing', name: "Полировка", progress: 100, cost: { sparks: 1000 }, workstation: 'grindstone', requires: ["molding"] }
            ]
        },
        sparksteelWatch: {
            name: 'Часы из Искростали', icon: IMAGE_PATHS.ITEMS.SPARKSTEEL_WATCH, requiredSkill: 'legendaryClients', baseIngot: 'sparksteelIngots', baseIngotType: 'uncommon', hasInlaySlots: true,
            components: [
                { id: 'gear_assembly', name: "Сборка шестеренок", progress: 200, cost: { sparksteelIngots: 2 }, workstation: 'workbench' },
                { id: 'casing', name: "Корпус", progress: 180, cost: { copperIngots: 10, sparks: 500 }, workstation: 'anvil' },
                { id: 'face_crystal', name: "Лицевой кристалл", progress: 120, cost: { gem: 1 }, workstation: 'grindstone' },
                { id: 'mechanism', name: "Малый механизм", progress: 250, cost: { matter: 100, sparks: 2000 }, workstation: 'workbench', requires: ["gear_assembly", "casing"] },
                { id: 'final_assembly', name: "Финальная сборка", progress: 100, requires: ["gear_assembly", "casing", "face_crystal", "mechanism"], workstation: 'workbench' }
            ]
        }
};