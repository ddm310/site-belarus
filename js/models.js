
// ========================================
// КАТАЛОГ ТРАКТОРОВ BELARUS
// ========================================

const tractors = [
    {
        id: 1,
        name: "МТЗ-80",
        image: "images/1.jpg",
        power: 80,
        category: "universal",
        type: "Универсальный",
        drive: "4×2",
        description: "Легендарный универсально-пропашной трактор. Один из символов белорусского машиностроения."
    },
    {
        id: 2,
        name: "БЕЛАРУС-82.1",
        image: "images/3143.970.jpg",
        power: 81,
        category: "universal",
        type: "Универсальный",
        drive: "4×4",
        description: "Полноприводный трактор для сельскохозяйственных, транспортных и коммунальных работ."
    },
    {
        id: 3,
        name: "БЕЛАРУС-320",
        image: "images/2.jpg",
        power: 36,
        category: "compact",
        type: "Компактный",
        drive: "4×4",
        description: "Компактная техника для небольших хозяйств, садов и коммунальных служб."
    },
    {
        id: 4,
        name: "БЕЛАРУС-622",
        image: "images/6221.jpg",
        power: 62,
        category: "compact",
        type: "Компактный",
        drive: "4×4",
        description: "Манёвренный трактор для разнообразных работ в ограниченном пространстве."
    },
    {
        id: 5,
        name: "БЕЛАРУС-921",
        image: "images/12121.jpg",
        power: 95,
        category: "universal",
        type: "Универсальный",
        drive: "4×4",
        description: "Универсально-пропашной трактор для обработки почвы и других сельскохозяйственных задач."
    },
    {
        id: 6,
        name: "БЕЛАРУС-1221",
        image: "images/1221.jpg",
        power: 130,
        category: "powerful",
        type: "Мощный",
        drive: "4×4",
        description: "Многофункциональная машина для выполнения энергоёмких сельскохозяйственных работ."
    },
    {
        id: 7,
        name: "БЕЛАРУС-1523",
        image: "images/1523.jpg",
        power: 150,
        category: "powerful",
        type: "Мощный",
        drive: "4×4",
        description: "Трактор повышенной мощности для работы с разнообразными сельскохозяйственными агрегатами."
    },
    {
        id: 8,
        name: "БЕЛАРУС-2022.3",
        image: "images/2022.jpg",
        power: 210,
        category: "powerful",
        type: "Мощный",
        drive: "4×4",
        description: "Энергонасыщенный трактор для крупных хозяйств и широкозахватного оборудования."
    },
    {
        id: 9,
        name: "БЕЛАРУС-3522",
        image: "images/dsc00664.jpg",
        power: 355,
        category: "powerful",
        type: "Мощный",
        drive: "4×4",
        description: "Высокомощная сельскохозяйственная машина для выполнения тяжёлых полевых работ."
    }
];

// ========================================
// ПОЛУЧАЕМ ЭЛЕМЕНТЫ СТРАНИЦЫ
// ========================================

const grid = document.getElementById("modelsGrid");
const searchInput = document.getElementById("modelSearch");
const filterSelect = document.getElementById("modelFilter");
const sortSelect = document.getElementById("modelSort");
const counter = document.getElementById("modelCounter");

const emptyMessage = document.getElementById("emptyMessage");
const resetFilters = document.getElementById("resetFilters");

const comparePlaceholder = document.getElementById("comparePlaceholder");
const compareResult = document.getElementById("compareResult");
const selectedCount = document.getElementById("selectedCount");
const clearComparison = document.getElementById("clearComparison");

// Массив выбранных для сравнения моделей
let selectedModels = [];

// ========================================
// СОЗДАНИЕ КАРТОЧЕК
// ========================================

function createCard(model, index) {

    const isSelected = selectedModels.includes(model.id);

    const card = document.createElement("article");

    card.className = "catalog-model";

    card.style.animationDelay = `${Math.min(index, 8) * 0.05}s`;

    card.innerHTML = `
        <div class="catalog-model-image">

            <span class="catalog-model-tag">
                ${model.type}
            </span>

            <img
                src="${model.image}"
                alt="Трактор ${model.name}"
                loading="lazy"
            >

        </div>

        <div class="catalog-model-body">

            <h3>${model.name}</h3>

            <p>${model.description}</p>

            <div class="catalog-specs">

                <div class="catalog-spec">
                    <small>Мощность</small>
                    <strong>${model.power} л.с.</strong>
                </div>

                <div class="catalog-spec">
                    <small>Колёсная формула</small>
                    <strong>${model.drive}</strong>
                </div>

            </div>

            <button
                type="button"
                class="catalog-compare-btn ${isSelected ? "selected" : ""}"
                data-id="${model.id}"
                aria-pressed="${isSelected}"
            >
                ${isSelected ? "✓ Выбрано" : "⇄ Сравнить"}
            </button>

        </div>
    `;

    return card;
}

