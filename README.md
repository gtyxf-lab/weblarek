# Проектная работа "Веб-ларек"

**Стек:** HTML, SCSS, TypeScript, Vite

**Структура проекта:**
- `src/` — исходные файлы проекта
- `src/components/` — папка с TypeScript-компонентами
- `src/components/base/` — папка с базовым кодом
- `src/components/models/` — папка с моделями данных
- `src/components/view/` — папка с компонентами представления
- `src/components/view/Card/` — папка с компонентами карточек
- `src/components/view/Form/` — папка с компонентами форм
- `src/services/` — папка с сервисами для работы с API
- `src/types/` — папка с интерфейсами и типами
- `src/utils/` — папка с утилитами и константами

**Важные файлы:**
- `index.html` — HTML-файл главной страницы
- `src/main.ts` — точка входа приложения
- `src/scss/styles.scss` — корневой файл стилей
- `src/types/index.ts` — файл с типами
- `src/utils/constants.ts` — файл с константами
- `src/utils/utils.ts` — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды:

```bash
npm install
npm run start
```

или

```bash
yarn
yarn start
```

## Сборка

```bash
npm run build
```

или

```bash
yarn build
```

# Интернет-магазин «Web-Larёk»

«Web-Larёk» — это интернет-магазин для веб-разработчиков, где пользователи могут просматривать каталог товаров, добавлять их в корзину и оформлять заказы. Приложение предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной, выбора способа оплаты и ввода контактных данных, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения организован по парадигме MVP (Model-View-Presenter), обеспечивающей чёткое разделение ответственности между слоями:

- **Model** — слой данных, отвечает за хранение и управление данными.
- **View** — слой представления, отвечает за отображение данных и взаимодействие с DOM.
- **Presenter** — слой логики, координирует взаимодействие между моделями и представлениями.

Взаимодействие между слоями реализовано через событийно-ориентированный подход с использованием класса `EventEmitter`. Модели и представления генерируют события, а презентер обрабатывает их, вызывая соответствующие методы.

### Данные

В проекте выделены две основные сущности данных: **Товар** и **Покупатель**, описанные следующими интерфейсами:

#### Интерфейс Товар

```ts
interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}
```

Описывает товар в магазине. Поля:
- `id` — уникальный идентификатор товара (строка).
- `description` — детальное описание товара (строка).
- `image` — путь к изображению товара (строка).
- `title` — название товара для отображения (строка).
- `category` — категория товара (строка).
- `price` — стоимость товара (число) или `null` (если товар "Бесценно").

#### Интерфейс Покупатель

```ts
interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}
```

Описывает данные покупателя для оформления заказа. Поля:
- `payment` — способ оплаты, тип `TPayment` (`'card'` или `'cash'`).
- `email` — электронная почта покупателя (строка).
- `phone` — номер телефона покупателя (строка).
- `address` — адрес доставки (строка).

### Модели данных

#### ProductCatalog

Модель для работы с каталогом товаров.

**Конструктор:**
- `constructor(events: IEvents, productCatalog: IProduct[] = [])` — принимает брокер событий и опциональный массив товаров.

**Поля:**
- `products: IProduct[]` — массив всех товаров.
- `detailedProduct: IProduct | null` — товар, выбранный для детального просмотра.

**Методы:**
- `setProductCatalog(productCatalog: IProduct[]): void` — сохраняет массив товаров и генерирует событие `catalog:updated`.
- `getProductCatalog(): IProduct[]` — возвращает массив товаров.
- `getProductById(id: string): IProduct | undefined` — возвращает товар по `id` или `undefined`, если товар не найден.
- `setDetailedProduct(detailedProduct: IProduct): void` — сохраняет товар для детального просмотра и генерирует событие `catalog:detailedUpdated`.
- `getDetailedProduct(): IProduct | null` — возвращает товар для детального просмотра или `null`.

#### Cart

Модель для работы с корзиной.

**Конструктор:**
- `constructor(events: IEvents, productsInCart: IProduct[] = [])` — принимает брокер событий и опциональный массив товаров.

**Поля:**
- `cartItems: IProduct[]` — массив товаров в корзине.

