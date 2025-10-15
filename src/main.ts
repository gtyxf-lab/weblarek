import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { Cart } from './components/models/Cart';
import { ProductCatalog } from './components/models/ProductCatalog';
import { Basket, IBasket } from './components/view/Basket';
import { CatalogCard } from './components/view/Card/CatalogCard';
import { DetailedCard } from './components/view/Card/DetailedCard';
import { Gallery } from './components/view/Gallery';
import { Header } from './components/view/Header';
import { Modal } from './components/view/Modal';
import './scss/styles.scss';
import { ShopApi } from './services/ShopApi';
import { IApiProductList, IProduct } from './types';
import { API_URL, categoryMap } from './utils/constants';
import { cloneTemplate } from './utils/utils';

const baseApi = new Api(API_URL);
const shopApi = new ShopApi(baseApi);
const events = new EventEmitter();

const catalog = new ProductCatalog(events);
const catalogElements: HTMLElement[] = [];

const galleryElement = document.querySelector('.gallery') as HTMLElement;
const gallery = new Gallery(events, galleryElement);

const modalElement = document.querySelector('#modal-container') as HTMLElement;
const modal = new Modal(events, modalElement);

const headerElement = document.querySelector('.header') as HTMLElement;
const header = new Header(events, headerElement);

const cart = new Cart(events);
const basketTemplate = cloneTemplate<HTMLElement>('#basket');
const basket = new Basket(events, basketTemplate);

let currentDetailedCard: DetailedCard | null;
 
events.on('catalog:updated', (data: { products: IProduct[] }) => {
  catalogElements.length = 0;

  data.products.forEach(item => {
    const cardElement = cloneTemplate<HTMLElement>('#card-catalog');
    const catalogCard = new CatalogCard(events, cardElement, categoryMap);
    catalogElements.push(catalogCard.render(item));
  })

  gallery.render({ catalog: catalogElements });

  console.log('Массив карточек каталога:', catalogElements);
})

events.on('catalog:select', (data: { id: string}) => {
  const selectedItem = catalog.getProductById(data.id);
  if (selectedItem) {
    catalog.setDetailedProduct(selectedItem);
  }
})

events.on('catalog:detailedUpdated', (data: { detailedProduct: IProduct}) => {
  const detailedCardTemplate = cloneTemplate<HTMLElement>('#card-preview');
  currentDetailedCard = new DetailedCard(events, detailedCardTemplate, categoryMap);
  const cardContent = currentDetailedCard.render({
    ...data.detailedProduct,
    addButtonText: data.detailedProduct.price === null
      ? 'Недоступно'
      : cart.checkItemInCartById(data.detailedProduct.id) ? 'Удалить из корзины' : 'В корзину',
    addButtonDisabled: data.detailedProduct.price === null
  });

  
  modal.render({data: cardContent});
  modal.isOpen = true;
})

events.on('modal:close', () => {
  modal.isOpen = false;
  currentDetailedCard = null;
})

events.on('basket:open', () => {
  const cartData: IBasket = {
    totalPrice: cart.getCartItemsPrice(),
    items: cart.getCartItems().map((item, index) => ({
      id: item.id,
      title: item.title,
      category: item.category,
      price: item.price,
      image: item.image,
      index: index + 1,
    }))
  }
  basket.render(cartData);

  modal.render({ data: basket.render(cartData) });
  modal.isOpen = true;
})

events.on('basket:addCard', (data: { id: string }) => {
  const item = catalog.getProductById(data.id);
  if (!item) {
    console.error('Продукт не найден по id:', data.id);
    return;
  }
  if (item.price === null) {
    return;
  }

  const isInBasket = cart.checkItemInCartById(data.id)
  if (isInBasket) {
    cart.removeProductFromCart(data.id);
    console.log('Товар удален из корзины:', item);
  } else {
    cart.addProductInCart(item);
    console.log('Товар добавлен в корзину:', item);
  }


  if (currentDetailedCard) {
    currentDetailedCard.addButtonText = isInBasket ? 'В корзину' : 'Удалить из корзины';
    currentDetailedCard.addButtonDisabled = false;
  }

  header.counter = cart.getCartItemsCount();
})

events.on('basket:deleteCard', (data: { id: string }) => {
  cart.removeProductFromCart(data.id);
})

events.on('cart:updated', (data: { items: IProduct[], total: number, count: number; }) => {
  const cartData: IBasket = {
    items: data.items.map((item, index) => ({
      id: item.id,
      title: item.title,
      category: item.category,
      price: item.price,
      image: item.image,
      index: index + 1
    })),
    totalPrice: data.total,
  };

  basket.render(cartData);
  header.counter = data.count;
})

shopApi.getProductList()
  .then((response: IApiProductList) => {
    if (!Array.isArray(response.items)) {
      throw new Error('API вернул некорректные данные')
    }
    catalog.setProductCatalog(response.items);

    console.log('Каталог товаров из API:', catalog.getProductCatalog());
  })