// ========================================
// ПОИСК, ФИЛЬТРЫ И СОРТИРОВКА
// ========================================

function renderModels() {

    const query = searchInput.value.trim().toLowerCase();
    const category = filterSelect.value;
    const sort = sortSelect.value;

    let result = tractors.filter(model => {

        const matchesSearch =
            model.name.toLowerCase().includes(query) ||
            model.description.toLowerCase().includes(query);

        const matchesCategory =
            category === "all" || model.category === category;

        return matchesSearch && matchesCategory;
    });

    // Сортировка

    if (sort === "asc") {
        result.sort((a, b) => a.power - b.power);
    }

    if (sort === "desc") {
        result.sort((a, b) => b.power - a.power);
    }

    if (sort === "name") {
        result.sort((a, b) =>
            a.name.localeCompare(b.name, "ru")
        );
    }

    // Очищаем каталог

    grid.innerHTML = "";

    // Добавляем карточки

    result.forEach((model, index) => {
        grid.appendChild(createCard(model, index));
    });

    // Обновляем счётчик

    counter.textContent = `Найдено: ${result.length}`;

    // Сообщение, если ничего не найдено

    emptyMessage.hidden = result.length !== 0;
}

// ========================================
// ВЫБОР МОДЕЛЕЙ ДЛЯ СРАВНЕНИЯ
// ========================================

function toggleComparison(id) {

    if (selectedModels.includes(id)) {

        // Повторное нажатие убирает модель
        selectedModels = selectedModels.filter(item => item !== id);

    } else {

        // Не разрешаем выбирать больше двух моделей
        if (selectedModels.length >= 2) {
            alert(
                "Можно сравнить только две модели. " +
                "Сначала уберите одну из выбранных."
            );
            return;
        }

        selectedModels.push(id);
    }

    renderModels();
    renderComparison();
}

// ========================================
// ТАБЛИЦА СРАВНЕНИЯ
// ========================================

function renderComparison() {

    selectedCount.textContent =
        `Выбрано: ${selectedModels.length} из 2`;

    clearComparison.hidden = selectedModels.length === 0;

    if (selectedModels.length !== 2) {

        comparePlaceholder.hidden = false;
        compareResult.hidden = true;
        compareResult.innerHTML = "";

        return;
    }

    const first = tractors.find(
        model => model.id === selectedModels[0]
    );

    const second = tractors.find(
        model => model.id === selectedModels[1]
    );

    comparePlaceholder.hidden = true;
    compareResult.hidden = false;

    // Разница в мощности

    const difference = Math.abs(first.power - second.power);

    compareResult.innerHTML = `

        <table class="compare-table">

            <thead>
                <tr>
                    <th>Характеристика</th>
                    <th>${first.name}</th>
                    <th>${second.name}</th>
                </tr>
            </thead>

            <tbody>

                <tr>
                    <td>Изображение</td>

                    <td>
                        <img src="${first.image}" alt="${first.name}">
                    </td>

                    <td>
                        <img src="${second.image}" alt="${second.name}">
                    </td>
                </tr>

                <tr>
                    <td>Мощность</td>
                    <td>${first.power} л.с.</td>
                    <td>${second.power} л.с.</td>
                </tr>

                <tr>
                    <td>Категория</td>
                    <td>${first.type}</td>
                    <td>${second.type}</td>
                </tr>

                <tr>
                    <td>Колёсная формула</td>
                    <td>${first.drive}</td>
                    <td>${second.drive}</td>
                </tr>

                <tr>
                    <td>Разница мощности</td>
                    <td colspan="2">
                        ${difference} л.с.
                    </td>
                </tr>

            </tbody>

        </table>

        <p style="margin-top:18px; color:#647267; font-size:13px;">
            Значения мощности приведены ориентировочно.
            Характеристики зависят от конкретной модификации.
        </p>
    `;
}

// ========================================
// ОБРАБОТЧИКИ СОБЫТИЙ
// ========================================

// Поиск в реальном времени
searchInput.addEventListener("input", renderModels);

// Изменение фильтра
filterSelect.addEventListener("change", renderModels);

// Изменение сортировки
sortSelect.addEventListener("change", renderModels);

// Нажатие кнопок сравнения
grid.addEventListener("click", event => {

    const button = event.target.closest(".catalog-compare-btn");

    if (!button) return;

    const id = Number(button.dataset.id);

    toggleComparison(id);
});

// Сброс фильтров
resetFilters.addEventListener("click", () => {

    searchInput.value = "";
    filterSelect.value = "all";
    sortSelect.value = "default";

    renderModels();
});

// Очистка сравнения
clearComparison.addEventListener("click", () => {

    selectedModels = [];

    renderModels();
    renderComparison();
});

// ========================================
// ПЕРВОНАЧАЛЬНАЯ ЗАГРУЗКА
// ========================================

renderModels();
renderComparison();