**Методы:**
- `getCartItems(): IProduct[]` — возвращает массив товаров в корзине.
- `addProductInCart(newProduct: IProduct): void` — добавляет товар в корзину и генерирует событие `cart:updated`.
- `removeProductFromCart(removableProductId: string): void` — удаляет товар по `id` и генерирует событие `cart:updated`.
- `clearCart(): void` — очищает корзину и генерирует событие `cart:updated`.
- `getCartItemsPrice(): number` — возвращает сумму цен товаров в корзине (игнорирует товары с `price: null`).
- `getCartItemsCount(): number` — возвращает количество товаров в корзине.
- `checkItemInCartById(id: string): boolean` — проверяет, есть ли товар с указанным `id` в корзине.

#### Buyer

Модель для работы с данными покупателя.

**Конструктор:**
- `constructor(events: IEvents, buyerInfo: Partial<IBuyer> = {})` — принимает брокер событий и опциональный объект с данными покупателя.

**Поля:**
- `payment: TPayment` — способ оплаты (`'card'` или `'cash'`).
- `email: string` — электронная почта.
- `phone: string` — номер телефона.
- `address: string` — адрес доставки.

**Методы:**
- `setInfo(field: TByuerFields, value: string | TPayment): void` — сохраняет значение для указанного поля и генерирует событие `buyer:updated`.
- `getInfo(): IBuyer` — возвращает объект с текущими данными покупателя.
- `clearInfo(): void` — сбрасывает все поля в пустые значения и генерирует событие `buyer:updated`.
- `validate(): IValidationResult` — проверяет валидность данных, возвращает объект с ошибками для полей `payment`, `address`, `email`, `phone`.

### Базовый код

#### Класс Component

Базовый класс для компонентов интерфейса.

**Конструктор:**
- `constructor(container: HTMLElement)` — принимает DOM-элемент, за который отвечает компонент.

**Поля:**
- `container: HTMLElement` — корневой DOM-элемент.

**Методы:**
- `render(data?: Partial<T>): HTMLElement` — обновляет данные компонента и возвращает `container`.
- `setImage(element: HTMLImageElement, src: string, alt?: string): void` — утилита для установки изображения в `<img>`.

#### Класс Api

Базовый класс для отправки HTTP-запросов.

**Конструктор:**
- `constructor(baseUrl: string, options: RequestInit = {})` — принимает базовый URL и опциональные заголовки.

**Поля:**
- `baseUrl: string` — базовый адрес сервера.
- `options: RequestInit` — объект с настройками запросов.

**Методы:**
- `get(uri: string): Promise<object>` — выполняет GET-запрос.
- `post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` — выполняет POST-запрос.
- `handleResponse(response: Response): Promise<object>` — обрабатывает ответ сервера.

#### Класс EventEmitter

Реализует паттерн "Наблюдатель" для обработки событий.

**Конструктор:**
- Не принимает параметров.

**Поля:**
- `_events: Map<string | RegExp, Set<Function>>` — коллекция подписок на события.

**Методы:**
- `on<T extends object>(event: EventName, callback: (data: T) => void): void` — подписка на событие.
- `emit<T extends object>(event: string, data?: T): void` — инициирует событие.
- `trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` — возвращает функцию для вызова события.

### Слой коммуникации

#### Класс ShopApi

Сервис для взаимодействия с сервером.

**Конструктор:**
- `constructor(api: Api)` — принимает экземпляр класса `Api`.

**Поля:**
- `api: IApi` — объект для HTTP-запросов.

**Методы:**
- `getProductList(): Promise<IApiProductList>` — получает список товаров (GET `/product/`).
- `submitOrder(data: IOrderData): Promise<object>` — отправляет заказ на сервер (POST `/order/`).

### Слой представления

Слой представления отвечает за отображение данных и захват пользовательских взаимодействий. Все классы наследуются от `Component<T>`, где `T` — интерфейс данных для рендеринга. Компоненты используют селекторы для поиска DOM-элементов и реализуют метод `render`.

#### Класс Card

Базовый класс для карточек товаров.

**Конструктор:**
- `constructor(container: HTMLElement, categoryMap: Record<string, string>)` — принимает DOM-элемент и объект с классами-модификаторами категорий.

**Поля:**
- `cardTitle: HTMLHeadingElement` — элемент заголовка.
- `cardPrice: HTMLSpanElement` — элемент цены.

**Методы:**
- `set title(value: string)` — устанавливает заголовок.
- `set price(value: number | null)` — устанавливает цену (`"Бесценно"` для `null`).

