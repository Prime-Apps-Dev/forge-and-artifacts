// src/data/definitions/items.js
export const items = {
      nail: {
          name: 'Простой Гвоздь', icon: '/img/items/nail.png', requiredSkill: null, baseIngot: 'ironIngots', baseIngotType: 'basic', hasInlaySlots: false, // <-- ИЗМЕНЕНО
          components: [{ id: 'forging', name: "Ковка", progress: 10, cost: { ironIngots: 1 }, workstation: 'anvil' }]
      },
      horseshoe: {
          name: 'Подкова', icon: '/img/items/horseshoe.png', requiredSkill: null, baseIngot: 'ironIngots', baseIngotType: 'basic', hasInlaySlots: false, // <-- ИЗМЕНЕНО
          components: [{ id: "shaping", name: "Формовка", progress: 25, cost: { ironIngots: 2 }, workstation: 'anvil' }]
      },
      dagger: {
          name: 'Простой Кинжал', icon: '/img/items/dagger.png', requiredSkill: null, baseIngot: 'ironIngots', baseIngotType: 'basic', hasInlaySlots: false, // <-- ИЗМЕНЕНО
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
          name: "Железный шлем", icon: '/img/items/iron_helmet.png', requiredSkill: 'blueprint_basicArmor', baseIngot: 'ironIngots', baseIngotType: 'basic', hasInlaySlots: true, // <-- ИЗМЕНЕНО
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
          name: "Железные поножи", icon: '/img/items/iron_greaves.png', requiredSkill: 'blueprint_basicArmor', baseIngot: 'ironIngots', baseIngotType: 'basic', hasInlaySlots: true, // <-- ИЗМЕНЕНО
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
          name: "Двуручный топор", icon: '/img/items/two_handed_axe.png', requiredSkill: 'blueprint_advancedTools', baseIngot: 'ironIngots', baseIngotType: 'basic', hasInlaySlots: true, // <-- ИЗМЕНЕНО
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
          name: "Усиленный щит", icon: '/img/items/reinforced_shield.png', requiredSkill: 'blueprint_advancedTools', baseIngot: 'ironIngots', baseIngotType: 'basic', hasInlaySlots: true, // <-- ИЗМЕНЕНО
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
          name: 'Медный браслет', icon: '/img/items/copper_bracelet.png', requiredSkill: 'jewelryCrafting', baseIngot: 'copperIngots', baseIngotType: 'basic', hasInlaySlots: true, // <-- ИЗМЕНЕНО
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
          name: "Медный амулет", icon: '/img/items/copper_amulet.png', requiredSkill: 'jewelryCrafting', baseIngot: 'copperIngots', baseIngotType: 'basic', hasInlaySlots: true, // <-- ИЗМЕНЕНО
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
          name: 'Бронзовый щит', icon: '/img/items/bronze_shield.png', requiredSkill: 'artOfAlloys', baseIngot: 'bronzeIngots', baseIngotType: 'basic', hasInlaySlots: true, // <-- ИЗМЕНЕНО
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
          name: "Бронзовый меч", icon: '/img/items/bronze_sword.png', requiredSkill: 'artOfAlloys', baseIngot: 'bronzeIngots', baseIngotType: 'basic', hasInlaySlots: true, // <-- ИЗМЕНЕНО
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
          name: "Бронзовая кираса", icon: '/img/items/bronze_cuirass.png', requiredSkill: 'blueprint_eliteArmor', baseIngot: 'bronzeIngots', baseIngotType: 'basic', hasInlaySlots: true, // <-- ИЗМЕНЕНО
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
          name: "Бронзовые перчатки", icon: '/img/items/bronze_gauntlets.png', requiredSkill: 'blueprint_eliteArmor', baseIngot: 'bronzeIngots', baseIngotType: 'basic', hasInlaySlots: true, // <-- ИЗМЕНЕНО
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
          name: "Бронзовый шлем", icon: '/img/items/bronze_helmet.png', requiredSkill: 'blueprint_eliteArmor', baseIngot: 'bronzeIngots', baseIngotType: 'basic', hasInlaySlots: true, // <-- ИЗМЕНЕНО
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
        name: "Бронзовые поножи", icon: '/img/items/bronze_greaves.png', requiredSkill: 'blueprint_eliteArmor', baseIngot: 'bronzeIngots', baseIngotType: 'basic', hasInlaySlots: true, // <-- ИЗМЕНЕНО
        components: [
            { id: "plates", name: "Фигурные пластины", progress: 220, cost: { bronzeIngots: 10 }, workstation: 'anvil', minigame: { triggerChance: 0.06, barSpeed: 2.0, zones: [ { from: 44, to: 56, quality: 'perfect', qualityBonus: 2.2, progressBonus: 10 }, { from: 34, to: 66, quality: 'good', qualityBonus: 1.4, progressBonus: 5 } ] } },
            { id: "straps", name: "Кожаные ремни", progress: 60, cost: { sparks: 250 }, workstation: 'workbench', requires: ["plates"] },
            { id: "assembly", name: "Сборка", progress: 50, requires: ["plates", "straps"], workstation: 'workbench' }
        ]
    },

    sparksteelMace: {
        name: "Булава из Искростали",
        icon: '/img/items/sparksteel_mace.png', // <-- ИЗМЕНЕНО
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
          name: "Богато украшенный меч", icon: '/img/items/ornate_greatsword.png', requiredSkill: 'blueprint_masterwork', baseIngot: 'bronzeIngots', baseIngotType: 'basic', hasInlaySlots: true, firstPlaythroughLocked: true, // <-- ИЗМЕНЕНО
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
            name: "Королевская корона", icon: '/img/items/royal_crown.png', requiredSkill: 'blueprint_masterwork', baseIngot: 'copperIngots', baseIngotType: 'basic', hasInlaySlots: true, firstPlaythroughLocked: true, // <-- ИЗМЕНЕНО
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
           name: "Мифриловый кинжал", icon: '/img/items/mithril_dagger.png', requiredSkill: 'blueprint_mithrilCrafting', baseIngot: 'mithrilIngots', baseIngotType: 'uncommon', hasInlaySlots: true, firstPlaythroughLocked: true, // <-- ИЗМЕНЕНО
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
           name: "Мифриловый щит", icon: '/img/items/mithril_shield.png', requiredSkill: 'blueprint_mithrilCrafting', baseIngot: 'mithrilIngots', baseIngotType: 'uncommon', hasInlaySlots: true, firstPlaythroughLocked: true, // <-- ИЗМЕНЕНО
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
           name: "Мифриловый длинный меч", icon: '/img/items/mithril_longsword.png', requiredSkill: 'blueprint_mithrilCrafting', baseIngot: 'mithrilIngots', baseIngotType: 'uncommon', hasInlaySlots: true, firstPlaythroughLocked: true, // <-- ИЗМЕНЕНО
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
           name: "Мифриловая кольчуга", icon: '/img/items/mithril_chainmail.png', requiredSkill: 'blueprint_mithrilCrafting', baseIngot: 'mithrilIngots', baseIngotType: 'uncommon', hasInlaySlots: true, firstPlaythroughLocked: true, // <-- ИЗМЕНЕНО
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
           name: "Адамантитовый нагрудник", icon: '/img/items/adamantite_platebody.png', requiredSkill: "blueprint_adamantiteForging", baseIngot: 'adamantiteIngots', baseIngotType: 'uncommon', hasInlaySlots: true, firstPlaythroughLocked: true, // <-- ИЗМЕНЕНО
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
           name: "Арканитовый чародейский клинок", icon: '/img/items/arcanite_spellblade.png', requiredSkill: "blueprint_arcaniteMastery", baseIngot: 'arcaniteIngots', baseIngotType: 'uncommon', hasInlaySlots: true, firstPlaythroughLocked: true, // <-- ИЗМЕНЕНО
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
            icon: '/img/items/adamantite_core.png', // <-- ИЗМЕНЕНО
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
            icon: '/img/items/stabilizing_gyroscope.png', // <-- ИЗМЕНЕНО
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
            icon: '/img/items/purified_mithril.png', // <-- ИЗМЕНЕНО
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
            icon: '/img/items/focusing_lens.png', // <-- ИЗМЕНЕНО
            firstPlaythroughLocked: true,
            components: [
                {id: 'casting', name: "Отливка основы линзы", progress: 3500, cost: {arcaniteIngots: 2}, workstation: 'anvil'},
                {id: 'polishing', name: "Ювелирная полировка", progress: 4500, cost: {gem: 15}, workstation: 'grindstone', requires:['casting']}
            ]
        }
};