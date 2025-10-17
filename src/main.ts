import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { Buyer } from './components/models/Buyer';
import { Cart } from './components/models/Cart';
import { ProductCatalog } from './components/models/ProductCatalog';
import { Basket } from './components/view/Basket';
import { BasketCard } from './components/view/Card/BasketCard';
import { CatalogCard } from './components/view/Card/CatalogCard';
import { DetailedCard } from './components/view/Card/DetailedCard';
import { ContactsForm } from './components/view/Form/ContactsForm';
import { OrderForm } from './components/view/Form/OrderForm';
import { Gallery } from './components/view/Gallery';
import { Header } from './components/view/Header';
import { Modal } from './components/view/Modal';
import { Success } from './components/view/Success';
import './scss/styles.scss';
import { ShopApi } from './services/ShopApi';
import { IApiProductList, IBuyer, IOrderData, IProduct, TByuerFields, TPayment } from './types';
import { API_URL } from './utils/constants';
import { cloneTemplate } from './utils/utils';

const baseApi = new Api(API_URL);
const shopApi = new ShopApi(baseApi);
const events = new EventEmitter();

const catalog = new ProductCatalog(events);
const cart = new Cart(events);
const buyer = new Buyer(events);

const galleryElement = document.querySelector('.gallery') as HTMLElement;
const gallery = new Gallery(events, galleryElement);

const modalElement = document.querySelector('#modal-container') as HTMLElement;
const modal = new Modal(events, modalElement);

const headerElement = document.querySelector('.header') as HTMLElement;
const header = new Header(events, headerElement);

const basketTemplate = cloneTemplate<HTMLElement>('#basket');
const basket = new Basket(events, basketTemplate);

const orderTemplate = cloneTemplate<HTMLElement>('#order');
const orderForm = new OrderForm(events, orderTemplate);

const contactsTemplate = cloneTemplate<HTMLElement>('#contacts');
const contactsForm = new ContactsForm(events, contactsTemplate);

const successTemplate = cloneTemplate<HTMLElement>('#success');
const success = new Success(events, successTemplate);

events.on('catalog:updated', (data: { products: IProduct[] }) => {
  const catalogElements = data.products.map(item => {
    const cardElement = cloneTemplate<HTMLElement>('#card-catalog');
    const catalogCard = new CatalogCard(events, cardElement);
    return catalogCard.render(item);
  });
  gallery.render({ catalog: catalogElements });
});

events.on('catalog:select', (data: { id: string }) => {
  const selectedItem = catalog.getProductById(data.id);
  if (selectedItem) {
    catalog.setDetailedProduct(selectedItem);
  }
});

events.on('catalog:detailedUpdated', (data: { detailedProduct: IProduct }) => {
  const detailedCardTemplate = cloneTemplate<HTMLElement>('#card-preview');
  const detailedCard = new DetailedCard(events, detailedCardTemplate);
  const cardContent = detailedCard.render({
    ...data.detailedProduct,
    addButtonText: data.detailedProduct.price === null
      ? 'Недоступно'
      : cart.checkItemInCartById(data.detailedProduct.id) ? 'Удалить из корзины' : 'В корзину',
    addButtonDisabled: data.detailedProduct.price === null
  });
  modal.render({ content: cardContent, isOpen: true });
});

events.on('modal:close', () => {
  modal.isOpen = false;
});

events.on('basket:open', () => {
  const items = cart.getCartItems();
  const total = cart.getCartItemsPrice();
  const basketItems = items.map((item, index) => {
    const cardElement = cloneTemplate<HTMLElement>('#card-basket');
    const basketCard = new BasketCard(events, cardElement);
    return basketCard.render({ id: item.id, title: item.title, price: item.price, index: index + 1 });
  });

  basket.render({ items: basketItems, totalPrice: total });
  modal.render({ content: basket.render(), isOpen: true });
});

events.on('basket:addCard', (data: { id: string }) => {
  const item = catalog.getProductById(data.id);
  if (!item) {
    console.error('Продукт не найден по id:', data.id);
    return;
  }
  if (item.price === null) {
    return;
  }
  const isInBasket = cart.checkItemInCartById(data.id);
  if (isInBasket) {
    cart.removeProductFromCart(data.id);
  } else {
    cart.addProductInCart(item);
  }
  modal.isOpen = false;
});

events.on('basket:deleteCard', (data: { id: string }) => {
  cart.removeProductFromCart(data.id);
});

events.on('cart:updated', (data: { items: IProduct[], total: number, count: number }) => {
  header.counter = data.count;

  const basketItems = data.items.map((item, index) => {
    const cardElement = cloneTemplate<HTMLElement>('#card-basket')
    const basketCard = new BasketCard(events, cardElement);
    return basketCard.render({ id: item.id, title: item.title, price: item.price, index: index + 1 });
  });
  basket.render({ items: basketItems, totalPrice: data.total });
});

events.on('order:paymentChange', (data: { payment: TPayment }) => {
  buyer.setInfo('payment', data.payment);
});

events.on('form:input', (data: { field: TByuerFields; value: string }) => {
  buyer.setInfo(data.field, data.value);
});

events.on('order:submit', () => {
  const validation = buyer.validate();
  const errors = [validation.payment, validation.address].filter((e): e is string => Boolean(e));
  const valid = errors.length === 0;
  if (!valid) {
    orderForm.render({ valid: false, errors });
    return;
  }
  modal.render({ content: contactsForm.render({ email: buyer.getInfo().email, phone: buyer.getInfo().phone, valid: true, errors: [] }), isOpen: true });
});

events.on('contacts:submit', () => {
  const validation = buyer.validate();
  const errors = [validation.email, validation.phone].filter((e): e is string => Boolean(e));
  const valid = errors.length === 0;
  if (!valid) {
    contactsForm.render({ valid: false, errors });
    return;
  }
  const orderData: IOrderData = {
    ...buyer.getInfo(),
    total: cart.getCartItemsPrice(),
    items: cart.getCartItems().map(item => item.id)
  };
  shopApi.submitOrder(orderData)
    .then(() => {
      success.total = orderData.total;
      modal.render({ content: success.render(), isOpen: true });
      cart.clearCart();
      buyer.clearInfo();
    })
    .catch(error => console.error('Ошибка заказа:', error));
});

events.on('buyer:updated', (data: { field: TByuerFields | null, buyerData: IBuyer }) => {
  const validation = buyer.validate();
  if (data.field === 'payment' || data.field === 'address') {
    const errors = [validation.payment, validation.address].filter((e): e is string => Boolean(e));
    orderForm.render({ ...buyer.getInfo(), valid: errors.length === 0, errors });
  } else if (data.field === 'email' || data.field === 'phone') {
    const errors = [validation.email, validation.phone].filter((e): e is string => Boolean(e));
    contactsForm.render({ ...buyer.getInfo(), valid: errors.length === 0, errors });
  }
});

events.on('basket:confirm', () => {
  const validation = buyer.validate();
  const errors = [validation.payment, validation.address].filter((e): e is string => Boolean(e));
  modal.render({ content: orderForm.render({ ...buyer.getInfo(), valid: errors.length === 0, errors }), isOpen: true });
});

events.on('success:confirm', () => {
  modal.isOpen = false;
});

shopApi.getProductList()
  .then((response: IApiProductList) => {
    if (!Array.isArray(response.items)) {
      throw new Error('API вернул некорректные данные');
    }
    catalog.setProductCatalog(response.items);
  });