#### Класс Form

Базовый класс для форм.

**Конструктор:**
- `constructor(events: IEvents, container: HTMLElement)` — принимает брокер событий и DOM-элемент.

**Поля:**
- `submitButton: HTMLButtonElement` — кнопка отправки.
- `errorsContainer: HTMLSpanElement` — контейнер для ошибок.
- `formName: string` — имя формы.

**Методы:**
- `set errors(errors: string[])` — отображает ошибки.
- `set valid(valid: boolean)` — управляет состоянием кнопки.

#### Класс CatalogCard

Наследуется от `Card<ICardCatalog>`. Отображает карточку товара в каталоге (шаблон `#card-catalog`).

**Конструктор:**
- `constructor(events: IEvents, container: HTMLElement)` — вызывает `super(container, categoryMap)` и добавляет слушатель клика для события `catalog:select`.

**Поля:**
- `id: string` — идентификатор.
- `cardCategory: HTMLSpanElement` — элемент категории.
- `cardImage: HTMLImageElement` — элемент изображения.

**Методы:**
- `setId(value: string)` — устанавливает `id`.
- `set category(value: string)` — устанавливает категорию с модификатором.
- `set image(src: string)` — устанавливает изображение через `setImage`.

#### Класс DetailedCard

Наследуется от `Card<ICardDetailed>`. Отображает детальную карточку в модалке (шаблон `#card-preview`).

**Конструктор:**
- `constructor(events: IEvents, container: HTMLElement)` — вызывает `super(container, categoryMap)` и добавляет слушатель на кнопку для события `basket:addCard`.

**Поля:**
- `id: string` — идентификатор.
- `cardCategory: HTMLSpanElement` — элемент категории.
- `cardImage: HTMLImageElement` — элемент изображения.
- `descElement: HTMLParagraphElement` — элемент описания.
- `addButton: HTMLButtonElement` — кнопка добавления/удаления.

**Методы:**
- `setId(value: string)` — устанавливает `id`.
- `set category(value: string)` — устанавливает категорию.
- `set image(src: string)` — устанавливает изображение.
- `set description(value: string)` — устанавливает описание.
- `set addButtonText(value: string)` — устанавливает текст кнопки.
- `set addButtonDisabled(value: boolean)` — управляет состоянием кнопки.

#### Класс BasketCard

Наследуется от `Card<ICardInBasket>`. Отображает карточку товара в корзине (шаблон `#card-basket`).

**Конструктор:**
- `constructor(events: IEvents, container: HTMLElement)` — вызывает `super(container, {})` и добавляет слушатель на кнопку удаления для события `basket:deleteCard`.

**Поля:**
- `id: string` — идентификатор.
- `indexElement: HTMLSpanElement` — элемент номера в списке.
- `deleteButton: HTMLButtonElement` — кнопка удаления.

**Методы:**
- `setId(value: string)` — устанавливает `id`.
- `set index(value: number)` — устанавливает номер.

#### Класс Basket

Наследуется от `Component<IBasket>`. Отображает модалку корзины (шаблон `#basket`).

**Конструктор:**
- `constructor(events: IEvents, container: HTMLElement)` — вызывает `super(container)` и добавляет слушатель на кнопку для события `basket:confirm`.

**Поля:**
- `basketItemsList: HTMLUListElement` — список товаров.
- `priceElement: HTMLSpanElement` — элемент общей цены.
- `confirmButton: HTMLButtonElement` — кнопка оформления.

**Методы:**
- `set totalPrice(value: number)` — устанавливает цену.
- `set confirmButtonDisabled(disabled: boolean)` — управляет кнопкой.
- `set items(items: HTMLElement[])` — обновляет список товаров или отображает "Корзина пуста".

#### Класс OrderForm

Наследуется от `Form<IOrderForm>`. Форма выбора оплаты и адреса (шаблон `#order`).

**Конструктор:**
- `constructor(events: IEvents, container: HTMLElement)` — вызывает `super(events, container)` и добавляет слушатели на кнопки оплаты для события `order:paymentChange`.

**Поля:**
- `paymentButtons: HTMLButtonElement[]` — кнопки оплаты.
- `addressInput: HTMLInputElement` — поле адреса.

**Методы:**
- `set payment(value: TPayment)` — обновляет активность кнопок.
- `set address(value: string)` — устанавливает адрес.

