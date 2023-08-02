-- <pre>

return {
    ["Авангард"] = {
        ["engname"] = "Vanguard",
        ["gs"]      = "Чемпиона Авангарда",
        ["gp"]      = "Чемпионов Авангарда",
        ["type"]    = "Класс",
        ["icon"]    = "Vanguard TFT icon.svg",
        ["synergy"] = "Чемпионы '''Авангарда''' получают {{as|'''дополнительную''' броню}}.",
        ["levels"]  = {
            [2] = "+125 брони",
            [4] = "+250 брони"
        },
    },
    ["Валькирия"] = {
        ["engname"] = "Valkyrie",
        ["type"] = "Фракция",
        ["icon"] = "Valkyrie TFT icon.svg",
        ["synergy"] = "Пока в команде [[File:Valkyrie TFT gold icon.png|20px]] 2 '''Валькирии''', автоатаки и умения всех '''Валькирий''' становятся критическими против врагов, у которых осталось {{as|'''менее''' 50% здоровья}}."
    },
    ["Дебошир"] = {
        ["engname"] = "Brawler",
        ["gs"]      = "Дебошира",
        ["gp"]      = "Дебоширов",
        ["type"]    = "Класс",
        ["icon"]    = "Brawler TFT icon.svg",
        ["synergy"] = "'''Дебоширы''' получают прибавку в {{as|'''максимальному''' запасу здоровья}}.",
        ["levels"]  = {
            [2] = "+350",
            [4] = "+650"
        }
    },
    ["Диверсант"] = {
        ["engname"]      = "Infiltrator",
        ["gs"]           = "Диверсанта",
        ["gp"]           = "Диверсантов",
        ["type"]         = "Класс",
        ["icon"]         = "Infiltrator TFT icon.svg",
        ["innate"]       = "В начале боя '''Диверсанты''' прыгают в тыл вражеских рядов.",
        ["synergy"]      = "'''Диверсанты''' получают {{As|'''дополнительную''' скорость атаки}} на первые 6 секунд боя, а также при добивании врага.",
        ["diamondtrait"] = true,
        ["levels"]       = {
            [2] = "50%",
            [4] = "75%",
            [6] = "120%"
        },
        ["item"]         = "Когти диверсанта"
    },
    ["Заступник"] = {
        ["engname"]      = "Protector",
        ["gs"]           = "Заступника",
        ["gp"]           = "Заступников",
        ["type"]         = "Класс",
        ["icon"]         = "Protector TFT icon.svg",
        ["synergy"]      = "'''Защитники''' получают щит на 3 секунды всякий раз, когда активируют свое умение.",
        ["diamondtrait"] = true,
        ["levels"]       = {
            [2] = "Прочность щита – {{as|25% '''макс.''' здоровья}}",
            [4] = "Прочность щита – {{as|30% '''макс.''' здоровья}}",
            [6] = "Прочность щита – {{as|40% '''макс.''' здоровья}}"
        },
        ["item"]         = "Нагрудник заступника"
    },
    ["Звездный защитник"] = {
        ["engname"] = "Star Guardian",
        ["gs"]      = "Звездных защитника",
        ["gp"]      = "Звездных защитников",
        ["type"]    = "Фракция",
        ["icon"]    = "Star Guardian TFT icon.svg",
        ["synergy"] = "Всякий раз, когда один '''Звездный защитник''' использует умение, между остальными '''Звездными защитниками''' поровну распределяется некоторое количество {{As|маны}}",
        ["levels"]  = {
            [3] = "30 маны",
            [6] = "50 маны"
        },
        ["item"]    = "Кулон Звездного защитника"
    },
    ["Звездолет"] = {
        ["engname"] = "Starship",
        ["type"] = "Класс",
        ["icon"] = "Starship TFT icon.svg",
        ["synergy"] = "[[File:Starship TFT gold icon.png|20px|link=]] '''Звездолет''' получает {{as|40 маны}} в секунду, безостановочно двигается по полю боя и невосприимчив к эффектам, огранививающим передвижение. '''Звездолет''' не может использовать автоатаки."
    },
    ["Кибервоин"] = {
        ["engname"] = "Cybernetic",
        ["gs"]      = "Кибервоина",
        ["gp"]      = "Кибервоинов",
        ["type"]    = "Фракция",
        ["icon"]    = "Cybernetic TFT icon.svg",
        ["synergy"] = "Если '''Кибервоин''' экипирован {{TFTl|предмет|предметом}}, то он получит бонус к {{As|силе атаки}} и {{as|здоровью}}.",
        ["levels"]  = {
            [3] = "35 силы атаки и 350 здоровья",
            [6] = "70 силы атаки и 700 здоровья"
        }
    },
    ["Космопират"] = {
        ["engname"] = "Space Pirate",
        ["gs"]      = "Космопирата",
        ["gp"]      = "Космопиратов",
        ["type"]    = "Фракция",
        ["icon"]    = "Space Pirate TFT icon.svg",
        ["synergy"] = "Убитый '''Космопиратом''' враг может оставить после себя дополнительную добычу.",
        ["levels"]  = {
            [2] = "50% шанса выпадения {{g|1}}",
            [4] = "50% шанса выпадения {{g|1}} и 25% − базового предмета."
        }
    },
    ["Космострелок"] = {
        ["engname"] = "Blaster",
        ["gs"]      = "Космострелка",
        ["gp"]      = "Космострелков",
        ["type"]    = "Класс",
        ["icon"]    = "Blaster TFT icon.svg",
        ["synergy"] = "Каждую четвертую атаку '''Космотрелок''' делает несколько дополнительных выстрелов в случайных врагов.",
        ["levels"]  = {
            [2] = "3 дополнительных атаки",
            [4] = "5 дополнительных атак"
        }
    },
    ["Мастер клинка"] = {
        ["engname"]      = "Blademaster",
        ["gs"]           = "Мастера клинка",
        ["gp"]           = "Мастеров клинка",
        ["type"]         = "Класс",
        ["icon"]         = "Blademaster TFT icon.svg",
        ["synergy"]      = "При каждой автоатаке у '''Мастеров клинка''' появляется шанс нанести ещё 2 удара в быстрой последовательности.",
        ["diamondtrait"] = true,
        ["levels"]       = {
            [3] = "30% шанс",
            [6] = "55% шанс",
            [9] = "100% шанс"
        },
        ["item"]         = "Клинок уничтоженного короля"
    },
    ["Мистик"] = {
        ["engname"] = "Mystic",
        ["gs"]      = "Мистика",
        ["gp"]      = "Мистиков",
        ["type"]    = "Класс",
        ["icon"]    = "Mystic TFT icon.svg",
        ["synergy"] = "Все союзники получают {{as|'''доп.''' сопротивление магии}}.",
        ["levels"]  = {
            [2] = "35",
            [4] = "105"
        }
    },
    ["Наемник"] = {
        ["engname"] = "Mercenary",
        ["type"] = "Класс",
        ["icon"] = "Mercenary TFT icon.svg",
        ["synergy"] = "Когда '''Наемник''' в команде или на скамейке запасных, в магазине игрока с некоторой вероятностью появляются Улучшения для этого '''Наемника''' стоимостью в {{g|8}} за каждое. Каждого Наемника можно усилить до 3 раз."
    },
    ["Небожитель"] = {
        ["engname"] = "Celestial",
        ["gs"]      = "Небожителя",
        ["gp"]      = "Небожителей",
        ["type"]    = "Фракция",
        ["icon"]    = "Celestial TFT icon.svg",
        ["synergy"] = "Все союзники исцеляются на процент от нанесенного урона.",
        ["levels"]  = {
            [2] = "15%",
            [4] = "35%",
            [6] = "60%"
        },
        ["item"]    = "Сфера небожителя"
    },
    ["Обитатель Бездны"] = {
        ["engname"] = "Void",
        ["gs"]      = "Обитателя Бездны",
        ["gp"]      = "Обитателей Бездны",
        ["type"]    = "Фракция",
        ["icon"]    = "Void TFT icon.svg",
        ["synergy"] = "Если в команде [[File:Void TFT gold icon.png|20px]] 3 '''Обитателя Бездны''', то все '''Обитатели Бездны''' наносят {{as|чистый урон}}."
    },
    ["Пилот меха"] = {
        ["engname"] = "Mech-Pilot",
        ["gs"]      = "Пилота меха",
        ["gp"]      = "Пилотов меха",
        ["type"]    = "Фракция",
        ["icon"]    = "Mech-Pilot TFT icon.svg",
        ["synergy"] = "Если в команде не менее [[File:Mech-Pilot TFT gold icon.png|20px|link=]] 3 '''Пилотов меха''', то в начале боя 3 случайных '''Пилота робота''' объединяются в одного '''Супермеха''', который существует, пока не умрет. '''Супермеха''' совмещает классы '''Пилотов''' и получает 3 случайно выбранных предмета из инвентарей '''Пилотов'''. Когда '''Супермеха''' умирает, '''Пилоты''' катапультируются с {{as|35% здоровья}} и продолжают сражаться по отдельности как обычно."
    },
    ["Повстанец"] = {
        ["engname"]      = "Rebel",
        ["gs"]           = "Повстанца",
        ["gp"]           = "Повстанцев",
        ["type"]         = "Фракция",
        ["icon"]         = "Rebel TFT icon.svg",
        ["synergy"]      = "В начале боя '''Повстанцы''' получают щит на 8 секунд и бонус к урону за каждого примыкающего '''Повстанца'''. Прочность щита не зависит от {{As|силы умений}}.",
        ["diamondtrait"] = true,
        ["levels"]       = {
            [3] = "150 прочности щита и +10% урона",
            [6] = "210 прочности щита и +12% урона",
            [9] = "330 прочности щита и +15% урона"
        },
        ["item"]         = "Медаль повстанца"
    },
    ["Подрывник"] = {
        ["engname"] = "Demolitionist",
        ["gs"]      = "Подрывника",
        ["gp"]      = "Подрывников",
        ["type"]    = "Класс",
        ["icon"]    = "Demolitionist TFT icon.svg",
        ["synergy"] = "Пока в команде [[File:Demolitionist TFT gold icon.png|20px]] 2 '''Подрывника''', умения всех '''Подрывников''' {{tip|TFT оглушение|оглушают}} цели на {{fd|1.5}} секунды.",
        ["item"]    = "Заряд подрывника"
    },
    ["Похититель маны"] = {
        ["engname"] = "Mana-Reaver",
        ["gs"]      = "Похитителя маны",
        ["gp"]      = "Похитителей маны",
        ["type"]    = "Класс",
        ["icon"]    = "Mana-Reaver TFT icon.svg",
        ["synergy"] = "Когда в команде [[File:Mana-Reaver TFT gold icon.png|20px]] 2 '''Похитителей маны''', то автоатаки '''Похитителей маны''' увеличивают затраты маны следующего заклинания цели на 40%."
    },
    ["Снайпер"] = {
        ["engname"] = "Sniper",
        ["gs"]      = "Снайпера",
        ["gp"]      = "Снайперов",
        ["type"]    = "Класс",
        ["icon"]    = "Sniper TFT icon.svg",
        ["synergy"] = "Пока в команде хотя бы [[File:Sniper TFT gold icon.png|20px|link=]] 2 '''Снайпера''', все '''Снайперы''' наносят на 15% больше урона за каждый гекс до цели."
    },
    ["Темная Звезда"] = {
        ["engname"]      = "Dark Star",
        ["gs"]           = "Темных Звезды",
        ["gp"]           = "Темных Звезд",
        ["type"]         = "Фракция",
        ["icon"]         = "Dark Star TFT icon.svg",
        ["synergy"]      = "Когда умирает '''Темная звезда''', остальные '''Темные звезды''' получают бонус к {{as|силе атаки}} и {{as|силе умений}} до конца боя.",
        ["diamondtrait"] = true,
        ["levels"]       = {
            [3] = "+20",
            [6] = "+25",
            [9] = "+35"
        },
        ["item"]         = "Сердце Темной Звезды"
    },
    ["Хроновоин"] = {
        ["engname"] = "Chrono",
        ["gs"]      = "Хроновоина",
        ["gp"]      = "Хроновоинов",
        ["type"]    = "Фракция",
        ["icon"]    = "Chrono TFT icon.svg",
        ["synergy"] = "Все союзники получают {{as|15% скорости атаки}} в начале боя, а затем каждые несколько секунд.",
        ["levels"]  = {
            [2] = "8 секунд",
            [4] = "{{fd|3.5}} секунды",
            [6] = "{{fd|1.5}} секунды"
        }
    },
    ["Чародей"] = {
        ["engname"]      = "Sorcerer",
        ["gs"]           = "Чародея",
        ["gp"]           = "Чародеев",
        ["type"]         = "Класс",
        ["icon"]         = "Sorcerer TFT icon.svg",
        ["synergy"]      = "{{tip|Tft сила умений|{{as|Сила умений}}}} всех союзников увеличена",
        ["diamondtrait"] = true,
        ["levels"]       = {
            [2] = "+20",
            [4] = "+40",
            [6] = "+75",
            [8] = "+120"
        }
    },
}
-- </pre>
-- [[Category:Lua]]