#### Класс ContactsForm

Наследуется от `Form<IContactsForm>`. Форма ввода email и телефона (шаблон `#contacts`).

**Конструктор:**
- `constructor(events: IEvents, container: HTMLElement)` — вызывает `super(events, container)`.

**Поля:**
- `emailInput: HTMLInputElement` — поле email.
- `phoneInput: HTMLInputElement` — поле телефона.

**Методы:**
- `set email(value: string)` — устанавливает email.
- `set phone(value: string)` — устанавливает телефон.

#### Класс Success

Наследуется от `Component<ISuccess>`. Отображает блок успешного заказа (шаблон `#success`).

**Конструктор:**
- `constructor(events: IEvents, container: HTMLElement)` — вызывает `super(container)` и добавляет слушатель на кнопку для события `success:confirm`.

**Поля:**
- `title: HTMLHeadingElement` — заголовок.
- `desc: HTMLParagraphElement` — описание с суммой.
- `closeButton: HTMLButtonElement` — кнопка закрытия.

**Методы:**
- `set total(value: number)` — устанавливает текст с суммой.

#### Класс Gallery

Наследуется от `Component<IGallery>`. Отображает каталог товаров.

**Конструктор:**
- `constructor(events: IEvents, container: HTMLElement)` — вызывает `super(container)`.

**Поля:**
- `catalogElement: HTMLElement` — контейнер для карточек.

**Методы:**
- `set catalog(items: HTMLElement[])` — обновляет список карточек.

#### Класс Modal

Наследуется от `Component<IContent>`. Управляет модальным окном.

**Конструктор:**
- `constructor(events: IEvents, container: HTMLElement)` — вызывает `super(container)` и добавляет слушатели для события `modal:close`.

**Поля:**
- `modalContent: HTMLElement` — контейнер контента.
- `closeButton: HTMLButtonElement` — кнопка закрытия.

**Методы:**
- `set content(content: HTMLElement)` — заменяет содержимое.
- `set isOpen(value: boolean)` — переключает видимость модалки.

#### Класс Header

Наследуется от `Component<IHeader>`. Отображает счётчик корзины в шапке.

**Конструктор:**
- `constructor(events: IEvents, container: HTMLElement)` — вызывает `super(container)` и добавляет слушатель для события `basket:open`.

**Поля:**
- `counterElement: HTMLElement` — счётчик.
- `cartButton: HTMLButtonElement` — кнопка корзины.

**Методы:**
- `set counter(value: number)` — устанавливает значение счётчика.

### Презентер

Презентер реализован в файле `main.ts` как скрипт, координирующий работу приложения. Он инициализирует API, модели, представления и брокер событий, а также обрабатывает события для управления логикой.

**Инициализация:**
- Создаёт экземпляры `ShopApi`, `ProductCatalog`, `Cart`, `Buyer`, `Gallery`, `Modal`, `Header`, `Basket`, `OrderForm`, `ContactsForm`, `Success`.
- Клонирует шаблоны для `Basket`, `OrderForm`, `ContactsForm`, `Success`.
- Запрашивает товары через `ShopApi.getProductList` и устанавливает их в `ProductCatalog`.

**Обработка событий:**
- `catalog:updated` — рендерит карточки `CatalogCard` и обновляет `Gallery`.
- `catalog:select` — устанавливает товар в `ProductCatalog` для детального просмотра.
- `catalog:detailedUpdated` — рендерит `DetailedCard` и открывает модалку.
- `modal:close` — закрывает модалку.
- `basket:open` — рендерит `Basket` и открывает модалку.
- `basket:addCard` — добавляет/удаляет товар в `Cart` и закрывает модалку.
- `basket:deleteCard` — удаляет товар из `Cart`.
- `cart:updated` — обновляет `Basket` и счётчик в `Header`.
- `order:paymentChange` — обновляет `payment` в `Buyer`.
- `form:input` — обновляет поле в `Buyer`.
- `order:submit` — валидирует данные и переходит к `ContactsForm`.
- `contacts:submit` — валидирует данные, отправляет заказ через `ShopApi` и показывает `Success`.
- `buyer:updated` — обновляет формы с валидацией.
- `basket:confirm` — открывает `OrderForm`.
- `success:confirm` — закрывает модалку.